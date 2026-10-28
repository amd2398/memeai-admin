
import Link from "next/link";
import { getAdminDatabase } from "@/lib/admin";
import {
    createExample,
    updateExample,
    deleteExample,
} from "./actions";

export const instant = false;

const inputStyle =
    "w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white";

export default async function ExamplesPage() {
    const supabase = await getAdminDatabase();

    const { data: examples, error } = await supabase
        .from("ai_generation_examples")
        .select("id, title, input_text, output_text, description")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (
        <main className="min-h-screen bg-black p-8 text-white">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/admin"
                    className="text-gray-400 hover:text-white"
                >
                    ← Back to Dashboard
                </Link>

                <h1 className="mt-8 text-3xl font-bold">
                    AI Generation Examples
                </h1>

                <p className="mt-2 text-gray-400">
                    Manage example inputs and AI-generated captions.
                </p>

                <section className="mt-8 rounded-xl border border-gray-700 p-6">
                    <h2 className="mb-4 text-xl font-semibold">
                        Add New Example
                    </h2>

                    <form action={createExample} className="space-y-4">
                        <input
                            name="title"
                            placeholder="Title"
                            required
                            className={inputStyle}
                        />

                        <textarea
                            name="input_text"
                            placeholder="Input or image description"
                            rows={3}
                            className={inputStyle}
                        />

                        <textarea
                            name="output_text"
                            placeholder="Example caption or AI output"
                            rows={3}
                            required
                            className={inputStyle}
                        />

                        <textarea
                            name="description"
                            placeholder="Notes (optional)"
                            rows={2}
                            className={inputStyle}
                        />

                        <button
                            type="submit"
                            className="rounded-lg bg-white px-5 py-3 font-semibold text-black"
                        >
                            Add Example
                        </button>
                    </form>
                </section>

                <section className="mt-10 space-y-4">
                    <h2 className="text-xl font-semibold">
                        Existing Examples
                    </h2>

                    {!examples?.length && (
                        <p className="text-gray-400">No examples yet.</p>
                    )}

                    {examples?.map((example) => (
                        <div
                            key={example.id}
                            className="rounded-xl border border-gray-700 p-5"
                        >
                            <form
                                action={updateExample}
                                className="space-y-3"
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    value={example.id}
                                />

                                <label className="block text-sm text-gray-400">
                                    Title
                                </label>
                                <input
                                    name="title"
                                    defaultValue={example.title}
                                    required
                                    className={inputStyle}
                                />

                                <label className="block text-sm text-gray-400">
                                    Input
                                </label>
                                <textarea
                                    name="input_text"
                                    defaultValue={example.input_text ?? ""}
                                    rows={3}
                                    className={inputStyle}
                                />

                                <label className="block text-sm text-gray-400">
                                    AI Output
                                </label>
                                <textarea
                                    name="output_text"
                                    defaultValue={example.output_text}
                                    rows={3}
                                    required
                                    className={inputStyle}
                                />

                                <label className="block text-sm text-gray-400">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    defaultValue={example.description ?? ""}
                                    rows={2}
                                    className={inputStyle}
                                />

                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-5 py-2 font-semibold hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </form>

                            <form action={deleteExample} className="mt-4">
                                <input
                                    type="hidden"
                                    name="id"
                                    value={example.id}
                                />
                                <button
                                    type="submit"
                                    className="rounded-lg bg-red-600 px-5 py-2 font-semibold hover:bg-red-700"
                                >
                                    Delete Example
                                </button>
                            </form>
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
}
