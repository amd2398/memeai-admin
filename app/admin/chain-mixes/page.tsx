
import Link from "next/link";
import { getAdminDatabase } from "@/lib/admin";
import { updateMix, updateMixMembers } from "./actions";

export const instant = false;

const inputStyle =
    "w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white";

export default async function ChainMixesPage() {
    const supabase = await getAdminDatabase();

    const [
        { data: mixes, error: mixesError },
        { data: chains, error: chainsError },
        { data: members, error: membersError },
    ] = await Promise.all([
        supabase
            .from("prompt_chain_mixes")
            .select("*")
            .order("created_at", { ascending: false }),
        supabase.from("prompt_chains").select("id, name").order("name"),
        supabase
            .from("prompt_chain_mix_members")
            .select("mix_id, prompt_chain_id, weight"),
    ]);

    if (mixesError) throw new Error(mixesError.message);
    if (chainsError) throw new Error(chainsError.message);
    if (membersError) throw new Error(membersError.message);

    return (
        <main className="min-h-screen bg-black p-8 text-white">
            <div className="mx-auto max-w-5xl">
                <Link href="/admin" className="text-gray-400 hover:text-white">
                    ← Back to Dashboard
                </Link>

                <h1 className="mt-8 text-3xl font-bold">
                    Prompt Chain Mixes
                </h1>

                <p className="mt-2 text-gray-400">
                    View and update combinations of prompt chains.
                </p>

                {!mixes?.length && (
                    <p className="mt-8 text-gray-400">
                        No prompt chain mixes found.
                    </p>
                )}

                <div className="mt-8 space-y-8">
                    {mixes?.map((mix) => (
                        <section
                            key={mix.id}
                            className="rounded-xl border border-gray-700 p-6"
                        >
                            <h2 className="mb-5 text-xl font-semibold">
                                {mix.name}
                            </h2>

                            <form action={updateMix} className="space-y-4">
                                <input type="hidden" name="id" value={mix.id} />

                                <div>
                                    <label className="mb-2 block text-sm text-gray-400">
                                        Mix Name
                                    </label>
                                    <input
                                        name="name"
                                        defaultValue={mix.name}
                                        required
                                        className={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-gray-400">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        defaultValue={mix.description ?? ""}
                                        rows={3}
                                        className={inputStyle}
                                    />
                                </div>

                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        defaultChecked={mix.is_active}
                                    />
                                    Active
                                </label>

                                <button
                                    type="submit"
                                    className="rounded-lg bg-white px-5 py-2 font-semibold text-black"
                                >
                                    Save Mix
                                </button>
                            </form>

                            <div className="my-6 border-t border-gray-700" />

                            <h3 className="mb-4 text-lg font-semibold">
                                Prompt Chains in This Mix
                            </h3>

                            <form action={updateMixMembers} className="space-y-4">
                                <input
                                    type="hidden"
                                    name="mix_id"
                                    value={mix.id}
                                />

                                {chains?.map((chain) => {
                                    const member = members?.find(
                                        (item) =>
                                            item.mix_id === mix.id &&
                                            item.prompt_chain_id === chain.id
                                    );

                                    return (
                                        <div
                                            key={chain.id}
                                            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-700 p-4"
                                        >
                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    name={`chain_${chain.id}`}
                                                    defaultChecked={!!member}
                                                />
                                                {chain.name}
                                            </label>

                                            <div className="flex items-center gap-2">
                                                <label className="text-sm text-gray-400">
                                                    Weight
                                                </label>
                                                <input
                                                    type="number"
                                                    name={`weight_${chain.id}`}
                                                    defaultValue={member?.weight ?? 1}
                                                    min="0"
                                                    step="0.1"
                                                    className="w-24 rounded-lg border border-gray-600 bg-gray-900 p-2 text-white"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}

                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-5 py-2 font-semibold hover:bg-blue-700"
                                >
                                    Save Chain Selection
                                </button>
                            </form>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
}
