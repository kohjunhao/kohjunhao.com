import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./sheet.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const DESCRIPTION = "Koh Jun Hao's site is a spreadsheet. Most of it already was one.";

export const metadata: Metadata = {
  title: {
    default: "Koh Jun Hao",
    template: "%s · Koh Jun Hao",
  },
  description: DESCRIPTION,
  metadataBase: new URL("https://kohjunhao.com"),
  openGraph: {
    title: "Koh Jun Hao",
    description: DESCRIPTION,
    url: "https://kohjunhao.com",
    siteName: "Koh Jun Hao",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Koh Jun Hao",
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
