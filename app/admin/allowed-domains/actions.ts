
"use server";

import { getAdminDatabase } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function createDomain(formData: FormData) {
    const supabase = await getAdminDatabase();

    const domain = String(formData.get("domain") ?? "")
        .trim()
        .toLowerCase()
        .replace(/^@/, "");

    const description = String(
        formData.get("description") ?? ""
    ).trim();

    if (!domain || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) {
        throw new Error("Enter a valid email domain.");
    }

    const { error } = await supabase
        .from("allowed_signup_domains")
        .insert({ domain, description });

    if (error) throw new Error(error.message);

    revalidatePath("/admin/allowed-domains");
}

export async function updateDomain(formData: FormData) {
    const supabase = await getAdminDatabase();

    const id = String(formData.get("id") ?? "");
    const domain = String(formData.get("domain") ?? "")
        .trim()
        .toLowerCase()
        .replace(/^@/, "");

    const description = String(
        formData.get("description") ?? ""
    ).trim();

    if (!id || !domain || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) {
        throw new Error("A valid domain is required.");
    }

    const { error } = await supabase
        .from("allowed_signup_domains")
        .update({ domain, description })
        .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/allowed-domains");
}

export async function deleteDomain(formData: FormData) {
    const supabase = await getAdminDatabase();

    const id = String(formData.get("id") ?? "");

    if (!id) throw new Error("Domain ID is required.");

    const { error } = await supabase
        .from("allowed_signup_domains")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/allowed-domains");
}
