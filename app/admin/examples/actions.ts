
"use server";

import { getAdminDatabase } from "@/lib/admin";
import { revalidatePath } from "next/cache";

function getExampleData(formData: FormData) {
    const title = String(formData.get("title") ?? "").trim();
    const input_text = String(formData.get("input_text") ?? "").trim();
    const output_text = String(formData.get("output_text") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!title || !output_text) {
        throw new Error("Title and output text are required.");
    }

    return {
        title,
        input_text: input_text || null,
        output_text,
        description: description || null,
    };
}

export async function createExample(formData: FormData) {
    const supabase = await getAdminDatabase();
    const { error } = await supabase
        .from("ai_generation_examples")
        .insert(getExampleData(formData));

    if (error) throw new Error(error.message);
    revalidatePath("/admin/examples");
}

export async function updateExample(formData: FormData) {
    const supabase = await getAdminDatabase();
    const id = String(formData.get("id") ?? "");

    if (!id) throw new Error("Example ID is required.");

    const { error } = await supabase
        .from("ai_generation_examples")
        .update(getExampleData(formData))
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/examples");
}

export async function deleteExample(formData: FormData) {
    const supabase = await getAdminDatabase();
    const id = String(formData.get("id") ?? "");

    if (!id) throw new Error("Example ID is required.");

    const { error } = await supabase
        .from("ai_generation_examples")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/examples");
}
