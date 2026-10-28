
import Link from "next/link";
import { getAdminDatabase } from "@/lib/admin";
import {
    createModel,
    updateModel,
    deleteModel,
} from "./actions";

export const instant = false;

export default async function ModelsPage() {
    const supabase = await getAdminDatabase();

    const [modelsResult, providersResult] = await Promise.all([
        supabase
            .from("llm_models")
            .select("*")
            .order("name"),
        supabase
            .from("llm_providers")
            .select("id, name")
            .order("name"),
    ]);

    if (modelsResult.error) {
        throw new Error(modelsResult.error.message);
    }

    if (providersResult.error) {
        throw new Error(providersResult.error.message);
    }

    const models = modelsResult.data ?? [];
    const providers = providersResult.data ?? [];

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
                    LLM Models
                </h1>

                <p className="mt-2 text-gray-400">
                    Manage AI models and their providers.
                </p>

                {/* CREATE */}
                <section className="mt-8 rounded-xl border border-gray-700 p-6">
                    <h2 className="mb-4 text-xl font-semibold">
                        Add New Model
                    </h2>

                    <form action={createModel} className="space-y-4">
                        <input
                            name="name"
                            placeholder="Model name"
                            required
                            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3"
                        />

                        <input
                            name="model_identifier"
                            placeholder="Model identifier (e.g. gemini-2.5-flash-lite)"
                            required
                            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3"
                        />

                        <select
                            name="provider_id"
                            required
                            defaultValue=""
                            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3"
                        >
                            <option value="" disabled>
                                Select provider
                            </option>
                            {providers.map((provider) => (
                                <option key={provider.id} value={provider.id}>
                                    {provider.name}
                                </option>
                            ))}
                        </select>

                        <textarea
                            name="description"
                            placeholder="Description (optional)"
                            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3"
                        />

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="supports_temperature"
                                defaultChecked
                            />
                            Supports temperature
                        </label>

                        <button
                            type="submit"
                            disabled={providers.length === 0}
                            className="rounded-lg bg-white px-5 py-3 font-semibold text-black disabled:opacity-50"
                        >
                            Add Model
                        </button>
                    </form>

                    {providers.length === 0 && (
                        <p className="mt-3 text-yellow-400">
                            Add an LLM provider first.
                        </p>
                    )}
                </section>

                {/* READ, UPDATE, DELETE */}
                <section className="mt-10 space-y-4">
                    <h2 className="text-xl font-semibold">
                        Existing Models
                    </h2>

                    {models.length === 0 && (
                        <p className="text-gray-400">No models yet.</p>
                    )}

                    {models.map((model) => (
                        <div
                            key={model.id}
                            className="rounded-xl border border-gray-700 p-5"
                        >
                            <form action={updateModel} className="space-y-3">
                                <input
                                    type="hidden"
                                    name="id"
                                    value={model.id}
                                />

                                <label className="block text-sm text-gray-400">
                                    Model name
                                </label>
                                <input
                                    name="name"
                                    defaultValue={model.name}
                                    required
                                    className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3"
                                />

                                <label className="block text-sm text-gray-400">
                                    Model identifier
                                </label>
                                <input
                                    name="model_identifier"
                                    defaultValue={model.model_identifier}
                                    required
                                    className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3"
                                />

                                <label className="block text-sm text-gray-400">
                                    Provider
                                </label>
                                <select
                                    name="provider_id"
                                    defaultValue={model.provider_id ?? ""}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3"
                                >
                                    <option value="">No provider</option>
                                    {providers.map((provider) => (
                                        <option key={provider.id} value={provider.id}>
                                            {provider.name}
                                        </option>
                                    ))}
                                </select>

                                <label className="block text-sm text-gray-400">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    defaultValue={model.description ?? ""}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3"
                                />

                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="supports_temperature"
                                        defaultChecked={model.supports_temperature}
                                    />
                                    Supports temperature
                                </label>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-blue-600 px-5 py-2 font-semibold hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>

                            <form action={deleteModel} className="mt-4">
                                <input
                                    type="hidden"
                                    name="id"
                                    value={model.id}
                                />
                                <button
                                    type="submit"
                                    className="rounded-lg bg-red-600 px-5 py-2 font-semibold hover:bg-red-700"
                                >
                                    Delete Model
                                </button>
                            </form>
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
}
