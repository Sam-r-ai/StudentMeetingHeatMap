"use client";

import Image from "next/image";
import Link from "next/link";
import { FaDiscord, FaLinkedin } from "react-icons/fa";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <Image
          src="/logo.png" // Correct path
          alt="Technical Projects Club Logo"
          width={250}
          height={60}
          priority
        />
      </div>

      {/* Social Icons */}
      <div className="flex items-center space-x-6">
        <Link
          href="https://www.linkedin.com/company/tpc-chico" //TPC LinkedIn
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin className="w-6 h-6 text-red-600 hover:text-red-800 transition-colors" />
        </Link>
        <Link
          href="https://discord.gg/ekb49NsP" //TPC Discord Server Link
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaDiscord className="w-6 h-6 text-red-600 hover:text-red-800 transition-colors" />
        </Link>
      </div>
    </header>
  );
}
//