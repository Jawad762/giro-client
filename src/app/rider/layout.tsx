'use client'
import { useAppSelector } from "@/redux/store"
import { useRouter } from "next/navigation"

export default function RiderLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    const user = useAppSelector(state => state.main.user)
    const router = useRouter()
    if (user && user.role !== 'rider') {
      router.push('/driver')
    }

    return (
      <section className="flex-1 flex flex-col">
        {children}
      </section>
    )
  }