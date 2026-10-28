
import Link from "next/link";
import { getAdminDatabase } from "@/lib/admin";
import {
    uploadImage,
    updateImage,
    deleteImage,
} from "./actions";

export const instant = false;

const BUCKET = "meme-images";

export default async function ImagesPage() {
    const supabase = await getAdminDatabase();

    const { data: images, error } = await supabase
        .from("images")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const inputStyle =
        "w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white";

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
                    Image Management
                </h1>

                <p className="mt-2 text-gray-400">
                    Upload and manage images stored in Supabase.
                </p>

                <section className="mt-8 rounded-xl border border-gray-700 p-6">
                    <h2 className="mb-5 text-xl font-semibold">
                        Upload New Image
                    </h2>

                    <form action={uploadImage} className="space-y-4">
                        <input
                            type="file"
                            name="image"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            required
                            className="block w-full text-gray-300"
                        />

                        <input
                            name="description"
                            placeholder="Image description (optional)"
                            className={inputStyle}
                        />

                        <button
                            type="submit"
                            className="rounded-lg bg-white px-5 py-3 font-semibold text-black"
                        >
                            Upload Image
                        </button>
                    </form>
                </section>

                <section className="mt-10">
                    <h2 className="mb-5 text-xl font-semibold">
                        Uploaded Images
                    </h2>

                    {!images?.length && (
                        <p className="text-gray-400">
                            No images found in the images table.
                        </p>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">
                        {images?.map((image) => {
                            const { data } = supabase.storage
                                .from(BUCKET)
                                .getPublicUrl(image.storage_path);

                            return (
                                <div
                                    key={image.id}
                                    className="rounded-xl border border-gray-700 p-5"
                                >
                                    <img
                                        src={data.publicUrl}
                                        alt={image.description || image.file_name}
                                        className="mb-4 h-64 w-full rounded-lg object-contain bg-gray-900"
                                    />

                                    <p className="mb-4 break-all text-sm text-gray-400">
                                        {image.file_name}
                                    </p>

                                    <form
                                        action={updateImage}
                                        className="space-y-3"
                                    >
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={image.id}
                                        />

                                        <textarea
                                            name="description"
                                            defaultValue={image.description ?? ""}
                                            placeholder="Description"
                                            rows={3}
                                            className={inputStyle}
                                        />

                                        <button
                                            type="submit"
                                            className="rounded-lg bg-white px-5 py-2 font-semibold text-black"
                                        >
                                            Save Changes
                                        </button>
                                    </form>

                                    <form action={deleteImage} className="mt-4">
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={image.id}
                                        />

                                        <button
                                            type="submit"
                                            className="rounded-lg border border-red-700 px-5 py-2 text-red-400 hover:bg-red-950"
                                        >
                                            Delete Image
                                        </button>
                                    </form>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    );
}
