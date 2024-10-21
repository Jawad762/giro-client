import { JwtType, LiveRideMapInfo, UserType, VehicleInfo } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface InitialState {
  user: UserType | null
  jwt: JwtType | null
  liveRideInfo : LiveRideMapInfo | null
  vehicleInfo: VehicleInfo | null
}

const initialState: InitialState = {
  user: null,
  jwt: null,
  liveRideInfo: null,
  vehicleInfo: null
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload
    },
    updateJwt: (state, action: PayloadAction<JwtType | null>) => {
      state.jwt = action.payload
    },
    updateLiveRideInfo: (state, action: PayloadAction<LiveRideMapInfo | null>) => {
      state.liveRideInfo = action.payload
    },
    updateVehicleInfo: (state, action: PayloadAction<VehicleInfo | null>) => {
      state.vehicleInfo = action.payload
    },
    logout: (state) => {
      state.jwt = null
      state.user = null
      state.vehicleInfo = null
    }
  },
})

export const { updateUser, updateJwt, updateLiveRideInfo, updateVehicleInfo, logout } = mainSlice.actions

export default mainSlice.reducer