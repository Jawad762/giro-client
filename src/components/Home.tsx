'use client'
import { updateJwt } from '@/redux/mainSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { useRouter } from 'next/navigation'
import React from 'react'

const Home = () => {
  const user = useAppSelector(state => state.main.user)
  const router = useRouter()
  const dispatch = useAppDispatch()

  const logout = () => {
    dispatch(updateJwt(null))
    router.push('/auth/login')
  }

  return (
    <section className='h-full flex flex-col justify-center items-center gap-3'>
      <h2>Welcome, {user.firstName} {user.lastName}.</h2>
      <button onClick={logout} className='bg-bluePrimary rounded-full py-2 px-6'>Log out</button>
    </section>
  )
}

export default Home