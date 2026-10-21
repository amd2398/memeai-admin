"use client";

import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
    const handleLogin = async () => {
        const supabase = createClient();

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            alert(error.message);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
            <div className="w-full max-w-md rounded-3xl border border-gray-800 bg-zinc-950 p-10 text-center">
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-gray-500">
                    MemeAI
                </p>

                <h1 className="mb-4 text-4xl font-black">
                    Admin Login
                </h1>

                <p className="mb-8 text-gray-400">
                    Sign in with your Google account to access the admin dashboard.
                </p>

                <button
                    onClick={handleLogin}
                    className="w-full cursor-pointer rounded-xl bg-white px-6 py-4 font-bold text-black transition hover:bg-gray-200"
                >
                    Continue with Google
                </button>
            </div>
        </main>
    );
}