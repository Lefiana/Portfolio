import "../styles/globals.css";
import Link from "next/link";

export const metadata = {
  title: "My Portfolio",
  description: "Showcasing my work and skills",
  icons:{
    
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="flex justify-center gap-6 p-4 bg-gray-800 text-white">
          <Link href="#about">About</Link>
          <Link href="#skills">Skills</Link>
          <Link href="#projects">Projects</Link>
          <Link href="#contact">Contact</Link>
          <Link href="/" className="ml-6 text-sm text-gray-400 font-extrabold">
            ←
          </Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}