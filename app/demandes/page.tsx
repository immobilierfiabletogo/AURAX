import Hero from '@/components/requests/Hero'
import RequestForm from '@/components/requests/RequestForm'

export default function DemandesPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5]">

      <Hero />

      <section
        id="request-form"
        className="
          relative
          z-10
          mx-auto
          -mt-24
          max-w-5xl
          px-4
          pb-24
          sm:px-6
          lg:px-8
        "
      >
        <RequestForm />
      </section>

    </main>
  )
}