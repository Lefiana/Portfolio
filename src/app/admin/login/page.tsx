"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginpage(){
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState("");
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        try{
            const res = await fetch("/api/admin/auth/login", {
                method : "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
            });

            const data = await res.json();

            if (!res.ok){
                setError(data.error || "Login Failed");
                return;
            }

            localStorage.setItem("token", data.token);
            router.push("/admin/dashboard");
        }catch(err){
            setError("Something went wrong");
            console.error(err);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl mb-4">Admin Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-2 w-80">
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border"
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border"
            />
            <button type="submit" className="bg-blue-600 text-white p-2">
            Login
            </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}