
"use server";

import { getAdminDatabase } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

const BUCKET = "meme-images";

export async function uploadImage(formData: FormData) {
    const supabase = await getAdminDatabase();

    const file = formData.get("image");

    if (!(file instanceof File) || file.size === 0) {
        throw new Error("Please select an image.");
    }

    if (
        !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
            file.type
        )
    ) {
        throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed.");
    }

    if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image must be smaller than 5 MB.");
    }

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "png";
    const storagePath = `admin/${randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, file, {
            contentType: file.type,
            upsert: false,
        });

    if (uploadError) throw new Error(uploadError.message);

    const { error: dbError } = await supabase.from("images").insert({
        storage_path: storagePath,
        file_name: file.name,
        description: String(formData.get("description") ?? "").trim(),
        content_type: file.type,
    });

    if (dbError) {
        await supabase.storage.from(BUCKET).remove([storagePath]);
        throw new Error(dbError.message);
    }

    revalidatePath("/admin/images");
}

export async function updateImage(formData: FormData) {
    const supabase = await getAdminDatabase();

    const id = String(formData.get("id") ?? "");
    const description = String(
        formData.get("description") ?? ""
    ).trim();

    if (!id) throw new Error("Image ID is required.");

    const { error } = await supabase
        .from("images")
        .update({ description })
        .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/images");
}

export async function deleteImage(formData: FormData) {
    const supabase = await getAdminDatabase();

    const id = String(formData.get("id") ?? "");
    if (!id) throw new Error("Image ID is required.");

    const { data: image, error: lookupError } = await supabase
        .from("images")
        .select("storage_path")
        .eq("id", id)
        .single();

    if (lookupError) throw new Error(lookupError.message);

    const { error: storageError } = await supabase.storage
        .from(BUCKET)
        .remove([image.storage_path]);

    if (storageError) throw new Error(storageError.message);

    const { error: dbError } = await supabase
        .from("images")
        .delete()
        .eq("id", id);

    if (dbError) throw new Error(dbError.message);

    revalidatePath("/admin/images");
}
