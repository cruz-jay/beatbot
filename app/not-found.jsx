import Link from "next/link";

function NotFound() {
  return (
    <main className="text-center space-y-6 mt-4">
      <h1 className="text-3xl font-semibold text-[#5c4b3e]">
        This page could not be found
      </h1>
      <Link
        href="/"
        className="inline-block bg-[#dbc894] text-[#5c4b3e] px-6 py-3 text-lg rounded-[0.425rem] hover:bg-[#8d9d4f] hover:text-[#fdfbf6] transition-colors">
        Go back home
      </Link>
    </main>
  );
}

export default NotFound;
