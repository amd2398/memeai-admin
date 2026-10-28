
import Link from "next/link";
import { getAdminDatabase, requireAdmin } from "@/lib/admin";

export const instant = false;

const groups = [
    {
        title: "Content & Community",
        description: "Manage users, memes, and interactions.",
        items: [
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
            {
                title: "Images",
                description: "Upload, view, edit, and delete images.",
                href: "/admin/images",
            },
        ],
    },
    {
        title: "AI & Prompt Workflows",
        description: "Manage AI models, prompts, and generation data.",
        items: [
            {
                title: "Prompt Chains",
                description: "View AI generation workflows.",
                href: "/admin/chains",
            },
            {
                title: "Prompt Chain Steps",
                description: "View individual steps in each prompt chain.",
                href: "/admin/chain-steps",
            },
            {
                title: "Prompt Chain Mixes",
                description: "View and update combinations of prompt chains.",
                href: "/admin/chain-mixes",
            },
            {
                title: "LLM Models",
                description: "Create, view, edit, and delete AI models.",
                href: "/admin/models",
            },
            {
                title: "LLM Providers",
                description: "Manage AI service providers.",
                href: "/admin/providers",
            },
            {
                title: "AI Generation Examples",
                description: "Manage example prompts and generated outputs.",
                href: "/admin/examples",
            },
            {
                title: "Generation Requests",
                description: "View AI generation requests and their statuses.",
                href: "/admin/generation-requests",
            },
            {
                title: "LLM Responses",
                description: "View AI-generated responses.",
                href: "/admin/llm-responses",
            },
            {
                title: "Terms",
                description: "Manage humor terms and categories.",
                href: "/admin/terms",
            },
        ],
    },
    {
        title: "Access & Settings",
        description: "Manage signup domains and email exceptions.",
        items: [
            {
                title: "Allowed Signup Domains",
                description: "Manage approved email domains.",
                href: "/admin/allowed-domains",
            },
            {
                title: "Whitelisted Emails",
                description: "Manage individual approved email addresses.",
                href: "/admin/whitelisted-emails",
            },
        ],
    },
];

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

    const upvotes =
        votes?.filter((vote) => vote.vote === "up").length ?? 0;

    const downvotes =
        votes?.filter((vote) => vote.vote === "down").length ?? 0;

    const stats = [
        { label: "Total Users", value: userCount ?? 0 },
        { label: "Total Memes", value: memeCount ?? 0 },
        { label: "Upvotes", value: upvotes },
        { label: "Downvotes", value: downvotes },
    ];

    return (
        <main className="min-h-screen bg-black px-6 py-16 text-white">
            <div className="mx-auto max-w-6xl">

                {/* HEADER */}
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-gray-500">
                    MemeAI Administration
                </p>

                <h1 className="text-5xl font-black">
                    Admin Dashboard
                </h1>

                <p className="mt-4 text-lg text-gray-400">
                    Welcome! You are signed in as {user.email}.
                </p>

                {/* STATISTICS */}
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

                {/* DATABASE SECTIONS */}
                <div className="mt-16 space-y-14">
                    {groups.map((group) => (
                        <section key={group.title}>
                            <h2 className="text-2xl font-bold">
                                {group.title}
                            </h2>

                            <p className="mt-2 text-gray-400">
                                {group.description}
                            </p>

                            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {group.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="group rounded-2xl border border-gray-800 bg-zinc-950 p-6 transition hover:border-gray-500 hover:bg-zinc-900"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <h3 className="text-xl font-bold">
                                                {item.title}
                                            </h3>

                                            <span className="text-xl text-gray-500 transition group-hover:translate-x-1 group-hover:text-white">
                        →
                      </span>
                                        </div>

                                        <p className="mt-3 text-base text-gray-400">
                                            {item.description}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* FOOTER */}
                <footer className="mt-20 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
                    MemeAI Administration
                </footer>
            </div>
        </main>
    );
}
