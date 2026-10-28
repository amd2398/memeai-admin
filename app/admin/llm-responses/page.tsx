
import Link from "next/link";
import { getAdminDatabase } from "@/lib/admin";

export const instant = false;

export default async function LLMResponsesPage() {
    const supabase = await getAdminDatabase();

    const { data: responses, error } = await supabase
        .from("llm_responses")
        .select(`
      id,
      generation_request_id,
      llm_model_id,
      prompt_chain_step_id,
      response_text,
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
                    LLM Responses
                </h1>

                <p className="mt-2 text-gray-400">
                    View AI-generated responses and their associated requests.
                </p>

                <div className="mt-8 overflow-x-auto rounded-xl border border-gray-700">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900">
                        <tr>
                            <th className="p-4">Response</th>
                            <th className="p-4">Model ID</th>
                            <th className="p-4">Request ID</th>
                            <th className="p-4">Step ID</th>
                            <th className="p-4">Created</th>
                        </tr>
                        </thead>

                        <tbody>
                        {responses?.map((response) => (
                            <tr
                                key={response.id}
                                className="border-t border-gray-700"
                            >
                                <td className="p-4 whitespace-pre-wrap">
                                    {response.response_text || "—"}
                                </td>
                                <td className="p-4 text-sm break-all">
                                    {response.llm_model_id || "—"}
                                </td>
                                <td className="p-4 text-sm break-all">
                                    {response.generation_request_id || "—"}
                                </td>
                                <td className="p-4 text-sm break-all">
                                    {response.prompt_chain_step_id || "—"}
                                </td>
                                <td className="p-4">
                                    {response.created_at
                                        ? new Date(response.created_at)
                                            .toLocaleString("en-US")
                                        : "—"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {!responses?.length && (
                        <p className="p-6 text-center text-gray-400">
                            No LLM responses found.
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}
