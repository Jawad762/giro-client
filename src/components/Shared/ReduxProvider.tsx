'use client'

import { AppStore, makeStore } from '@/redux/store'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

export let store: AppStore;

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode
}) {

  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  store = storeRef.current

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={storeRef.current.__persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}