import type { Metadata } from "next";
import ThemeRegistry from "../components/ThemeRegistry";
import "./globals.css";
import ReduxProvider from "@/redux/provider";
import NotistackProvider from "@/components/NotistackProvider";

export const metadata: Metadata = {
  title: "Candidate Onboarding",
  description: "Welcome to the team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <ThemeRegistry>
            <NotistackProvider>
              {children}
            </NotistackProvider>
          </ThemeRegistry>
        </ReduxProvider>
      </body>
    </html>
  );
}
