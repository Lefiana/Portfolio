import "../styles/globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Sean Mark Rey T. Teja | Computer Engineer ",
  description: "Showcasing my work and skills",
  icons:{
    
  }
};


const CLOUDINARY_GIF_URL = "https://res.cloudinary.com/dal65p2pp/image/upload/v1760888176/image-removebg-preview_ttbbit.png"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="flex items-center justify-between h-20 px-8 bg-gray-900 text-white shadow-lg sticky top-0 z-50 opacity-95">
          <Link href="/">
            <div>
            <Image 
              src={CLOUDINARY_GIF_URL}
              alt="My Profile GIF"
              width={20} // Tiny size
              height={20} 
              className="w-10 h-10 object-cover rounded-full" 
            />
            </div>
          </Link>

          <div className="flex items-center gap-8">
          <Link href="#about" className="hover:text-blue-400 transition duration-300">About</Link>
          <Link href="#skills" className="hover:text-blue-400 transition duration-300">Skills</Link>
          <Link href="#projects" className="hover:text-blue-400 transition duration-300">Projects</Link>
          <Link href="#contact" className="hover:text-blue-400 transition duration-300">Contact</Link>
          <Link href="/" className="ml-6 text-sm text-gray-400 font-extrabold">
            ←
          </Link>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}