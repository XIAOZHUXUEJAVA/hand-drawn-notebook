import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export async function signUp({ email, password, displayName }: SignUpData) {
  // 1. 注册用户
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Registration failed" };
  }

  // 2. 创建 profile
  const { error: profileError } = await supabase.from("profiles").insert({
    user_id: authData.user.id,
    display_name: displayName,
  });

  if (profileError) {
    console.error("Failed to create profile:", profileError);
    // 不阻止注册流程，profile 可以后续补充
  }

  return { data: authData, error: null };
}

export async function signIn({ email, password }: SignInData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { data, error: null };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error: error?.message || null };
}

export async function getUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error: error?.message || null };
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  return { profile: data, error: error?.message || null };
}
