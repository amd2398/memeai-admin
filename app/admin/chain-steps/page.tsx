
import Link from "next/link";
import { getAdminDatabase } from "@/lib/admin";

export const instant = false;

export default async function ChainStepsPage() {
    const supabase = await getAdminDatabase();

    const { data: steps, error } = await supabase
        .from("prompt_chain_steps")
        .select(`
      id,
      step_order,
      prompt_template,
      temperature,
      prompt_chains(name),
      llm_models(name)
    `)
        .order("step_order");

    if (error) throw new Error(error.message);

    return (
        <main className="min-h-screen bg-black p-8 text-white">
            <div className="mx-auto max-w-6xl">
                <Link href="/admin" className="text-gray-400 hover:text-white">
                    ← Back to Dashboard
                </Link>

                <h1 className="mt-8 text-3xl font-bold">
                    Prompt Chain Steps
                </h1>
                <p className="mt-2 text-gray-400">
                    View the individual steps in each AI prompt chain.
                </p>

                <div className="mt-8 overflow-x-auto rounded-xl border border-gray-700">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900">
                        <tr>
                            <th className="p-4">Chain</th>
                            <th className="p-4">Step</th>
                            <th className="p-4">Model</th>
                            <th className="p-4">Prompt</th>
                            <th className="p-4">Temperature</th>
                        </tr>
                        </thead>

                        <tbody>
                        {steps?.map((step) => {
                            const chain = Array.isArray(step.prompt_chains)
                                ? step.prompt_chains[0]
                                : step.prompt_chains;

                            const model = Array.isArray(step.llm_models)
                                ? step.llm_models[0]
                                : step.llm_models;

                            return (
                                <tr key={step.id} className="border-t border-gray-700">
                                    <td className="p-4">{chain?.name ?? "—"}</td>
                                    <td className="p-4">{step.step_order}</td>
                                    <td className="p-4">{model?.name ?? "—"}</td>
                                    <td className="p-4 whitespace-pre-wrap">
                                        {step.prompt_template}
                                    </td>
                                    <td className="p-4">
                                        {step.temperature ?? "—"}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>

                    {!steps?.length && (
                        <p className="p-6 text-center text-gray-400">
                            No prompt chain steps found.
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}
