import { JwtType, LiveRideMapInfo, UserType } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface InitialState {
  user: UserType | null
  jwt: JwtType | null
  liveRideInfo : LiveRideMapInfo | null
}

const initialState: InitialState = {
  user: null,
  jwt: null,
  liveRideInfo: null
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
    }
  },
})

export const { updateUser, updateJwt, updateLiveRideInfo } = mainSlice.actions

export default mainSlice.reducer