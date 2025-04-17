"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Placeholder login logic
    if (email === "test@tpc.com" && password === "password") {
        alert("Login successful!");
      router.push("/dashboard"); // Redirect after login
    } else {
        alert("Invalid credentials");
    }
};

return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 space-y-4"
        >
        <h1 className="text-2xl font-bold text-center text-red-600">Login</h1>
        <div>
            <label className="block text-sm font-medium">Email</label>
            <input
            type="email"
            className="w-full px-3 py-2 mt-1 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        </div>
        <div>
            <label className="block text-sm font-medium">Password</label>
            <input
            type="password"
            className="w-full px-3 py-2 mt-1 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
        </div>
        <button
            type="submit"
            className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
        Log In
        </button>
        </form>
    </main>
);
}
