'use client'
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";

export default function Home() {
  const user = useAppSelector(state => state.main.user)
  const router = useRouter()
  if (user && user.isConfirmed) router.push(`/${user.role}`)
  else if (user && !user.isConfirmed) router.push('/verifyEmail')
}