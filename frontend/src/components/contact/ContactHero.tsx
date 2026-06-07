export default function ContactHero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#40916c] py-28 sm:py-36 text-center">
      {/* Decorative background gradients */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-white/5 blur-3xl" />
      
      <div className="relative mx-auto max-w-4xl px-6">
        <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white backdrop-blur-sm">
          Contact Us
        </span>
        <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl tracking-tight">
          We&apos;d Love to Hear From You
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-emerald-50/80 sm:text-lg">
          Have questions about our initiatives, volunteer programs, or donation partnerships? 
          Get in touch with the Mthunzi Trust team today.
        </p>
      </div>
    </section>
  );
}
