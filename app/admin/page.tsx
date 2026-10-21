
import Link from "next/link";
import { getAdminDatabase, requireAdmin } from "@/lib/admin";

export const instant = false;

export default async function AdminPage() {
    const user = await requireAdmin();
    const supabase = await getAdminDatabase();

    const { count: userCount, error: usersError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

    const { count: memeCount, error: memesError } = await supabase
        .from("memes")
        .select("*", { count: "exact", head: true });

    const { data: votes, error: votesError } = await supabase
        .from("votes")
        .select("vote");

    if (usersError || memesError || votesError) {
        throw new Error("Failed to load dashboard statistics");
    }

    const upvotes = votes?.filter((vote) => vote.vote === "up").length ?? 0;
    const downvotes = votes?.filter((vote) => vote.vote === "down").length ?? 0;

    const stats = [
        { label: "Total Users", value: userCount ?? 0 },
        { label: "Total Memes", value: memeCount ?? 0 },
        { label: "Upvotes", value: upvotes },
        { label: "Downvotes", value: downvotes },
    ];

    const sections = [
        {
            title: "Users",
            description: "View registered users and their profiles.",
            href: "/admin/users",
        },
        {
            title: "AI-Generated Media",
            description: "Create, view, edit, and delete generated memes.",
            href: "/admin/memes",
        },
        {
            title: "Votes",
            description: "View upvotes and downvotes.",
            href: "/admin/votes",
        },
    ];

    return (
        <main className="min-h-screen bg-black px-6 py-16 text-white">
            <div className="mx-auto max-w-6xl">
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-gray-500">
                    MemeAI Administration
                </p>

                <h1 className="text-5xl font-black">
                    Admin Dashboard
                </h1>

                <p className="mt-4 text-lg text-gray-400">
                    Welcome! You are signed in as {user.email}.
                </p>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-gray-800 bg-zinc-950 p-6"
                        >
                            <h2 className="text-lg text-gray-400">
                                {stat.label}
                            </h2>

                            <p className="mt-3 text-4xl font-black">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                <h2 className="mt-16 text-2xl font-bold">
                    Manage Database
                </h2>

                <div className="mt-6 grid gap-6 sm:grid-cols-3">
                    {sections.map((section) => (
                        <Link
                            key={section.title}
                            href={section.href}
                            className="rounded-2xl border border-gray-800 bg-zinc-950 p-6 transition hover:border-gray-500 hover:bg-zinc-900"
                        >
                            <h3 className="text-xl font-bold">
                                {section.title} →
                            </h3>

                            <p className="mt-3 text-base text-gray-400">
                                {section.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
