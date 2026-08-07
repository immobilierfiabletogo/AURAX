import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                cookieStore.set(name, value, options);
              }
            );
          } catch {
            // Peut arriver dans certains contextes où les cookies
            // ne peuvent pas être modifiés.
          }
        },
      },
    }
  );

  if (!code) {
    return NextResponse.redirect(
      new URL("/login", origin)
    );
  }

  const { error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error(
      "Erreur exchangeCodeForSession:",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/login?error=confirmation",
        origin
      )
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/login", origin)
    );
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select(
        `
        is_admin,
        verification_status,
        subscription_status
        `
      )
      .eq("id", user.id)
      .single();

  if (profileError || !profile) {
    return NextResponse.redirect(
      new URL("/login", origin)
    );
  }

  /*
   * ADMIN
   *
   * Un compte administrateur ne doit pas être soumis
   * aux restrictions du parcours agence.
   */
  if (profile.is_admin) {
    return NextResponse.redirect(
      new URL("/admin", origin)
    );
  }

  /*
   * PARCOURS AGENCE
   */

  switch (profile.verification_status) {
    case "pending":
      return NextResponse.redirect(
        new URL(
          "/agences/en-attente",
          origin
        )
      );

    case "rejected":
      return NextResponse.redirect(
        new URL(
          "/login?error=rejected",
          origin
        )
      );

    case "suspended":
      return NextResponse.redirect(
        new URL(
          "/login?error=suspended",
          origin
        )
      );

    case "approved":
      if (
        profile.subscription_status !==
        "active"
      ) {
        return NextResponse.redirect(
          new URL(
            "/dashboard-agence/abonnement",
            origin
          )
        );
      }

      return NextResponse.redirect(
        new URL(
          "/dashboard-agence",
          origin
        )
      );

    default:
      return NextResponse.redirect(
        new URL("/login", origin)
      );
  }
}