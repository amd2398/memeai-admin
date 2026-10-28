
"use server";

import { getAdminDatabase } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function createProvider(formData: FormData) {
    const supabase = await getAdminDatabase();

    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const website_url = String(formData.get("website_url") ?? "").trim();

    if (!name) {
        throw new Error("Provider name is required");
    }

    const { error } = await supabase.from("llm_providers").insert({
        name,
        description: description || null,
        website_url: website_url || null,
    });

    if (error) throw new Error(error.message);

    revalidatePath("/admin/providers");
}

export async function updateProvider(formData: FormData) {
    const supabase = await getAdminDatabase();

    const id = String(formData.get("id") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const website_url = String(formData.get("website_url") ?? "").trim();

    if (!id || !name) {
        throw new Error("Provider ID and name are required");
    }

    const { error } = await supabase
        .from("llm_providers")
        .update({
            name,
            description: description || null,
            website_url: website_url || null,
        })
        .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/providers");
}

export async function deleteProvider(formData: FormData) {
    const supabase = await getAdminDatabase();

    const id = String(formData.get("id") ?? "");

    if (!id) {
        throw new Error("Provider ID is required");
    }

    const { error } = await supabase
        .from("llm_providers")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/providers");
}
