
import "./../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "doyen.ai",
  description:
    "Empowering CPGs, Distributors, and Retailers with the capabilities to maximize profit and revenue through ‘data & people’-driven Revenue Growth Management.",
  openGraph: {
    title: "doyen.ai",
    description:
      "Empowering CPGs, Distributors, and Retailers with the capabilities to maximize profit and revenue through ‘data & people’-driven Revenue Growth Management.",
    url: "https://doyen.ai",
    siteName: "doyen.ai",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "doyen.ai",
    description:
      "Empowering CPGs, Distributors, and Retailers with the capabilities to maximize profit and revenue through ‘data & people’-driven Revenue Growth Management.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
