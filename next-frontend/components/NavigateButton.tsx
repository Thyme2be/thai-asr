"use client";
import { usePathname, useRouter } from "next/navigation";

const NavigateButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isLongForm = pathname === "/"
  const nextPath = isLongForm ? '/streaming' : '/'
  const nextLabel = isLongForm ? "Streaming" : "Long Form"
  
  return (
    <div className="flex justify-center">
      <button
        onClick={() => router.push(nextPath)}
        className="bg-green-500 hover:bg-green-600 w-fit p-3 rounded-b-2xl text-3xl cursor-pointer"
      >
        Switch to <span className="font-bold underline">{nextLabel}</span>
      </button>
    </div>
  );
};

export default NavigateButton;
