import WelcomeGradient from "@/components/Auth/WelcomeGradient"

export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <section className="flex min-h-screen p-4">
        <WelcomeGradient/>
        {children}
      </section>
    )
  }