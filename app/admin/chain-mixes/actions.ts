
"use server";

import { getAdminDatabase } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function updateMix(formData: FormData) {
    const supabase = await getAdminDatabase();

    const id = String(formData.get("id") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const description = String(
        formData.get("description") ?? ""
    ).trim();
    const is_active = formData.get("is_active") === "on";

    if (!id || !name) {
        throw new Error("Mix ID and name are required.");
    }

    const { error } = await supabase
        .from("prompt_chain_mixes")
        .update({ name, description, is_active })
        .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/chain-mixes");
}

export async function updateMixMembers(formData: FormData) {
    const supabase = await getAdminDatabase();

    const mixId = String(formData.get("mix_id") ?? "");
    if (!mixId) throw new Error("Mix ID is required.");

    const { data: chains, error: chainsError } = await supabase
        .from("prompt_chains")
        .select("id");

    if (chainsError) throw new Error(chainsError.message);

    const members = (chains ?? [])
        .filter((chain) => formData.get(`chain_${chain.id}`) === "on")
        .map((chain) => {
            const weight = Number(
                formData.get(`weight_${chain.id}`) ?? 1
            );

            if (!Number.isFinite(weight) || weight < 0) {
                throw new Error("Weights must be nonnegative numbers.");
            }

            return {
                mix_id: mixId,
                prompt_chain_id: chain.id,
                weight,
            };
        });

    const { error: deleteError } = await supabase
        .from("prompt_chain_mix_members")
        .delete()
        .eq("mix_id", mixId);

    if (deleteError) throw new Error(deleteError.message);

    if (members.length > 0) {
        const { error: insertError } = await supabase
            .from("prompt_chain_mix_members")
            .insert(members);

        if (insertError) throw new Error(insertError.message);
    }

    revalidatePath("/admin/chain-mixes");
}
