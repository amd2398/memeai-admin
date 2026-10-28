
import Link from "next/link";
import { getAdminDatabase } from "@/lib/admin";

export const instant = false;

export default async function GenerationRequestsPage() {
    const supabase = await getAdminDatabase();

    const { data: requests, error } = await supabase
        .from("generation_requests")
        .select(`
      id,
      user_id,
      prompt_chain_id,
      input_text,
      status,
      created_at
    `)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (
        <main className="min-h-screen bg-black p-8 text-white">
            <div className="mx-auto max-w-6xl">
                <Link
                    href="/admin"
                    className="text-gray-400 hover:text-white"
                >
                    ← Back to Dashboard
                </Link>

                <h1 className="mt-8 text-3xl font-bold">
                    Generation Requests
                </h1>

                <p className="mt-2 text-gray-400">
                    View requests submitted for AI generation.
                </p>

                <div className="mt-8 overflow-x-auto rounded-xl border border-gray-700">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900">
                        <tr>
                            <th className="p-4">Input</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">User ID</th>
                            <th className="p-4">Chain ID</th>
                            <th className="p-4">Created</th>
                        </tr>
                        </thead>

                        <tbody>
                        {requests?.map((request) => (
                            <tr
                                key={request.id}
                                className="border-t border-gray-700"
                            >
                                <td className="p-4 whitespace-pre-wrap">
                                    {request.input_text || "—"}
                                </td>
                                <td className="p-4">
                                    {request.status || "—"}
                                </td>
                                <td className="p-4 text-sm break-all">
                                    {request.user_id || "—"}
                                </td>
                                <td className="p-4 text-sm break-all">
                                    {request.prompt_chain_id || "—"}
                                </td>
                                <td className="p-4">
                                    {request.created_at
                                        ? new Date(request.created_at)
                                            .toLocaleString("en-US")
                                        : "—"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {!requests?.length && (
                        <p className="p-6 text-center text-gray-400">
                            No generation requests found.
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}
