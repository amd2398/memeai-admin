
import Link from "next/link";
import { getAdminDatabase } from "@/lib/admin";

export default async function VotesPage() {
    // Verify superadmin access
    const supabase = await getAdminDatabase();

    // Fetch all votes, newest first
    const { data: votes, error: votesError } = await supabase
        .from("votes")
        .select("id, created_at, user_id, meme_id, vote")
        .order("created_at", { ascending: false });

    if (votesError) {
        throw new Error(
            "Failed to load votes: " + votesError.message
        );
    }

    const allVotes = votes ?? [];

    // Fetch the memes associated with these votes
    const memeIds = [
        ...new Set(allVotes.map((item) => item.meme_id)),
    ];

    const { data: memes, error: memesError } = memeIds.length
        ? await supabase
            .from("memes")
            .select("id, image_url, caption")
            .in("id", memeIds)
        : {
            data: [],
            error: null,
        };

    if (memesError) {
        throw new Error(
            "Failed to load memes: " + memesError.message
        );
    }

    // Fetch profiles of users who voted
    const userIds = [
        ...new Set(allVotes.map((item) => item.user_id)),
    ];

    const { data: profiles, error: profilesError } = userIds.length
        ? await supabase
            .from("profiles")
            .select("id, first_name, last_name")
            .in("id", userIds)
        : {
            data: [],
            error: null,
        };

    if (profilesError) {
        throw new Error(
            "Failed to load voter profiles: " + profilesError.message
        );
    }

    // Match each vote to its meme
    const memeMap = new Map(
        (memes ?? []).map((meme) => [meme.id, meme])
    );

    // Match each vote to the person who voted
    const profileMap = new Map(
        (profiles ?? []).map((profile) => [
            profile.id,
            profile,
        ])
    );

    const upvotes = allVotes.filter(
        (item) => item.vote === "up"
    ).length;

    const downvotes = allVotes.filter(
        (item) => item.vote === "down"
    ).length;

    return (
        <main className="mx-auto max-w-7xl px-8 py-12 text-white">
            <Link
                href="/admin"
                className="text-lg text-gray-400 hover:text-white"
            >
                ← Back to Dashboard
            </Link>

            <h1 className="mt-12 text-5xl font-bold">
                Votes
            </h1>

            <p className="mt-4 text-xl text-gray-400">
                View all upvotes and downvotes on MemeAI.
            </p>

            {/* Vote statistics */}
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-zinc-950 p-7">
                    <p className="text-lg text-gray-400">
                        Total Votes
                    </p>
                    <p className="mt-3 text-4xl font-bold">
                        {allVotes.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-zinc-950 p-7">
                    <p className="text-lg text-gray-400">
                        Upvotes
                    </p>
                    <p className="mt-3 text-4xl font-bold text-green-400">
                        {upvotes}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-zinc-950 p-7">
                    <p className="text-lg text-gray-400">
                        Downvotes
                    </p>
                    <p className="mt-3 text-4xl font-bold text-red-400">
                        {downvotes}
                    </p>
                </div>
            </div>

            {/* Votes table */}
            <div className="mt-12 overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-base">
                    <thead className="bg-zinc-900 text-gray-400">
                    <tr>
                        <th className="px-5 py-5">
                            Meme
                        </th>
                        <th className="px-5 py-5">
                            Voted By
                        </th>
                        <th className="px-5 py-5">
                            Vote
                        </th>
                        <th className="px-5 py-5">
                            Date
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {allVotes.map((item) => {
                        const meme = memeMap.get(item.meme_id);
                        const profile = profileMap.get(item.user_id);

                        const voterName = [
                            profile?.first_name,
                            profile?.last_name,
                        ]
                            .filter(Boolean)
                            .join(" ");

                        return (
                            <tr
                                key={item.id}
                                className="border-t border-slate-800"
                            >
                                {/* Meme thumbnail and caption */}
                                <td className="px-5 py-5">
                                    <div className="flex min-w-72 items-center gap-4">
                                        {meme?.image_url ? (
                                            <img
                                                src={meme.image_url}
                                                alt={
                                                    meme.caption ||
                                                    "Meme image"
                                                }
                                                className="h-20 w-20 shrink-0 rounded-lg bg-zinc-900 object-contain"
                                            />
                                        ) : (
                                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-xs text-gray-500">
                                                No image
                                            </div>
                                        )}

                                        <div className="max-w-xs">
                                            <p className="mb-1 text-sm text-gray-500">
                                                Meme #{item.meme_id}
                                            </p>

                                            <p className="line-clamp-3 text-base font-medium text-white">
                                                {meme?.caption ||
                                                    "Meme unavailable"}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Voter name and ID */}
                                <td className="px-5 py-5">
                                    <p className="whitespace-nowrap font-medium text-white">
                                        {voterName || "No name provided"}
                                    </p>
                                    <p className="mt-1 font-mono text-xs text-gray-500">
                                        {item.user_id}
                                    </p>
                                </td>

                                {/* Vote */}
                                <td className="px-5 py-5">
                                    {item.vote === "up" ? (
                                        <span className="font-semibold text-green-400">
                                                ↑ Upvote
                                            </span>
                                    ) : (
                                        <span className="font-semibold text-red-400">
                                                ↓ Downvote
                                            </span>
                                    )}
                                </td>

                                {/* Date */}
                                <td className="whitespace-nowrap px-5 py-5 text-gray-400">
                                    {new Date(
                                        item.created_at
                                    ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        timeZone: "UTC",
                                    })}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                {allVotes.length === 0 && (
                    <p className="p-8 text-center text-gray-400">
                        No votes yet.
                    </p>
                )}
            </div>

            <p className="mt-5 text-gray-500">
                Total vote records: {allVotes.length}
            </p>
        </main>
    );
}
