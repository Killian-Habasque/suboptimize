import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { SubscriptionProvider } from "@/features/subscriptions/subscription-context";
import QueryProvider from "@/features/offers/offer-provider";
import Header from "@/components/navigation/header";
import Footer from "@/components/navigation/footer";

export const metadata: Metadata = {
  title: "Suboptimize",
  description: "Suboptimize - Optimisez vos abonnements",
  icons: {
    icon: "/logo_favicon_light.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className="h-full">
        <QueryProvider>
          <SessionProvider>
            <SubscriptionProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
            </SubscriptionProvider>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
