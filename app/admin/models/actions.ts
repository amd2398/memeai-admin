
"use server";

import { getAdminDatabase } from "@/lib/admin";
import { revalidatePath } from "next/cache";

function getModelData(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    const model_identifier = String(
        formData.get("model_identifier") ?? ""
    ).trim();
    const provider_id = String(formData.get("provider_id") ?? "");
    const description = String(formData.get("description") ?? "").trim();
    const supports_temperature =
        formData.get("supports_temperature") === "on";

    if (!name || !model_identifier) {
        throw new Error("Model name and identifier are required");
    }

    return {
        name,
        model_identifier,
        provider_id: provider_id || null,
        description: description || null,
        supports_temperature,
    };
}

export async function createModel(formData: FormData) {
    const supabase = await getAdminDatabase();
    const values = getModelData(formData);

    const { error } = await supabase
        .from("llm_models")
        .insert(values);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/models");
}

export async function updateModel(formData: FormData) {
    const supabase = await getAdminDatabase();
    const id = String(formData.get("id") ?? "");

    if (!id) throw new Error("Model ID is required");

    const values = getModelData(formData);

    const { error } = await supabase
        .from("llm_models")
        .update(values)
        .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/models");
}

export async function deleteModel(formData: FormData) {
    const supabase = await getAdminDatabase();
    const id = String(formData.get("id") ?? "");

    if (!id) throw new Error("Model ID is required");

    const { error } = await supabase
        .from("llm_models")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/models");
}
