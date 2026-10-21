
import Link from "next/link";
import { getAdminDatabase } from "@/lib/admin";

export const instant = false;

export default async function UsersPage() {
    const supabase = await getAdminDatabase();

    const { data: users, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, avatar_url, is_superadmin")
        .order("first_name", { ascending: true });

    if (error) {
        throw new Error("Failed to load user profiles");
    }

    return (
        <main className="min-h-screen bg-black px-6 py-16 text-white">
            <div className="mx-auto max-w-6xl">
                <Link
                    href="/admin"
                    className="text-base text-gray-400 hover:text-white"
                >
                    ← Back to Dashboard
                </Link>

                <h1 className="mt-8 text-4xl font-black">
                    Users
                </h1>

                <p className="mt-3 text-lg text-gray-400">
                    View all registered MemeAI users.
                </p>

                <div className="mt-10 overflow-x-auto rounded-2xl border border-gray-800">
                    <table className="w-full text-left text-lg">
                        <thead className="bg-zinc-900 text-base text-gray-400">
                        <tr>
                            <th className="p-5">Name</th>
                            <th className="p-5">User ID</th>
                            <th className="p-5">Role</th>
                        </tr>
                        </thead>

                        <tbody>
                        {users?.map((user) => (
                            <tr
                                key={user.id}
                                className="border-t border-gray-800"
                            >
                                <td className="p-5">
                                    {user.first_name || user.last_name
                                        ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
                                        : "No name provided"}
                                </td>

                                <td className="p-5 font-mono text-base text-gray-400">
                                    {user.id}
                                </td>

                                <td className="p-5">
                                    {user.is_superadmin ? (
                                        <span className="font-semibold text-green-400">
                        Superadmin
                      </span>
                                    ) : (
                                        <span className="text-gray-400">
                        User
                      </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <p className="mt-4 text-base text-gray-500">
                    Total profiles: {users?.length ?? 0}
                </p>
            </div>
        </main>
    );
}