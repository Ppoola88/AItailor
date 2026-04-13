const professionals = [
  {
    name: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Data Engineer",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "QA Lead",
    image:
      "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Backend Developer",
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=900&q=80",
  },
];

export function TrustSection() {
  return (
    <section id="trust" className="fade-up rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_14px_40px_rgba(0,0,0,0.35)] sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
          Built for Engineers Who Want Results
        </h2>
        <p className="max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
          Trusted by professionals who apply strategically and care about outcomes, not generic resume noise.
        </p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {professionals.map((person) => (
          <article
            key={person.name}
            className="group rounded-2xl border border-white/10 bg-[#121212] p-3 transition duration-300 hover:-translate-y-1 hover:border-yellow-300/45"
          >
            <div
              className="h-52 rounded-xl bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
              style={{ backgroundImage: `url(${person.image})` }}
              role="img"
              aria-label={`${person.name} working with a laptop in an office setup`}
            />
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.1em] text-yellow-200">{person.name}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
