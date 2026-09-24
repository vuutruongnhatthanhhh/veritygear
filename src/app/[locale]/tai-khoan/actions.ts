"use server";

import { createClient } from "@/lib/supabase/server";

export type ActionState = { error?: string; success?: string } | null;

export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn cần đăng nhập" };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: (formData.get("fullName") as string).trim(),
      phone: (formData.get("phone") as string).trim(),
      address: (formData.get("address") as string).trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };
  return { success: "Đã lưu thông tin" };
}
