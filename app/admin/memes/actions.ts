
"use server";

import { getAdminDatabase } from "@/lib/admin";
import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// DELETE MEME
export async function deleteMeme(formData: FormData) {
    const id = Number(formData.get("id"));

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new Error("Invalid meme ID");
    }

    const supabase = await getAdminDatabase();

    const { error } = await supabase
        .from("memes")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error("Failed to delete meme: " + error.message);
    }

    revalidatePath("/admin/memes");
    revalidatePath("/admin");
}

// UPDATE MEME
export async function updateMeme(formData: FormData) {
    const id = Number(formData.get("id"));
    const caption = formData.get("caption");
    const prompt = formData.get("prompt");

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new Error("Invalid meme ID");
    }

    if (
        typeof caption !== "string" ||
        typeof prompt !== "string"
    ) {
        throw new Error("Invalid meme data");
    }

    const supabase = await getAdminDatabase();

    const { error } = await supabase
        .from("memes")
        .update({
            caption: caption.trim(),
            prompt: prompt.trim(),
        })
        .eq("id", id);

    if (error) {
        throw new Error("Failed to update meme: " + error.message);
    }

    revalidatePath("/admin/memes");
    revalidatePath("/admin");
}

// CREATE MEME USING AN EXISTING IMAGE URL
export async function createMeme(formData: FormData) {
    const prompt = formData.get("prompt");
    const caption = formData.get("caption");
    const imageUrl = formData.get("image_url");

    if (
        typeof prompt !== "string" ||
        typeof caption !== "string" ||
        typeof imageUrl !== "string"
    ) {
        throw new Error("Invalid meme data");
    }

    if (
        !prompt.trim() ||
        !caption.trim() ||
        !imageUrl.trim()
    ) {
        throw new Error("All fields are required");
    }

    // Verify admin permissions
    const supabase = await getAdminDatabase();

    // Get the currently signed-in user
    const authClient = await createClient();

    const {
        data: { user },
        error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
        throw new Error("You must be signed in");
    }

    // Validate the image URL
    let validatedImageUrl: string;

    try {
        const url = new URL(imageUrl.trim());

        if (url.protocol !== "https:") {
            throw new Error("Invalid protocol");
        }

        validatedImageUrl = url.toString();
    } catch {
        throw new Error("Enter a valid HTTPS image URL");
    }

    // Insert meme into Supabase
    const { error } = await supabase
        .from("memes")
        .insert({
            user_id: user.id,
            prompt: prompt.trim(),
            caption: caption.trim(),
            image_url: validatedImageUrl,
        });

    if (error) {
        throw new Error("Failed to create meme: " + error.message);
    }

    revalidatePath("/admin/memes");
    revalidatePath("/admin");
}

// SAVE AI-GENERATED MEME WITH AN UPLOADED IMAGE
export async function saveGeneratedMeme(formData: FormData) {
    // Verify superadmin permissions first
    const supabase = await getAdminDatabase();

    const image = formData.get("image");
    const prompt = formData.get("prompt");
    const caption = formData.get("caption");

    // Validate image
    if (!(image instanceof File)) {
        throw new Error("Please select an image");
    }

    if (image.size === 0 || image.size > 5 * 1024 * 1024) {
        throw new Error("Image must be smaller than 5 MB");
    }

    const allowedTypes: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
    };

    const extension = allowedTypes[image.type];

    if (!extension) {
        throw new Error("Use a JPG, PNG, WebP, or GIF image");
    }

    // Validate prompt and caption
    if (
        typeof prompt !== "string" ||
        !prompt.trim() ||
        typeof caption !== "string" ||
        !caption.trim()
    ) {
        throw new Error("Prompt and caption are required");
    }

    // Get the signed-in admin user
    const authClient = await createClient();

    const {
        data: { user },
        error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
        throw new Error("You must be signed in");
    }

    // Generate a unique filename
    const filePath = `admin/${crypto.randomUUID()}.${extension}`;

    // Upload image to Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from("meme-images")
        .upload(filePath, image, {
            contentType: image.type,
            upsert: false,
        });

    if (uploadError) {
        throw new Error(
            "Image upload failed: " + uploadError.message
        );
    }

    // Get the uploaded image's public URL
    const { data: urlData } = supabase.storage
        .from("meme-images")
        .getPublicUrl(filePath);

    // Save meme in the existing memes table
    const { error: insertError } = await supabase
        .from("memes")
        .insert({
            user_id: user.id,
            image_url: urlData.publicUrl,
            prompt: prompt.trim(),
            caption: caption.trim(),
        });

    if (insertError) {
        // Remove uploaded image if database insert fails
        await supabase.storage
            .from("meme-images")
            .remove([filePath]);

        throw new Error(
            "Failed to save meme: " + insertError.message
        );
    }

    // Refresh dashboard and media page
    revalidatePath("/admin/memes");
    revalidatePath("/admin");
}
