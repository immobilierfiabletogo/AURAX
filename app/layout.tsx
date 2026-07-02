import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link"; 
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-geist-sans", 
});

export const metadata: Metadata = {
  title: "AURAX | Immobilier à Lomé",
  description: "Trouvez votre bien immobilier à Lomé, Togo. Appartements, maisons, villas et terrains disponibles sur AURAX.",
  metadataBase: new URL('https://au-rax.com'),
  openGraph: {
    title: "AURAX | Immobilier à Lomé",
    description: "La plateforme immobilière du Togo. Simple, rapide et vérifié.",
    url: "https://au-rax.com",
    siteName: "AURAX",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AURAX — La plateforme immobilière du Togo",
      }
    ],
    locale: "fr_TG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURAX | Immobilier à Lomé",
    description: "La plateforme immobilière du Togo.",
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        <Navbar />
        
        <main>{children}</main>

        {/* 2. Intégration du footer */}
        <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
          <Link href="/confidentialite" className="hover:text-slate-700 mx-2">
            Politique de confidentialité
          </Link>
          ·
          <Link href="/cgu" className="hover:text-slate-700 mx-2">
            Conditions d'utilisation
          </Link>
        </footer>
      </body>
    </html>
  )}
