import type { Metadata } from "next";
import { Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Koh Jun Hao",
    template: "%s · Koh Jun Hao",
  },
  description:
    "Operator, researcher — crypto, DeFi, AI. Writing and building, quietly.",
  metadataBase: new URL("https://kohjunhao.com"),
  openGraph: {
    title: "Koh Jun Hao",
    description:
      "Operator, researcher — crypto, DeFi, AI. Writing and building, quietly.",
    url: "https://kohjunhao.com",
    siteName: "Koh Jun Hao",
    type: "website",
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-canvas text-ink">
        {children}
        {modal}
        <div id="modal-root" />
      </body>
    </html>
  );
}
