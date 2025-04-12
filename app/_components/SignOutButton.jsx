import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { signOutAction } from "../_lib/action.js";

function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button className="py-8 px-4 hover:bg-[#dbc894] hover:text-[#5c4b3e] transition-colors flex items-center gap-3 font-semibold text-[#5c4b3e] w-full">
        <ArrowRightOnRectangleIcon className="h-5 w-5 text-[#8d9d4f]" />
        <span>Sign out</span>
      </button>
    </form>
  );
}

export default SignOutButton;
