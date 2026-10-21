
"use client";

import { useState } from "react";
import { deleteMeme, updateMeme } from "./actions";

type MemeActionsProps = {
    id: number;
    caption: string | null;
    prompt: string | null;
};

export default function MemeActions({
                                        id,
                                        caption,
                                        prompt,
                                    }: MemeActionsProps) {
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function handleUpdate(formData: FormData) {
        setBusy(true);
        setError("");

        try {
            await updateMeme(formData);
            setEditing(false);
        } catch {
            setError("Could not update this meme. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    async function handleDelete() {
        const confirmed = window.confirm(
            `Are you sure you want to delete Meme #${id}? This cannot be undone.`
        );

        if (!confirmed) return;

        setBusy(true);
        setDeleting(true);
        setError("");

        try {
            const formData = new FormData();
            formData.set("id", String(id));

            await deleteMeme(formData);
        } catch {
            setError("Could not delete this meme. Please try again.");
        } finally {
            setBusy(false);
            setDeleting(false);
        }
    }

    return (
        <div className="mt-5 border-t border-gray-800 pt-5">
            {editing ? (
                <form action={handleUpdate} className="space-y-4">
                    <input type="hidden" name="id" value={id} />

                    <div>
                        <label className="mb-2 block text-sm text-gray-400">
                            Caption
                        </label>
                        <textarea
                            name="caption"
                            defaultValue={caption ?? ""}
                            rows={3}
                            required
                            className="w-full rounded-lg border border-gray-700 bg-zinc-900 p-3 text-base text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-gray-400">
                            Prompt
                        </label>
                        <textarea
                            name="prompt"
                            defaultValue={prompt ?? ""}
                            rows={2}
                            required
                            className="w-full rounded-lg border border-gray-700 bg-zinc-900 p-3 text-base text-white"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={busy}
                            className="flex-1 cursor-pointer rounded-lg bg-white px-4 py-2 font-semibold text-black disabled:opacity-50"
                        >
                            {busy ? "Saving..." : "Save"}
                        </button>

                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => setEditing(false)}
                            className="flex-1 cursor-pointer rounded-lg border border-gray-700 px-4 py-2 text-white disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="flex gap-3">
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => setEditing(true)}
                        className="flex-1 cursor-pointer rounded-lg border border-gray-700 px-4 py-2 font-semibold hover:bg-zinc-800 disabled:opacity-50"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        disabled={busy}
                        onClick={handleDelete}
                        className="flex-1 cursor-pointer rounded-lg border border-red-900 px-4 py-2 font-semibold text-red-400 hover:bg-red-950 disabled:opacity-50"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            )}

            {error && (
                <p className="mt-3 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
}
