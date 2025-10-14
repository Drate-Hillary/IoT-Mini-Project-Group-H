import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors position="top-right" />

          {/* footer */}
          <footer className="w-full border-t mt-4 p-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} IoT Mini Project Group H. All rights reserved.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
