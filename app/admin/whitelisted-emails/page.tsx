
import Link from "next/link";
import { getAdminDatabase } from "@/lib/admin";
import {
    createEmail,
    updateEmail,
    deleteEmail,
} from "./actions";

export const instant = false;

const inputStyle =
    "w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white";

export default async function WhitelistedEmailsPage() {
    const supabase = await getAdminDatabase();

    const { data: emails, error } = await supabase
        .from("whitelisted_emails")
        .select("id, email, description")
        .order("email");

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
                    Whitelisted Emails
                </h1>

                <p className="mt-2 text-gray-400">
                    Manage individual email addresses allowed to register.
                </p>

                <section className="mt-8 rounded-xl border border-gray-700 p-6">
                    <h2 className="mb-5 text-xl font-semibold">
                        Add Whitelisted Email
                    </h2>

                    <form action={createEmail} className="space-y-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="e.g. personal@gmail.com"
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
                            Add Email
                        </button>
                    </form>
                </section>

                <section className="mt-10">
                    <h2 className="mb-5 text-xl font-semibold">
                        Existing Whitelisted Emails
                    </h2>

                    {!emails?.length && (
                        <p className="text-gray-400">
                            No whitelisted emails yet.
                        </p>
                    )}

                    <div className="space-y-5">
                        {emails?.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-xl border border-gray-700 p-6"
                            >
                                <form
                                    action={updateEmail}
                                    className="space-y-4"
                                >
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={item.id}
                                    />

                                    <div>
                                        <label className="mb-2 block text-sm text-gray-400">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            defaultValue={item.email}
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
                                            defaultValue={item.description ?? ""}
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

                                <form action={deleteEmail} className="mt-4">
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={item.id}
                                    />

                                    <button
                                        type="submit"
                                        className="rounded-lg border border-red-700 px-5 py-2 text-red-400 hover:bg-red-950"
                                    >
                                        Delete Email
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
