function Spinner() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[#decea0] border-t-[#8d9d4f] rounded-full animate-spin"></div>
      <p className="text-[#8d9d4f] font-medium">Loading...</p>
    </div>
  );
}

export default Spinner;
