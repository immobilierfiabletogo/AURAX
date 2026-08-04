import RequestForm from '@/components/requests/RequestForm'

export default function DemandesPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <section
        id="request-form"
        className="
          mx-auto
          max-w-5xl
          px-4
          py-10
          sm:px-6
          lg:px-8
        "
      >
        <RequestForm />
      </section>
    </main>
  )
}