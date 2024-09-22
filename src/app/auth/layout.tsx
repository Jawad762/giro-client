import WelcomeGradient from "@/components/Auth/WelcomeGradient"

export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <section className="flex h-full p-4">
        <WelcomeGradient/>
        {children}
      </section>
    )
  }