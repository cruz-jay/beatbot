import Link from "next/link";

function StudioTitle() {
  return (
    <div className="mb-2 ">
      <Link href="/">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#8d9d4f] via-[#9db18c] to-[#71856a] bg-clip-text text-transparent">
          BeatBot Studio
        </h1>
      </Link>
      <div className=" border-b-4 border-[#b19681] p-2"></div>
    </div>
  );
}

export default StudioTitle;
