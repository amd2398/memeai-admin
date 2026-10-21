
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveGeneratedMeme } from "./actions";

export default function CreateMemeForm() {
    const router = useRouter();

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [prompt, setPrompt] = useState("");
    const [caption, setCaption] = useState("");

    const [generating, setGenerating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!image) {
            setPreview("");
            return;
        }

        const url = URL.createObjectURL(image);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [image]);

    async function generateCaption() {
        if (!image || !prompt.trim()) {
            setError("Please upload an image and enter a prompt.");
            return;
        }

        setGenerating(true);
        setError("");
        setSuccess("");

        try {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("prompt", prompt.trim());

            const response = await fetch("/api/generate-caption", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to generate caption"
                );
            }

            if (typeof data.caption !== "string") {
                throw new Error("Gemini did not return a caption");
            }

            setCaption(data.caption);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong"
            );
        } finally {
            setGenerating(false);
        }
    }

    async function handleSave() {
        if (!image || !prompt.trim() || !caption.trim()) {
            setError(
                "Please upload an image, enter a prompt, and generate a caption."
            );
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("prompt", prompt.trim());
            formData.append("caption", caption.trim());

            await saveGeneratedMeme(formData);

            setSuccess("Meme saved successfully!");

            setImage(null);
            setPrompt("");
            setCaption("");

            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to save meme"
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="max-w-3xl rounded-2xl border border-slate-800 bg-zinc-950 p-8">
            <h2 className="mb-8 text-3xl font-bold text-white">
                Create New Meme
            </h2>

            <div className="space-y-6">
                <div>
                    <label className="mb-3 block text-lg text-gray-300">
                        Upload Image
                    </label>

                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;

                            setImage(file);
                            setCaption("");
                            setError("");
                            setSuccess("");
                        }}
                        className="w-full rounded-xl border border-slate-700 bg-zinc-900 p-4 text-white"
                    />
                </div>

                {preview && (
                    <div className="flex justify-center overflow-hidden rounded-xl border border-slate-800 bg-zinc-900">
                        <img
                            src={preview}
                            alt="Selected meme preview"
                            className="max-h-96 w-full object-contain"
                        />
                    </div>
                )}

                <div>
                    <label className="mb-3 block text-lg text-gray-300">
                        Prompt
                    </label>

                    <textarea
                        value={prompt}
                        onChange={(e) => {
                            setPrompt(e.target.value);
                            setCaption("");
                        }}
                        placeholder="Enter a topic, like midterm season..."
                        rows={3}
                        className="w-full rounded-xl border border-slate-700 bg-zinc-900 p-4 text-lg text-white"
                    />
                </div>

                <button
                    type="button"
                    onClick={generateCaption}
                    disabled={generating || saving || !image || !prompt.trim()}
                    className="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {generating
                        ? "Generating caption..."
                        : "Generate Caption with AI"}
                </button>

                <div>
                    <label className="mb-3 block text-lg text-gray-300">
                        AI-Generated Caption
                    </label>

                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Gemini will generate a caption here..."
                        rows={3}
                        className="w-full rounded-xl border border-slate-700 bg-zinc-900 p-4 text-lg text-white"
                    />
                </div>

                {error && (
                    <p className="rounded-xl border border-red-800 bg-red-950/30 p-4 text-red-400">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="rounded-xl border border-green-800 bg-green-950/30 p-4 text-green-400">
                        {success}
                    </p>
                )}

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={
                        saving ||
                        generating ||
                        !image ||
                        !prompt.trim() ||
                        !caption.trim()
                    }
                    className="w-full rounded-xl bg-white px-6 py-4 text-lg font-bold text-black hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {saving ? "Saving Meme..." : "Save Meme"}
                </button>
            </div>
        </div>
    );
}
