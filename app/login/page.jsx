import SignInButton from "../_components/SignInButton";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#e4d7b0] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#e7dbbf] rounded-[0.425rem] p-8 shadow-lg border border-[#b19681]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#5c4b3e] mb-2">
            Welcome Back
          </h1>
          <p className="text-[#85766a]">
            Sign in to your creative workspace studio!
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#8d9d4f] to-[#9db18c] h-px w-full my-6"></div>

          <SignInButton />

          <div className="text-center text-[#85766a] text-sm mt-8">
            <p>
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
