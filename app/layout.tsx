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
  description: "Trouvez votre bien immobilier à Lomé, Togo.",
};

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
  );
}