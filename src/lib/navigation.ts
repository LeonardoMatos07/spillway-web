import { availableForecasts } from "./forecasts";

export interface NavChild {
  href: string;
  label: string;
  description: string;
}

export interface NavItem {
  href: string;
  label: string;
  matches: readonly string[];
  /** Pages of an area, shown in a dropdown (desktop) or an expandable group (mobile). */
  children?: readonly NavChild[];
}

/**
 * The main menu has six groups: five to read (Painel, Mercado, Curtailment, Notícias,
 * Previsões) and one to use (Ferramentas: Plotador, Comparar). All forecasts live in Previsões,
 * built from src/lib/forecasts.ts. Painel holds the overview, the maps and the two
 * physical systems (Sistema, Água). Each group has at
 * most MAX_NAV_CHILDREN pages and no page is in two groups. The method lives in the footer.
 */
export const MAX_NAV_CHILDREN = 5;

export const NAV: readonly NavItem[] = [
  {
    href: "/painel",
    label: "Painel",
    matches: ["/painel", "/mapas", "/sistema", "/agua"],
    children: [
      {
        href: "/painel",
        label: "Visão geral do setor",
        description: "O setor elétrico em resumo.",
      },
      {
        href: "/mapas",
        label: "Mapas",
        description: "Estados no mapa do Brasil; outras camadas virão.",
      },
      {
        href: "/sistema",
        label: "Sistema",
        description: "Carga, geração, intercâmbio e térmicas.",
      },
      { href: "/agua", label: "Água", description: "Reservatórios, afluência e vertimento." },
    ],
  },
  {
    href: "/mercado/pld",
    label: "Mercado",
    matches: ["/mercado", "/qualidade", "/tarifas", "/bandeira"],
    children: [
      { href: "/mercado/pld", label: "PLD", description: "Preço da energia no curto prazo." },
      { href: "/mercado/livre", label: "Mercado livre", description: "Consumo e migração." },
      { href: "/tarifas", label: "Tarifas", description: "Bandeiras tarifárias." },
      { href: "/qualidade", label: "Qualidade", description: "DEC e FEC das distribuidoras." },
      {
        href: "/bandeira",
        label: "Bandeira",
        description: "Calculadora, histórico e previsão da bandeira.",
      },
    ],
  },
  {
    href: "/curtailment",
    label: "Curtailment",
    matches: ["/curtailment", "/estados", "/usinas", "/relatorios", "/analises"],
    children: [
      {
        href: "/curtailment",
        label: "Visão geral do curtailment",
        description: "Painel nacional do corte.",
      },
      { href: "/estados", label: "Estados", description: "Corte por estado." },
      { href: "/usinas", label: "Usinas", description: "Usina por usina." },
      { href: "/analises", label: "Análises", description: "Compensação, empresas e horários." },
      { href: "/relatorios", label: "Relatórios", description: "Um por mês, desde 2021." },
    ],
  },
  {
    href: "/noticias",
    label: "Notícias",
    matches: ["/noticias"],
    children: [
      { href: "/noticias", label: "Notícias", description: "O que os órgãos do setor publicam." },
      { href: "/noticias/atos", label: "Atos oficiais", description: "Atos regulatórios." },
      {
        href: "/noticias/assinar",
        label: "Receber por e-mail",
        description: "Resumo das notícias na sua caixa.",
      },
    ],
  },
  {
    href: "/previsoes",
    label: "Previsões",
    // Addresses of the forecasts that live under this group (/bandeira is under Mercado).
    matches: ["/previsoes", "/previsao"],
    children: [
      {
        href: "/previsoes",
        label: "Visão geral das previsões",
        description: "Todas as previsões e seus modelos.",
      },
      ...availableForecasts().map((forecast) => ({
        href: forecast.href,
        label: forecast.title,
        description: forecast.predicts,
      })),
    ],
  },
  {
    href: "/ferramentas",
    label: "Ferramentas",
    matches: ["/ferramentas", "/comparar"],
    children: [
      {
        href: "/ferramentas/plotador",
        label: "Plotador de gráficos",
        description: "Gráficos com ajuste de curva.",
      },
      {
        href: "/comparar",
        label: "Comparar",
        description: "Estados, usinas e subsistemas, por fonte.",
      },
    ],
  },
];

export const EXPLORE_TABS = [
  { key: "estados", href: "/estados", label: "Estados" },
  { key: "usinas", href: "/usinas", label: "Usinas" },
] as const;

export type ExploreTab = (typeof EXPLORE_TABS)[number]["key"];

export const FOOTER_COLUMNS = [
  {
    title: "Áreas",
    links: [
      { href: "/painel", label: "Painel" },
      { href: "/sistema", label: "Sistema" },
      { href: "/agua", label: "Água" },
      { href: "/mercado/pld", label: "Mercado" },
      { href: "/curtailment", label: "Curtailment" },
      { href: "/noticias", label: "Notícias" },
      { href: "/previsoes", label: "Previsões" },
    ],
  },
  {
    title: "Ferramentas",
    links: [
      { href: "/ferramentas/plotador", label: "Plotador de gráficos" },
      { href: "/comparar", label: "Comparar" },
      { href: "/ferramentas", label: "Todas as ferramentas" },
    ],
  },
  {
    title: "Spillway",
    links: [
      { href: "/relatorios", label: "Relatórios mensais" },
      { href: "/analises", label: "Análises de curtailment" },
      { href: "/metodologia", label: "Metodologia" },
      { href: "/noticias/rss.xml", label: "RSS" },
      { href: "/noticias/assinar", label: "Newsletter" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacidade", label: "Privacidade" },
      { href: "/newsletter/descadastrar", label: "Cancelar newsletter" },
    ],
  },
] as const;

export function isUnder(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isNavActive(pathname: string, matches: readonly string[]): boolean {
  return matches.some((prefix) => isUnder(pathname, prefix));
}
