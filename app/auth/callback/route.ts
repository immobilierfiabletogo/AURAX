import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  if (!code) {
    return NextResponse.redirect(new URL('/login', origin))
  }

  const { error } =
    await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(
      new URL('/login?error=confirmation', origin)
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(
      new URL('/login', origin)
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select(
      `
      verification_status,
      subscription_status
      `
    )
    .eq('id', user.id)
    .single()

  if (!profile) {
    return NextResponse.redirect(
      new URL('/login', origin)
    )
  }

  switch (profile.verification_status) {

    case 'pending':
      return NextResponse.redirect(
        new URL('/agences/en-attente', origin)
      )

    case 'rejected':
      return NextResponse.redirect(
        new URL('/login?error=rejected', origin)
      )

    case 'suspended':
      return NextResponse.redirect(
        new URL('/login?error=suspended', origin)
      )

    case 'approved':

      if (
        profile.subscription_status !== 'active'
      ) {
        return NextResponse.redirect(
          new URL(
            '/dashboard-agence/abonnement',
            origin
          )
        )
      }

      return NextResponse.redirect(
        new URL('/dashboard-agence', origin)
      )

    default:
      return NextResponse.redirect(
        new URL('/login', origin)
      )
  }
}
