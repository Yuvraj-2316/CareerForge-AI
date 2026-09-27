
import { ArrowUpRight, Sparkles } from "lucide-react";

function CareerCoachCard() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-6 text-white shadow-sm">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-xl" />

      <div className="relative">
        <span className="inline-flex rounded-xl bg-white/15 p-3">
          <Sparkles size={24} />
        </span>

        <h2 className="mt-5 text-xl font-bold">
          Unlock Your Potential
        </h2>

        <p className="mt-3 text-sm leading-6 text-indigo-100">
          Get personalized guidance for your DSA,
          projects, resume and placement preparation.
        </p>

        <div className="mt-6 flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
          <span className="text-sm font-semibold">
            AI Career Coach
          </span>

          <ArrowUpRight size={19} />
        </div>

        <p className="mt-3 text-xs text-indigo-200">
          Coming soon
        </p>
      </div>
    </section>
  );
}

export default CareerCoachCard;