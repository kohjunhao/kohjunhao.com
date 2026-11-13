import type { Metadata } from "next";
import { Geist, Newsreader } from "next/font/google";
import { Bar } from "@/components/bar";
import { leadText } from "@/lib/lead";
import { site } from "@/lib/site";
import "./site.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const ORIGIN = "https://kohjunhao.com";

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: leadText,
  metadataBase: new URL(ORIGIN),
  openGraph: {
    title: site.name,
    description: leadText,
    url: ORIGIN,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: leadText,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${geist.variable}`}>
      <body>
        <div className="wrap">
          <Bar />
          {children}
        </div>
      </body>
    </html>
  );
}
