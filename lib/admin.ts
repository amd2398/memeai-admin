import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
    const supabase = await createClient();

    // Verify the signed-in user with Supabase Auth
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // Check admin privileges using the authenticated user's ID
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_superadmin")
        .eq("id", user.id)
        .single();

    if (profileError || profile?.is_superadmin !== true) {
        redirect("/unauthorized");
    }

    return user;
}

export async function getAdminDatabase() {
    // Authorization MUST happen before privileged access
    await requireAdmin();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!url || !secretKey) {
        throw new Error("Missing Supabase admin configuration");
    }

    // This client is only created on the server
    return createSupabaseClient(url, secretKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}