import "./globals.css";
import { danaMedium, danaLight, danaBold, morabbaReg } from "./fonts";

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
        {children}
      </body>
    </html>
  );
}
