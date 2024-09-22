import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import { createPersistStorage } from './storage'
import mainSlice from './mainSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

const persistConfig = {
  key: 'persist',
  storage: createPersistStorage(),
}

const rootReducer = combineReducers({
  main: mainSlice,
})

const makeConfiguredStore = () => configureStore({
    reducer: rootReducer,
})

export const makeStore = () => {
  const isServer = typeof window === 'undefined'
  if (isServer) {
    return makeConfiguredStore()
  } else {
    const persistedReducer = persistReducer(persistConfig, rootReducer)
    let store: any = configureStore({
      reducer: persistedReducer,
    })
    store.__persistor = persistStore(store)
    return store
  }
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;