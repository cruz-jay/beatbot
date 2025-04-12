"use server";

import { auth, signIn, signOut } from "./auth";

export async function signInWithGoogleAction() {
  await signIn("google", { redirectTo: "/studio" });
}

export async function signInWithSpotifyAction() {
  await signIn("spotify", { redirectTo: "/studio" });
}

export async function signInWithGithubAction() {
  await signIn("github", { redirectTo: "/studio" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
