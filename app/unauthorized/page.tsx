import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
            <div className="w-full max-w-md rounded-3xl border border-gray-800 bg-zinc-950 p-10 text-center">
                <p className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-500">
                    MemeAI Administration
                </p>

                <h1 className="mb-4 text-4xl font-black">
                    Access Denied
                </h1>

                <p className="mb-8 text-gray-400">
                    Your account does not have permission to access the
                    MemeAI admin dashboard.
                </p>

                <Link
                    href="/login"
                    className="inline-block rounded-xl bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-200"
                >
                    Back to Login
                </Link>
            </div>
        </main>
    );
}