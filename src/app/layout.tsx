import "./globals.css";
import { danaMedium, danaLight, danaBold, morabbaReg } from "./fonts";
import NextTopLoader from "nextjs-toploader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${danaMedium.variable} ${danaLight.variable} ${danaBold.variable} ${morabbaReg.variable} min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900`}
      >
        <NextTopLoader
          color="#f97316"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #f97316,0 0 5px #f97316"
        />
        {children}
      </body>
    </html>
  );
}

