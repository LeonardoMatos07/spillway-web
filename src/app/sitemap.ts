import type { MetadataRoute } from "next";
import { getNews } from "@/lib/api/queries";
import { MAP_LAYERS } from "@/lib/maps";
import { EXAMPLES } from "@/lib/plotter/examples";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

/** Only what is open to anyone: the home page, the method, sign-up, privacy and the news. The
 * data pages are for members and stay out. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Only news with a Spillway note have a page of their own; the others link to the source.
  const news = await getNews({ limit: 50 });
  const noted = news.ok ? news.data.items.filter((item) => item.has_editor_note) : [];
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/painel"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/sistema"), changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/agua"), changeFrequency: "daily", priority: 0.8 },
    // Map layers open to anyone; the layers that need an account stay out, like their data pages.
    ...MAP_LAYERS.filter((layer) => !layer.account).map((layer) => ({
      url: absoluteUrl(layer.href),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
    { url: absoluteUrl("/metodologia"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/cadastro"), changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/previsoes"), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/bandeira"), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/ferramentas"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/ferramentas/plotador"), changeFrequency: "monthly", priority: 0.7 },
    ...EXAMPLES.map((example) => ({
      url: absoluteUrl(`/ferramentas/plotador/exemplos/${example.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: absoluteUrl("/privacidade"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/noticias"), changeFrequency: "hourly", priority: 0.7 },
    { url: absoluteUrl("/noticias/atos"), changeFrequency: "daily", priority: 0.5 },
    { url: absoluteUrl("/noticias/fontes"), changeFrequency: "monthly", priority: 0.3 },
    ...noted.map((item) => ({
      url: absoluteUrl(`/noticias/${item.id}`),
      lastModified: item.source_updated_at ?? item.published_at,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
