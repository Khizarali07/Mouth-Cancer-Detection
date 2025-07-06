import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Mouth Vision",
  description:
    "Mouth Vision - Empowering early detection of mouth cancer using advanced AI technology.",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} overflow-y-auto font-poppins antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
