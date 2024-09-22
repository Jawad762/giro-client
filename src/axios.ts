import axios from 'axios';
import { store } from './components/Shared/ReduxProvider';
import { updateJwt } from './redux/mainSlice';

export const api = axios.create({
    baseURL: 'http://localhost:5058/api',
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const { accessToken } = state.main.jwt;
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const state = store.getState(); 
                const { refreshToken } = state.main.jwt;

                if (!refreshToken) {
                    return Promise.reject(error);
                }

                const { data } = await axios.post('http://localhost:5058/api/auth/refresh', {}, { withCredentials: true, headers: {
                    "Authorization": `Bearer ${refreshToken}`
                } });

                store.dispatch(updateJwt({
                    refreshToken,
                    accessToken: data.accessToken
                }));

                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);
