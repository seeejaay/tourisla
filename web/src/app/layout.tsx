import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"], // You can adjust weights as needed
});

export const metadata: Metadata = {
  title: "Tourisla",
  description:
    "Discover and explore the best tourist destinations with Tourisla.",
  keywords: [
    "tourism",
    "Philippines",
    "tours",
    "travel",
    "tour packages",
    "experiences",
    "destinations",
    "Tourisla",
    "Bantayan Island",
    "bantayan",
  ],
  openGraph: {
    title:
      "Tourisla | Book Unique Tours & Experiences in Bantayan Island, Cebu, Philippines",
    description:
      "Find, book, and explore the best tourist destinations, guided tours, and unique experiences in Bantayan Island with Tourisla.",
    url: "https://tourisla.space",
    siteName: "Tourisla",
    type: "website",
    images: [
      {
        url: "https://tourisla.space/TourISLA_Logo.png",
        width: 1200,
        height: 630,
        alt: "Tourisla - Explore Bantayan Island",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
