export interface ShareData {
  id: string
  title: string
  zone: string
  price: number
  image?: string
}

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://aurax.immo"

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(price)
}

export function buildListingUrl(id: string) {
  return `${APP_URL}/biens/${id}`
}

export function buildShareText(listing: ShareData) {
  const url = buildListingUrl(listing.id)

  return `🏡 ${listing.title}

📍 ${listing.zone}
💰 ${formatPrice(listing.price)}

Découvrez cette annonce sur AURAX :

${url}

➡️ Retrouvez également d'autres biens immobiliers similaires sur AURAX.`
}

export async function shareListing(listing: ShareData) {
  const url = buildListingUrl(listing.id)

  const payload = {
    title: listing.title,
    text: buildShareText(listing),
    url,
  }

  if (navigator.share) {
    try {
      await navigator.share(payload)
      return
    } catch {}
  }

  await navigator.clipboard.writeText(buildShareText(listing))

  alert("Lien copié dans le presse-papier.")
}