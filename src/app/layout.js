import { Geist, Inter, Space_Grotesk } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
import ReduxProvider from "@/components/providers/ReduxProvider";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import SmoothScroll from "@/components/animations/SmoothScroll";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata = {
  title: "VOLT ATHLETICS | Engineered for movement",
  description: "Performance apparel designed for training, running and everything between.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <ReduxProvider>
          <AuthProvider>
            <SmoothScroll>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </SmoothScroll>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
