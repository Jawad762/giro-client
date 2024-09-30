import type { Metadata } from "next";
import "./globals.css";
import { Fira_Sans_Condensed } from 'next/font/google'
import { ReactQueryProvider } from "@/components/Shared/ReactQueryProvider";
import AuthChecker from "@/components/Auth/AuthChecker";
import ReduxProvider from "@/components/Shared/ReduxProvider";
import Header from "@/components/Shared/Header";

const MediumMontserrat = Fira_Sans_Condensed({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Giro",
  description: "Giro: Travel Anywhere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className="h-full w-full">
      <body
        className={`${MediumMontserrat.className} antialiased h-full w-full bg-darkPrimary text-white`}
      >
        <main className="h-full w-full flex flex-col">
          <ReduxProvider>
            <AuthChecker>
              <ReactQueryProvider>
                <Header/>
                {children}
              </ReactQueryProvider>
            </AuthChecker>
          </ReduxProvider>
        </main>
      </body>
    </html>
  );
}
