"use server";

import { signIn, signOut } from "@/auth";

export async function doSocialLogin(formData) {
  const action = formData.get("action");
  const response = await signIn(action, { redirectTo: "/submit-bot-2" });
}

export async function doSocialLoginBot(formData, id) {
  const action = formData.get("action");
  const response = await signIn(action, { redirectTo: `/bot/${id}` });
}

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}
