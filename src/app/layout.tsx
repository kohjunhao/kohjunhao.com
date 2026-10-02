import type { Metadata } from "next";
import { EB_Garamond, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "./v3.css";

const calSans = localFont({
  src: "../fonts/CalSansVF.woff2",
  variable: "--font-cal",
  weight: "400 700",
  display: "swap",
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500"],
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
    "Koh Jun Hao ships things. This is the log.",
  metadataBase: new URL("https://kohjunhao.com"),
  openGraph: {
    title: "Koh Jun Hao",
    description:
      "Koh Jun Hao ships things. This is the log.",
    url: "https://kohjunhao.com",
    siteName: "Koh Jun Hao",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Koh Jun Hao",
    description:
      "Koh Jun Hao ships things. This is the log.",
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
      className={`${calSans.variable} ${garamond.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-canvas text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-canvas focus:text-ink focus:px-4 focus:py-2 focus:border focus:border-accent focus:outline-none"
        >
          Skip to content
        </a>
        {children}
        {modal}
        <div id="modal-root" />
      </body>
    </html>
  );
}
