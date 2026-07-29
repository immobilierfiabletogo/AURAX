'use client'

import {
  Check,
  Copy,
  Link2,
  MessageCircle,
  Share2,
} from 'lucide-react'

import {
  FaFacebookF,
  FaTelegram,
  FaXTwitter,
} from 'react-icons/fa6'

import {
  useState,
} from 'react'


interface Props {
  title: string
}



export default function ListingShare({
  title,
}: Props) {

  const [copied, setCopied] =
    useState(false)



  const url =
    typeof window !== 'undefined'
      ? window.location.href
      : ''



  async function copyLink() {

    if (!url) return


    await navigator.clipboard.writeText(
      url
    )


    setCopied(true)


    setTimeout(() => {
      setCopied(false)
    }, 2000)

  }



  function shareWhatsApp() {

    const text =
      `${title}\n\n${url}`


    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank'
    )

  }



  function shareFacebook() {

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank'
    )

  }



  function shareX() {

    const text =
      `${title}`


    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    )

  }



  function shareTelegram() {

    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      '_blank'
    )

  }



   async function nativeShare() {

    if (
      typeof navigator === 'undefined'
    ) {
      return
    }


    if (
    navigator.share
    ) {

      await navigator.share({
        title,
        text: title,
        url,
      })

    }

  }



  return (

    <section
      className="
        space-y-4
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
          text-sm
          font-black
          text-slate-700
        "
      >

        <Share2
          className="
            h-5
            w-5
            text-emerald-600
          "
        />

        Partager ce bien

      </div>



      <div
        className="
          flex
          flex-wrap
          gap-3
        "
      >

        <button
          onClick={copyLink}
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            text-sm
            font-bold
            transition
            hover:bg-slate-50
          "
        >

          {
            copied ? (
              <Check
                className="
                  h-4
                  w-4
                  text-emerald-600
                "
              />

            ) : (

              <Copy
                className="
                  h-4
                  w-4
                "
              />

            )
          }


          {
            copied
              ? 'Copié'
              : 'Copier'
          }

        </button>



        <button
          onClick={shareWhatsApp}
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-emerald-600
            px-4
            py-3
            text-sm
            font-bold
            text-white
            transition
            hover:bg-emerald-700
          "
        >

          <MessageCircle
            className="
              h-4
              w-4
            "
          />

          WhatsApp

        </button>



        <button
          onClick={shareFacebook}
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-blue-600
            px-4
            py-3
            text-sm
            font-bold
            text-white
          "
        >

          <FaFacebookF
            className="
              h-4
              w-4
            "
          />

          Facebook

        </button>



        <button
          onClick={shareX}
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-black
            px-4
            py-3
            text-sm
            font-bold
            text-white
          "
        >

          <FaXTwitter
            className="
              h-4
              w-4
            "
          />

          X

        </button>



        <button
          onClick={shareTelegram}
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-sky-500
            px-4
            py-3
            text-sm
            font-bold
            text-white
          "
        >

          <FaTelegram
            className="
              h-4
              w-4
            "
          />

          Telegram

        </button>



        <button
        onClick={nativeShare}
        className="
          flex
          items-center
          gap-2
          rounded-2xl
          border
          border-slate-200
          bg-white
          px-4
          py-3
          text-sm
          font-bold
          text-slate-700
        "
      >

        <Link2
          className="
            h-4
            w-4
          "
        />

        Plus

      </button>


      </div>


    </section>

  )
}