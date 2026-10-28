
"use server";

import { getAdminDatabase } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function createTerm(formData: FormData) {
    const supabase = await getAdminDatabase();

    const term = String(formData.get("term") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!term) {
        throw new Error("Term is required.");
    }

    const { error } = await supabase.from("terms").insert({
        term,
        category,
        description,
    });

    if (error) throw new Error(error.message);

    revalidatePath("/admin/terms");
}

export async function updateTerm(formData: FormData) {
    const supabase = await getAdminDatabase();

    const id = String(formData.get("id") ?? "");
    const term = String(formData.get("term") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!id || !term) {
        throw new Error("Term ID and name are required.");
    }

    const { error } = await supabase
        .from("terms")
        .update({ term, category, description })
        .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/terms");
}

export async function deleteTerm(formData: FormData) {
    const supabase = await getAdminDatabase();

    const id = String(formData.get("id") ?? "");

    if (!id) {
        throw new Error("Term ID is required.");
    }

    const { error } = await supabase
        .from("terms")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/terms");
}
