import { auth } from "@/app/_lib/auth";
import { getUser } from "@/app/_lib/data";

export async function page() {
  const session = await auth();
  const data = await getUser(session.user.email);

  return (
    <div className="min-h-screen bg-[#e4d7b0] text-[#5c4b3e] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#e7dbbf] rounded-[0.425rem] p-8 border border-[#b19681] shadow-xl mb-8">
          <h2 className="text-2xl font-bold mb-6 text-[#8d9d4f]">
            About BeatBot
          </h2>

          <p className="text-[#5c4b3e] mb-6 leading-relaxed">
            BeatBot is a demonstration project showcasing the integration of
            Next.js with TanStack Query and authentication systems. The
            application leverages Hugging Face's public API models to generate
            music, providing a cost-effective alternative to commercial AI
            services.
          </p>

          <p className="text-[#5c4b3e] mb-6 leading-relaxed">
            This is a non-commercial project. Your account information is used
            solely for authentication purposes, and you will never receive
            marketing emails or be charged for any services.
          </p>

          <div className="mt-8 p-4 bg-[#decea0] rounded-[0.425rem] border border-[#b19681]">
            <h3 className="text-lg font-medium mb-3 text-[#d98b7e]">
              Account Deletion Request
            </h3>
            <p className="text-sm text-[#85766a] mb-4">
              If you would like to delete your account and all associated data,
              please check the box below and submit the form.
            </p>

            <form action="" className="flex items-center space-x-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="delete-account"
                  id="delete-account"
                  className="h-5 w-5 rounded text-[#8d9d4f] focus:ring-[#9db18c] border-[#b19681] bg-[#dbc894]"
                />
                <label
                  htmlFor="delete-account"
                  className="ml-2 text-sm text-[#5c4b3e]">
                  Yes, I want to delete my account
                </label>
              </div>
              <button
                type="submit"
                disabled
                className="px-4 py-2 bg-[#d98b7e]/20 text-[#d98b7e] border border-[#d98b7e] rounded-[0.425rem] text-sm font-medium opacity-50 cursor-not-allowed">
                Submit Request
              </button>
            </form>
          </div>
        </div>

        <div className="bg-[#e7dbbf] rounded-[0.425rem] p-8 border border-[#b19681] shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-[#8d9d4f]">
            Account Information
          </h2>

          <div className="space-y-4">
            <div className="border-b border-[#b19681] pb-4">
              <h3 className="text-sm text-[#85766a] uppercase tracking-wider mb-1">
                Name
              </h3>
              <p className="text-lg font-medium">{data.fullName}</p>
            </div>

            <div className="border-b border-[#b19681] pb-4">
              <h3 className="text-sm text-[#85766a] uppercase tracking-wider mb-1">
                Email
              </h3>
              <p className="text-lg font-medium">{data.email}</p>
            </div>

            <div>
              <h3 className="text-sm text-[#85766a] uppercase tracking-wider mb-1">
                Login Provider
              </h3>
              <div className="flex items-center">
                <p className="text-lg font-medium">{data.provider}</p>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#8d9d4f] text-[#fdfbf6]">
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
