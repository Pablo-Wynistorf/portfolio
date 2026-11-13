import { Link } from "react-router";
import { AuroraText } from "@/components/ui/aurora-text";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-[10rem] font-bold leading-none tracking-tighter md:text-[14rem]">
        <AuroraText colors={["#2dd4bf", "#38bdf8", "#a78bfa", "#f472b6"]}>404</AuroraText>
      </h1>
      <p className="mt-4 text-neutral-400">This page took a wrong turn somewhere on the network.</p>
      <Link to="/" className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-teal-200">
        Back home
      </Link>
    </section>
  );
}
