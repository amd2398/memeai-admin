
import Link from "next/link";
import { getAdminDatabase } from "@/lib/admin";
import {
    createProvider,
    updateProvider,
    deleteProvider,
} from "./actions";

export const instant = false;

export default async function ProvidersPage() {
    const supabase = await getAdminDatabase();

    const { data: providers, error } = await supabase
        .from("llm_providers")
        .select("id, name, description, website_url")
        .order("name");

    if (error) {
        throw new Error(error.message);
    }

    return (
        <main className="min-h-screen bg-black p-8 text-white">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/admin"
                    className="text-sm text-gray-400 hover:text-white"
                >
                    ← Back to Dashboard
                </Link>

                <h1 className="mt-8 text-3xl font-bold">
                    LLM Providers
                </h1>

                <p className="mt-2 text-gray-400">
                    Create, view, edit, and delete AI providers.
                </p>

                {/* CREATE PROVIDER */}
                <section className="mt-8 rounded-xl border border-gray-700 p-6">
                    <h2 className="mb-4 text-xl font-semibold">
                        Add New Provider
                    </h2>

                    <form action={createProvider} className="space-y-4">
                        <input
                            name="name"
                            placeholder="Provider name (e.g. Google)"
                            required
                            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3"
                        />

                        <input
                            name="description"
                            placeholder="Description (optional)"
                            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3"
                        />

                        <input
                            name="website_url"
                            type="url"
                            placeholder="Website URL (optional)"
                            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3"
                        />

                        <button
                            type="submit"
                            className="rounded-lg bg-white px-5 py-3 font-semibold text-black hover:bg-gray-200"
                        >
                            Add Provider
                        </button>
                    </form>
                </section>

                {/* PROVIDERS LIST */}
                <section className="mt-10">
                    <h2 className="mb-4 text-xl font-semibold">
                        Existing Providers
                    </h2>

                    {providers?.length === 0 ? (
                        <p className="rounded-xl border border-gray-700 p-6 text-gray-400">
                            No providers yet.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {providers?.map((provider) => (
                                <div
                                    key={provider.id}
                                    className="rounded-xl border border-gray-700 p-5"
                                >
                                    {/* UPDATE PROVIDER */}
                                    <form
                                        action={updateProvider}
                                        className="space-y-3"
                                    >
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={provider.id}
                                        />

                                        <label className="block text-sm text-gray-400">
                                            Name
                                        </label>
                                        <input
                                            name="name"
                                            defaultValue={provider.name}
                                            required
                                            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3"
                                        />

                                        <label className="block text-sm text-gray-400">
                                            Description
                                        </label>
                                        <input
                                            name="description"
                                            defaultValue={provider.description ?? ""}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3"
                                        />

                                        <label className="block text-sm text-gray-400">
                                            Website
                                        </label>
                                        <input
                                            name="website_url"
                                            type="url"
                                            defaultValue={provider.website_url ?? ""}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3"
                                        />

                                        <button
                                            type="submit"
                                            className="rounded-lg bg-blue-600 px-5 py-2 font-semibold hover:bg-blue-700"
                                        >
                                            Save Changes
                                        </button>
                                    </form>

                                    {/* DELETE PROVIDER */}
                                    <form action={deleteProvider} className="mt-4">
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={provider.id}
                                        />

                                        <button
                                            type="submit"
                                            className="rounded-lg bg-red-600 px-5 py-2 font-semibold hover:bg-red-700"
                                        >
                                            Delete Provider
                                        </button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
