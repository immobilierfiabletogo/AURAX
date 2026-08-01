import Hero from "@/components/requests/Hero";
import RequestForm from "@/components/requests/RequestForm";

export default function DemandesPage() {
  return (
    <main className="bg-slate-50">
      <Hero />

      <section
        id="request-form"
        className="mx-auto -mt-16 max-w-5xl px-6 pb-24 relative z-10"
      >
        <RequestForm />
      </section>
    </main>
  );
}