"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
const DEFAULT_AUTH_CALLBACK = "/";
const SIGN_IN_PATH = "/sign-in";

function getSafeCallbackPath(callback: string | null): string {
  if (!callback) return DEFAULT_AUTH_CALLBACK;
  if (callback.startsWith("/") && !callback.startsWith("//")) return callback;
  return DEFAULT_AUTH_CALLBACK;
}

export async function signInWithGithub(formData: FormData) {
  const callback = formData.get("callbackUrl");


  const redirectTo = getSafeCallbackPath(
    typeof callback === "string" ? callback : null
  );
  const result = await auth.api.signInSocial({
    body: {
      provider: "github",
      callbackURL: redirectTo
    },
    headers: await headers(),
  });

  if (result.url) {
    redirect(result.url);
  }
}

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireAuth(redirectTo = SIGN_IN_PATH) {
  const session = await getServerSession();

  if (!session) {
    redirect(redirectTo);
  }

  return session;
}

export async function requireUnauth(redirectTo = DEFAULT_AUTH_CALLBACK) {
  const session = await getServerSession();

  if (session) {
    redirect(redirectTo);
  }
}
