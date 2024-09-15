import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ReduxProvider from "./components/ReduxProvider";
import AuthProvider from "./components/AuthProviders";
import SessionCleanup from "./features/SessionCleanup";
import Header from "./components/Header"; // Import du Header
import MenuLink from "./components/MenuLink";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Shop-Together",
  description:
    "Shop-Together est une plateforme collaborative qui permet aux utilisateurs de créer, gérer et partager des listes de courses en temps réel avec leurs groupes d'amis, leur famille ou leurs colocataires. Avec des fonctionnalités d'authentification via Google et Facebook, et une interface intuitive, Shop-Together simplifie la gestion des courses en groupe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ReduxProvider>
            <Header />
            <MenuLink />
            {children}
            <SessionCleanup /> {/* Composant client pour gérer la session */}
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
