"use client";

import Image from "next/image";
import Link from "next/link";
import { FaDiscord, FaLinkedin } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogin = () => {
    // For now, just navigate to a login page (e.g., "/login")
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <Image
          src="/logo.png"
          alt="Technical Projects Club Logo"
          width={250}
          height={60}
          priority
        />
      </div>

      {/* Right Side: Social Icons + Login */}
      <div className="flex items-center space-x-6">
        <Link
          href="https://www.linkedin.com/company/tpc-chico"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin className="w-6 h-6 text-red-600 hover:text-red-800 transition-colors" />
        </Link>
        <Link
          href="https://discord.gg/Pyb84Ebu8v"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaDiscord className="w-6 h-6 text-red-600 hover:text-red-800 transition-colors" />
        </Link>
        <button
          onClick={handleLogin}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          Login
        </button>
      </div>
    </header>
  );
}
