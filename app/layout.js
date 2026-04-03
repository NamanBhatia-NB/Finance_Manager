import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ScrollProvider } from "@/components/ScrollContext";
import { RoleProvider } from "@/components/RoleContext";
import { MockDataProvider } from "@/components/MockDataContext";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Finance Manager",
  description: "Smart assistant to manage your personal finances",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      layout: {
        unsafe_disableDevelopmentModeWarnings: true,
      },
    }}>
      <RoleProvider>
        <MockDataProvider>
          <ScrollProvider>
            <html lang="en" suppressHydrationWarning>
              <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#ffffff" />
                <script dangerouslySetInnerHTML={{
                  __html: `
                  if ('serviceWorker' in navigator) {
                    window.addEventListener('load', () => {
                      navigator.serviceWorker.register('/service-worker.js');
                    });
                  }
                `
                }} />
              </head>
              <body className={`${inter.className}`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                  <Header />
                  <main className="min-h-screen">
                    {children}
                  </main>
                  <Toaster />
                  <Footer />
                </ThemeProvider>
              </body>
            </html>
          </ScrollProvider>
        </MockDataProvider>
      </RoleProvider>
    </ClerkProvider>
  );
}
