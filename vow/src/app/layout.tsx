import type { Metadata } from "next";
import {
  Geist,
  Cormorant_Garamond,
  Viaoda_Libre,
  Lora,
} from "next/font/google";
import "./globals.css";
import "./invitation.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Cormorant_Garamond({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Invitation typefaces. Viaoda Libre sets the couple's names and every section
// heading; Lora carries the running text. Both ship Vietnamese diacritics, which
// the studio's Cormorant/Geist pair does not.
const viaodaLibre = Viaoda_Libre({
  variable: "--font-thiep-display",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: "400",
  display: "swap",
});

const lora = Lora({
  variable: "--font-thiep-body",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vow · Your forever, beautifully told",
  description:
    "A thoughtful invitation studio for your most meaningful celebration.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${viaodaLibre.variable} ${lora.variable} h-full antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
