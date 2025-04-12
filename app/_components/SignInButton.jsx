import Image from "next/image";
import {
  signInWithGoogleAction,
  signInWithSpotifyAction,
  signInWithGithubAction,
} from "../_lib/action.js";

function SignInButton() {
  return (
    <div className="flex flex-col gap-4">
      <form action={signInWithGoogleAction}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 bg-zinc-850 hover:bg-zinc-700 text-white py-3 px-4 rounded-lg transition-all duration-200 border border-zinc-700 hover:border-zinc-600">
          <Image
            src="https://authjs.dev/img/providers/google.svg"
            alt="Google logo"
            height="20"
            width="20"
          />
          <span>Continue with Google</span>
        </button>
      </form>

      <form action={signInWithSpotifyAction}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-lg transition-all duration-200 border border-zinc-700 hover:border-zinc-600">
          <Image
            src="https://authjs.dev/img/providers/spotify.svg"
            alt="Spotify"
            height="20"
            width="20"
          />
          <span>Continue with Spotify</span>
        </button>
      </form>

      <form action={signInWithGithubAction}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-lg transition-all duration-200 border border-zinc-700 hover:border-zinc-600">
          <Image
            src="https://authjs.dev/img/providers/github.svg"
            alt="GitHub"
            height="20"
            width="20"
          />
          <span>Continue with GitHub</span>
        </button>
      </form>
    </div>
  );
}

export default SignInButton;
