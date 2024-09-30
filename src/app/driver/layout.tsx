'use client'

import { useAppSelector } from "@/redux/store"
import { useRouter } from "next/navigation"

export default function DriverLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const user = useAppSelector(state => state.main.user)
    const router = useRouter()

    if (user && user.role !== 'driver') {
      router.push('/rider')
    }

    return (
      <section className="flex-1 flex flex-col">
        {children}
      </section>
    )
  }