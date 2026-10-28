
import Link from "next/link";
import { getAdminDatabase } from "@/lib/admin";
import {
    createDomain,
    updateDomain,
    deleteDomain,
} from "./actions";

export const instant = false;

const inputStyle =
    "w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white";

export default async function AllowedDomainsPage() {
    const supabase = await getAdminDatabase();

    const { data: domains, error } = await supabase
        .from("allowed_signup_domains")
        .select("id, domain, description")
        .order("domain");

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
                    Allowed Signup Domains
                </h1>

                <p className="mt-2 text-gray-400">
                    Manage which email domains are allowed to register.
                </p>

                <section className="mt-8 rounded-xl border border-gray-700 p-6">
                    <h2 className="mb-5 text-xl font-semibold">
                        Add Allowed Domain
                    </h2>

                    <form action={createDomain} className="space-y-4">
                        <input
                            name="domain"
                            placeholder="e.g. columbia.edu"
                            required
                            className={inputStyle}
                        />

                        <input
                            name="description"
                            placeholder="Description (optional)"
                            className={inputStyle}
                        />

                        <button
                            type="submit"
                            className="rounded-lg bg-white px-5 py-3 font-semibold text-black"
                        >
                            Add Domain
                        </button>
                    </form>
                </section>

                <section className="mt-10">
                    <h2 className="mb-5 text-xl font-semibold">
                        Existing Domains
                    </h2>

                    {!domains?.length && (
                        <p className="text-gray-400">
                            No allowed domains yet.
                        </p>
                    )}

                    <div className="space-y-5">
                        {domains?.map((domain) => (
                            <div
                                key={domain.id}
                                className="rounded-xl border border-gray-700 p-6"
                            >
                                <form
                                    action={updateDomain}
                                    className="space-y-4"
                                >
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={domain.id}
                                    />

                                    <div>
                                        <label className="mb-2 block text-sm text-gray-400">
                                            Domain
                                        </label>
                                        <input
                                            name="domain"
                                            defaultValue={domain.domain}
                                            required
                                            className={inputStyle}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm text-gray-400">
                                            Description
                                        </label>
                                        <input
                                            name="description"
                                            defaultValue={domain.description ?? ""}
                                            className={inputStyle}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="rounded-lg bg-white px-5 py-2 font-semibold text-black"
                                    >
                                        Save Changes
                                    </button>
                                </form>

                                <form action={deleteDomain} className="mt-4">
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={domain.id}
                                    />

                                    <button
                                        type="submit"
                                        className="rounded-lg border border-red-700 px-5 py-2 text-red-400 hover:bg-red-950"
                                    >
                                        Delete Domain
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
