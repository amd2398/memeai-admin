
"use server";

import { getAdminDatabase } from "@/lib/admin";
import { revalidatePath } from "next/cache";

function getEmailData(formData: FormData) {
    const email = String(formData.get("email") ?? "")
        .trim()
        .toLowerCase();

    const description = String(
        formData.get("description") ?? ""
    ).trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Enter a valid email address.");
    }

    return { email, description };
}

export async function createEmail(formData: FormData) {
    const supabase = await getAdminDatabase();

    const { error } = await supabase
        .from("whitelisted_emails")
        .insert(getEmailData(formData));

    if (error) throw new Error(error.message);

    revalidatePath("/admin/whitelisted-emails");
}

export async function updateEmail(formData: FormData) {
    const supabase = await getAdminDatabase();
    const id = String(formData.get("id") ?? "");

    if (!id) throw new Error("Email ID is required.");

    const { error } = await supabase
        .from("whitelisted_emails")
        .update(getEmailData(formData))
        .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/whitelisted-emails");
}

export async function deleteEmail(formData: FormData) {
    const supabase = await getAdminDatabase();
    const id = String(formData.get("id") ?? "");

    if (!id) throw new Error("Email ID is required.");

    const { error } = await supabase
        .from("whitelisted_emails")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/whitelisted-emails");
}
