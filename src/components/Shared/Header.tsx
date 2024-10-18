'use client'
import Image from 'next/image'
import React from 'react'
import logo from "../../../public/logo-notext.png";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { usePathname, useRouter } from 'next/navigation';
import { updateJwt, updateUser } from '@/redux/mainSlice';
import { IoIosArrowDown } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import Link from 'next/link';

const Header = () => {
    const user = useAppSelector(state => state.main.user)
    const router = useRouter()
    const path = usePathname()
    const dispatch = useAppDispatch()
  
    const logout = () => {
      router.push('/auth/login')
      dispatch(updateUser(null))
      dispatch(updateJwt(null))
    }

  return !path.startsWith('/auth') && user ? (
    <header className={`_container flex items-center absolute inset-x-0 z-10 ${path !== '/rider' && path !== '/driver' ? 'border-b border-darkSecondary' : ''}`}>
        <Image src={logo} alt="logo" height={50} width={50} />
        <Link href={`/${user.role}/profile`} className='flex items-center gap-2 ml-auto mr-4 rounded-full bg-white py-2 px-4 text-black text-sm'>{user.firstName} <IoIosArrowDown/></Link>
        <button onClick={logout} className='text-3xl'><IoLogOutOutline/></button>
    </header>
  ) : null
}

export default Header