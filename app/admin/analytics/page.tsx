"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Home,
  Eye,
  MessageSquare,
  TrendingUp,
  Building2,
} from "lucide-react";

const ADMIN_EMAIL = "djaglijosephbenoit@gmail.com";

interface AnalyticsStats {
  totalListings: number;
  totalAgences: number;
  totalParticuliers: number;
  totalVues: number;
  totalClicsWhatsapp: number;
  newListingsToday: number;
  newUsersToday: number;
}

interface TopListing {
  id: string;
  title: string;
  zone_saisie: string | null;
  views: number | null;
  whatsapp_clicks: number | null;
  images_urls: string[] | null;
}

export default function AnalyticsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<AnalyticsStats>({
    totalListings: 0,
    totalAgences: 0,
    totalParticuliers: 0,
    totalVues: 0,
    totalClicsWhatsapp: 0,
    newListingsToday: 0,
    newUsersToday: 0,
  });

  const [topBiens, setTopBiens] = useState<TopListing[]>([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { createClient } = await import(
        "@/lib/supabase/client"
      );

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || user.email !== ADMIN_EMAIL) {
        router.push("/");
        return;
      }

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const [
        { count: totalListings },
        { count: totalAgences },
        { count: totalParticuliers },
        { data: vuesData },
        { count: newListingsToday },
        { count: newUsersToday },
        { data: topBiensData },
      ] = await Promise.all([
        supabase
          .from("listings")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("profiles")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("user_type", "agence"),

        supabase
          .from("profiles")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("user_type", "particulier"),

        supabase
          .from("listings")
          .select("views, whatsapp_clicks"),

        supabase
          .from("listings")
          .select("*", {
            count: "exact",
            head: true,
          })
          .gte(
            "created_at",
            today.toISOString()
          ),

        supabase
          .from("profiles")
          .select("*", {
            count: "exact",
            head: true,
          })
          .gte(
            "created_at",
            today.toISOString()
          ),

        supabase
          .from("listings")
          .select(
            "id, title, zone_saisie, views, whatsapp_clicks, images_urls"
          )
          .order("views", {
            ascending: false,
          })
          .limit(5),
      ]);

      const totalVues =
        vuesData?.reduce(
          (total, listing) =>
            total + (listing.views ?? 0),
          0
        ) ?? 0;

      const totalClicsWhatsapp =
        vuesData?.reduce(
          (total, listing) =>
            total + (listing.whatsapp_clicks ?? 0),
          0
        ) ?? 0;

      if (!mounted) {
        return;
      }

      setStats({
        totalListings: totalListings ?? 0,
        totalAgences: totalAgences ?? 0,
        totalParticuliers:
          totalParticuliers ?? 0,
        totalVues,
        totalClicsWhatsapp,
        newListingsToday:
          newListingsToday ?? 0,
        newUsersToday:
          newUsersToday ?? 0,
      });

      setTopBiens(
        (topBiensData ?? []) as TopListing[]
      );

      setLoading(false);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/60">
        <div className="text-sm text-slate-400 animate-pulse">
          Chargement des analytics...
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Annonces totales",
      value: stats.totalListings,
      icon: Home,
      color: "text-slate-900",
    },
    {
      label: "Agences inscrites",
      value: stats.totalAgences,
      icon: Building2,
      color: "text-blue-600",
    },
    {
      label: "Particuliers inscrits",
      value: stats.totalParticuliers,
      icon: Users,
      color: "text-purple-600",
    },
    {
      label: "Vues totales annonces",
      value: stats.totalVues,
      icon: Eye,
      color: "text-slate-900",
    },
    {
      label: "Clics WhatsApp totaux",
      value: stats.totalClicsWhatsapp,
      icon: MessageSquare,
      color: "text-emerald-600",
    },
    {
      label: "Nouvelles annonces aujourd'hui",
      value: stats.newListingsToday,
      icon: TrendingUp,
      color: "text-amber-600",
    },
    {
      label: "Nouveaux inscrits aujourd'hui",
      value: stats.newUsersToday,
      icon: Users,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-950">
            Analytics AURAX
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Vue d&apos;ensemble de la plateforme en
            temps réel
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    {stat.label}
                  </span>

                  <Icon
                    className={`h-4 w-4 ${stat.color}`}
                  />
                </div>

                <div
                  className={`font-mono text-3xl font-black ${stat.color}`}
                >
                  {stat.value.toLocaleString("fr-FR")}
                </div>
              </div>
            );
          })}
        </div>

        {/* Top listings */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-900">
            Top 5 — Annonces les plus vues
          </h2>

          <div className="space-y-3">
            {topBiens.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">
                Aucune donnée disponible
              </p>
            ) : (
              topBiens.map((listing, index) => (
                <div
                  key={listing.id}
                  className="flex items-center gap-4 rounded-xl bg-slate-50 p-3"
                >
                  {/* Rank */}
                  <span className="w-6 font-mono text-lg font-black text-slate-300">
                    #{index + 1}
                  </span>

                  {/* Image */}
                  <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                    {listing.images_urls?.[0] ? (
                      <img
                        src={listing.images_urls[0]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  {/* Listing */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {listing.title}
                    </p>

                    <p className="text-xs text-slate-400">
                      {listing.zone_saisie ?? "Zone non renseignée"}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="flex shrink-0 items-center gap-4 text-right">
                    <div>
                      <div className="font-mono text-sm font-black text-slate-900">
                        {(
                          listing.views ?? 0
                        ).toLocaleString("fr-FR")}
                      </div>

                      <div className="text-[10px] text-slate-400">
                        vues
                      </div>
                    </div>

                    <div>
                      <div className="font-mono text-sm font-black text-emerald-600">
                        {(
                          listing.whatsapp_clicks ?? 0
                        ).toLocaleString("fr-FR")}
                      </div>

                      <div className="text-[10px] text-slate-400">
                        clics WA
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}