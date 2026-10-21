
import Link from "next/link";
import { getAdminDatabase } from "@/lib/admin";
import MemeActions from "./MemeActions";
import CreateMemeForm from "./CreateMemeForm";

export const instant = false;

export default async function MemesPage() {
    const supabase = await getAdminDatabase();

    const { data: memes, error } = await supabase
        .from("memes")
        .select("id, created_at, user_id, image_url, prompt, caption")
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error("Failed to load memes");
    }

    return (
        <main className="min-h-screen bg-black px-6 py-16 text-white">
            <div className="mx-auto max-w-6xl">
                <Link
                    href="/admin"
                    className="text-base text-gray-400 hover:text-white"
                >
                    ← Back to Dashboard
                </Link>

                <h1 className="mt-8 text-4xl font-black">
                    AI-Generated Media
                </h1>

                <p className="mt-3 text-lg text-gray-400">
                    View and manage AI-generated memes.
                </p>

                <p className="mt-4 text-base text-gray-500">
                    Total memes: {memes?.length ?? 0}
                </p>

                <CreateMemeForm />

                {memes?.length === 0 ? (
                    <p className="mt-12 text-gray-400">
                        No memes have been generated yet.
                    </p>
                ) : (
                    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {memes.map((meme) => (
                            <div
                                key={meme.id}
                                className="overflow-hidden rounded-2xl border border-gray-800 bg-zinc-950"
                            >
                                <div className="aspect-square bg-zinc-900">
                                    {meme.image_url ? (
                                        <img
                                            src={meme.image_url}
                                            alt={meme.caption || "AI-generated meme"}
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-500">
                                            No image available
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <p className="text-sm font-semibold text-gray-500">
                                        Meme #{meme.id}
                                    </p>

                                    <h2 className="mt-3 text-lg font-bold">
                                        {meme.caption || "No caption"}
                                    </h2>

                                    <p className="mt-3 text-base text-gray-400">
                    <span className="font-semibold text-gray-300">
                      Prompt:
                    </span>{" "}
                                        {meme.prompt || "No prompt"}
                                    </p>

                                    <p className="mt-4 text-sm text-gray-500">
                                        Created:{" "}
                                        {new Date(meme.created_at).toLocaleDateString()}
                                    </p>

                                    <p className="mt-2 break-all font-mono text-xs text-gray-500">
                                        User: {meme.user_id}
                                    </p>

                                    <MemeActions
                                        id={meme.id}
                                        caption={meme.caption}
                                        prompt={meme.prompt}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
