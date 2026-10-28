
import Link from "next/link";
import { getAdminDatabase } from "@/lib/admin";

export const instant = false;

export default async function ChainsPage() {
    const supabase = await getAdminDatabase();

    const { data: chains, error } = await supabase
        .from("prompt_chains")
        .select("id, name, description, is_active, created_at")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (
        <main className="min-h-screen bg-black p-8 text-white">
            <div className="mx-auto max-w-6xl">
                <Link href="/admin" className="text-gray-400 hover:text-white">
                    ← Back to Dashboard
                </Link>

                <h1 className="mt-8 text-3xl font-bold">Prompt Chains</h1>
                <p className="mt-2 text-gray-400">
                    View sequences of AI generation tasks.
                </p>

                <div className="mt-8 overflow-x-auto rounded-xl border border-gray-700">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Created</th>
                        </tr>
                        </thead>
                        <tbody>
                        {chains?.map((chain) => (
                            <tr key={chain.id} className="border-t border-gray-700">
                                <td className="p-4">{chain.name}</td>
                                <td className="p-4">{chain.description || "—"}</td>
                                <td className="p-4">
                                    {chain.is_active ? "Active" : "Inactive"}
                                </td>
                                <td className="p-4">
                                    {chain.created_at
                                        ? new Date(chain.created_at).toLocaleDateString("en-US")
                                        : "—"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {!chains?.length && (
                        <p className="p-6 text-center text-gray-400">
                            No prompt chains found.
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}
