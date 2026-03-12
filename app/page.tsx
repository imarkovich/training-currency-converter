import { ConverterForm, PageFooter, PageHeader } from "@/components";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(240,117,37,0.2),transparent_45%),radial-gradient(circle_at_90%_20%,rgba(51,89,255,0.2),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(21,153,87,0.14),transparent_45%)]" />
      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader />
        <section className="mb-6 rounded-3xl border border-white/40 bg-white/65 p-4 shadow-2xl shadow-slate-800/10 backdrop-blur-sm sm:p-6">
          <ConverterForm />
        </section>
        <PageFooter />
      </main>
    </div>
  );
}
