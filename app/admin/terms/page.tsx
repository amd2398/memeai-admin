
import Link from "next/link";
import { getAdminDatabase } from "@/lib/admin";
import { createTerm, updateTerm, deleteTerm } from "./actions";

export const instant = false;

export default async function TermsPage() {
    const supabase = await getAdminDatabase();

    const { data: terms, error } = await supabase
        .from("terms")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return (
        <main className="min-h-screen bg-black p-8 text-white">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/admin"
                    className="text-gray-400 hover:text-white"
                >
                    ← Back to Dashboard
                </Link>

                <h1 className="mt-10 text-3xl font-bold">
                    Terms
                </h1>

                <p className="mt-2 text-gray-400">
                    Manage terms and categories used in your application.
                </p>

                {/* CREATE */}
                <section className="mt-10 rounded-xl border border-gray-700 p-6">
                    <h2 className="mb-5 text-xl font-semibold">
                        Add New Term
                    </h2>

                    <form action={createTerm} className="space-y-4">
                        <input
                            name="term"
                            placeholder="Term (e.g. Sarcasm)"
                            required
                            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white"
                        />

                        <input
                            name="category"
                            placeholder="Category (e.g. Humor Style)"
                            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white"
                        />

                        <textarea
                            name="description"
                            placeholder="Description (optional)"
                            rows={3}
                            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white"
                        />

                        <button
                            type="submit"
                            className="rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200"
                        >
                            Add Term
                        </button>
                    </form>
                </section>

                {/* READ, UPDATE, DELETE */}
                <section className="mt-12">
                    <h2 className="mb-5 text-xl font-semibold">
                        Existing Terms
                    </h2>

                    {!terms?.length && (
                        <p className="text-gray-400">
                            No terms yet.
                        </p>
                    )}

                    <div className="space-y-5">
                        {terms?.map((term) => (
                            <div
                                key={term.id}
                                className="rounded-xl border border-gray-700 p-6"
                            >
                                <form
                                    action={updateTerm}
                                    className="space-y-4"
                                >
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={term.id}
                                    />

                                    <div>
                                        <label className="mb-2 block text-sm text-gray-400">
                                            Term
                                        </label>
                                        <input
                                            name="term"
                                            defaultValue={term.term ?? ""}
                                            required
                                            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm text-gray-400">
                                            Category
                                        </label>
                                        <input
                                            name="category"
                                            defaultValue={term.category ?? ""}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm text-gray-400">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            defaultValue={term.description ?? ""}
                                            rows={3}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="rounded-lg bg-white px-5 py-2 font-semibold text-black hover:bg-gray-200"
                                    >
                                        Save Changes
                                    </button>
                                </form>

                                <form action={deleteTerm} className="mt-4">
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={term.id}
                                    />

                                    <button
                                        type="submit"
                                        className="rounded-lg border border-red-700 px-5 py-2 text-red-400 hover:bg-red-950"
                                    >
                                        Delete Term
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
