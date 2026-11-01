import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { PlantLocationSection } from "@/components/maps/plant-location-section";
import { MonthlyChart } from "@/components/charts/monthly-chart";
import { GENERATION_COLORS, SERIES } from "@/components/charts/palette";
import { CompareAction } from "@/components/compare-action";
import { JsonLd } from "@/components/json-ld";
import { DashboardFilters } from "@/components/kpi-filters";
import { MemberCallout } from "@/components/member-callout";
import { ReasonBreakdown, sumReasons } from "@/components/reason-breakdown";
import {
  Badge,
  Container,
  DataUnavailable,
  Notice,
  PageHeader,
  Section,
  StatGrid,
  StatTile,
} from "@/components/ui";
import { getPlant } from "@/lib/api/queries";
import type { PlantMonthlyCurtailment, PlantSummary } from "@/lib/api/types";
import {
  EMPTY,
  formatBRLCompact,
  formatDate,
  formatEnergy,
  formatSource,
  formatShortMonth,
  formatLongMonth,
  formatNumber,
  formatPercent,
} from "@/lib/format";
import { findState, subsystemName } from "@/lib/geo";
import { pageMetadata } from "@/lib/metadata";
import { describePeriod, resolvePeriod } from "@/lib/period";
import { normalizeMonth, pickEnergyUnit, sortByMonth } from "@/lib/series";
import { datasetJsonLd, temporalCoverage } from "@/lib/structured-data";

const STACKED_OR_LINE = ["stacked-bar", "line"] as const;
const LINE_OR_BAR = ["line", "bar"] as const;

const PRICE_BASIS_LABEL: Record<string, string> = {
  PLD: "PLD",
  CMO: "CMO",
  PLD_FILLED: "PLD (com lacunas preenchidas)",
  CMO_FILLED: "CMO (com lacunas preenchidas)",
};

export async function plantMetadata(slug: string, periodVariant = false): Promise<Metadata> {
  const result = await getPlant(slug);
  if (!result.ok) {
    return result.error.isNotFound
      ? { title: "Usina não encontrada", robots: { index: false } }
      : { title: "Usina", robots: { index: false } };
  }
  const { plant } = result.data;
  const brazilianState = findState(plant.state);
  const kind = plant.kind === "cluster" ? "Conjunto" : "Usina";
  return pageMetadata({
    title: `${plant.name} — curtailment ${formatSource(plant.source).toLowerCase()}`,
    description: `${kind} ${formatSource(plant.source).toLowerCase()} em ${brazilianState?.name ?? plant.state}: energia cortada pelo ONS mês a mês, motivos da restrição e comparação com a média do estado.`,
    path: `/usinas/${plant.slug}`,
    noIndex: periodVariant,
  });
}

function DataItem({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:gap-4">
      <dt className="text-ink-2 text-sm sm:w-48 sm:shrink-0">{term}</dt>
      <dd className="text-sm font-medium break-words">{children ?? EMPTY}</dd>
    </div>
  );
}

function PlantLinkList({ plants }: { plants: PlantSummary[] }) {
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {plants.map((u) => (
        <li key={u.id}>
          <Link
            href={`/usinas/${u.slug}`}
            className="group border-grid bg-surface hover:border-accent flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
          >
            <span>
              <span className="group-hover:text-accent font-medium">{u.name}</span>
              <span className="text-muted block text-xs">
                {u.capacity_mw !== null
                  ? `${formatNumber(u.capacity_mw, 1)} MW`
                  : "Potência não informada"}
              </span>
            </span>
            <span aria-hidden className="text-muted group-hover:text-accent">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function comparisonText(latestRow: PlantMonthlyCurtailment, state: string): string | null {
  const plantPct = latestRow.curtailment_pct;
  const stateAvg = latestRow.state_avg_curtailment_pct;
  if (plantPct === null || stateAvg === null) return null;
  const diff = plantPct - stateAvg;
  if (Math.abs(diff) < 0.5) return `Em linha com a média das usinas da mesma fonte em ${state}.`;
  return diff > 0
    ? `${formatNumber(diff, 1)} pontos percentuais acima da média das usinas da mesma fonte em ${state}.`
    : `${formatNumber(-diff, 1)} pontos percentuais abaixo da média das usinas da mesma fonte em ${state}.`;
}

export async function PlantView({
  slug,
  query,
}: {
  slug: string;
  query: Record<string, string | string[] | undefined>;
}) {
  const result = await getPlant(slug);

  if (!result.ok) {
    if (result.error.isNotFound) notFound();
    return (
      <Container>
        <PageHeader
          eyebrow={
            <Link href="/usinas" className="underline">
              Usinas
            </Link>
          }
          title="Usina"
        >
          <p>Não foi possível carregar os dados desta usina agora.</p>
        </PageHeader>
        <DataUnavailable />
      </Container>
    );
  }

  const { plant, cluster, cluster_plants } = result.data;
  const series = sortByMonth(result.data.series);
  const latestRow = series.at(-1);
  const brazilianState = findState(plant.state);
  const isCluster = plant.kind === "cluster";

  const months = series.map((r) => normalizeMonth(r.month));
  const firstMonth = months[0] ?? "";
  const lastMonth = months.at(-1) ?? "";
  const { start, end } = resolvePeriod(query, firstMonth, lastMonth);
  const visible = series.filter((r) => {
    const month = normalizeMonth(r.month);
    return month >= start && month <= end;
  });
  const visibleLatest = visible.at(-1);
  const singleMonth = start === end;

  const energy = pickEnergyUnit(
    Math.max(0, ...visible.map((r) => r.verified_generation_mwh + r.curtailed_mwh)),
  );
  const generationRows = visible.map((r) => ({
    month: normalizeMonth(r.month),
    verified: r.verified_generation_mwh / energy.divisor,
    curtailed: r.curtailed_mwh / energy.divisor,
  }));
  const comparisonRows = visible.map((r) => ({
    month: normalizeMonth(r.month),
    plant: r.curtailment_pct,
    stateAverage: r.state_avg_curtailment_pct,
  }));
  const periodCurtailed = visible.reduce((s, r) => s + r.curtailed_mwh, 0);
  const periodVerified = visible.reduce((s, r) => s + r.verified_generation_mwh, 0);
  const potential = periodCurtailed + periodVerified;
  const periodPct = potential > 0 ? (periodCurtailed / potential) * 100 : null;
  const hasLoss = visible.some((r) => r.estimated_loss_brl !== null);
  const periodLoss = hasLoss ? visible.reduce((s, r) => s + (r.estimated_loss_brl ?? 0), 0) : null;
  const periodHours = visible.reduce((s, r) => s + r.restricted_hours, 0);

  return (
    <Container>
      <JsonLd
        data={datasetJsonLd({
          name: `Curtailment mensal — ${plant.name}`,
          description: `Geração verificada, energia cortada por restrição do ONS e perda estimada, por mês, ${isCluster ? "do conjunto" : "da usina"} ${plant.name} (${plant.state}).`,
          path: `/usinas/${plant.slug}`,
          temporalCoverage: temporalCoverage(series.map((r) => normalizeMonth(r.month))),
          spatialCoverage: `${brazilianState?.name ?? plant.state}, Brasil`,
          keywords: [plant.name, plant.state],
        })}
      />
      <PageHeader
        eyebrow={
          <>
            <Link href="/usinas" className="hover:underline">
              Usinas
            </Link>{" "}
            /{" "}
            <Link href={`/estados/${plant.state.toLowerCase()}`} className="hover:underline">
              {brazilianState?.name ?? plant.state}
            </Link>
          </>
        }
        title={plant.name}
      >
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge>{isCluster ? "Conjunto de usinas" : "Usina"}</Badge>
          <Badge>{formatSource(plant.source)}</Badge>
          <Badge>{plant.state}</Badge>
          <Badge>Subsistema {subsystemName(plant.subsystem)}</Badge>
        </div>
        {cluster ? (
          <p className="text-ink-2 mt-3 text-sm">
            Faz parte do conjunto{" "}
            <Link href={`/usinas/${cluster.slug}`} className="text-[var(--color-accent)] underline">
              {cluster.name}
            </Link>
            . O corte desta usina é uma parte do corte oficial do conjunto.
          </p>
        ) : null}
        <div className="mt-4">
          <CompareAction entity={{ kind: "plant", id: plant.slug }} />
        </div>
      </PageHeader>

      {!latestRow ? (
        <DataUnavailable title="Sem histórico de corte">
          Ainda não há registros mensais de restrição para{" "}
          {isCluster ? "este conjunto" : "esta usina"}.
        </DataUnavailable>
      ) : (
        <>
          <Section id="latest-month" title={describePeriod(start, end, formatLongMonth)}>
            <DashboardFilters first={firstMonth} last={lastMonth} start={start} end={end} />
            {visibleLatest ? (
              <StatGrid>
                <StatTile highlight label="Energia cortada" value={formatEnergy(periodCurtailed)} />
                <StatTile
                  label="% de corte"
                  value={formatPercent(periodPct)}
                  note={
                    singleMonth
                      ? `média ${formatSource(plant.source).toLowerCase()} ${plant.state}: ${formatPercent(visibleLatest.state_avg_curtailment_pct)}`
                      : "cortada ÷ (gerada + cortada)"
                  }
                />
                <StatTile
                  label="Perda estimada"
                  value={formatBRLCompact(periodLoss)}
                  note={
                    visibleLatest.price_basis
                      ? `base: ${PRICE_BASIS_LABEL[visibleLatest.price_basis] ?? visibleLatest.price_basis}`
                      : "estimativa"
                  }
                />
                <StatTile
                  label="Horas com restrição"
                  value={`${formatNumber(periodHours, 1)} h`}
                  note={
                    singleMonth && visibleLatest.national_rank
                      ? `${visibleLatest.national_rank}º no Brasil · ${visibleLatest.state_rank ?? EMPTY}º em ${plant.state}`
                      : undefined
                  }
                />
              </StatGrid>
            ) : (
              <DataUnavailable title="Sem dados no período">
                Escolha outro período para ver {isCluster ? "este conjunto" : "esta usina"}.
              </DataUnavailable>
            )}
          </Section>

          {visibleLatest ? (
            <>
              <Section
                id="history"
                title="Histórico mensal"
                description="Geração verificada é o que a usina efetivamente entregou; energia cortada é o que ela deixou de gerar por ordem do ONS."
              >
                <MonthlyChart
                  title={`Geração verificada e energia cortada por mês (${energy.unit})`}
                  rows={generationRows}
                  unit={energy.unit}
                  digits={energy.digits}
                  kindOptions={STACKED_OR_LINE}
                  periodFilter={false}
                  series={[
                    {
                      key: "verified",
                      label: "Geração verificada",
                      color: GENERATION_COLORS.verified,
                    },
                    {
                      key: "curtailed",
                      label: "Energia cortada",
                      color: GENERATION_COLORS.curtailed,
                    },
                  ]}
                />
              </Section>

              {isCluster ? null : (
                <Suspense fallback={null}>
                  <PlantLocationSection slug={plant.slug} />
                </Suspense>
              )}

              <Section
                id="comparison"
                title={`Comparação com a média de ${brazilianState?.name ?? plant.state}`}
                description={comparisonText(visibleLatest, plant.state) ?? undefined}
              >
                <MonthlyChart
                  title="% de corte por mês: esta usina × média do estado (%)"
                  description={`Média das usinas ${plant.source === "solar" ? "solares" : "eólicas"} de ${plant.state} no mês.`}
                  kind="line"
                  kindOptions={LINE_OR_BAR}
                  periodFilter={false}
                  rows={comparisonRows}
                  unit="%"
                  digits={1}
                  height={260}
                  series={[
                    {
                      key: "plant",
                      label: isCluster ? "Este conjunto" : "Esta usina",
                      color: SERIES.s1,
                    },
                    { key: "stateAverage", label: `Média ${plant.state}`, color: SERIES.s2 },
                  ]}
                />
              </Section>

              <Section id="reasons" title="Por que a energia foi cortada">
                <ReasonBreakdown
                  period={sumReasons(visible)}
                  latestMonth={sumReasons([visibleLatest])}
                  latestMonthLabel={formatShortMonth(visibleLatest.month)}
                />
              </Section>
            </>
          ) : null}
        </>
      )}

      {isCluster && cluster_plants.length > 0 ? (
        <Section
          id="cluster-plants"
          title={`Usinas deste conjunto (${cluster_plants.length})`}
          description="O ONS informa o corte do conjunto; nós o distribuímos entre as usinas proporcionalmente à perda estimada de cada uma. A soma das usinas é igual ao total do conjunto."
        >
          <PlantLinkList plants={cluster_plants} />
        </Section>
      ) : null}

      {!isCluster && cluster && cluster_plants.length > 0 ? (
        <Section id="sibling-plants" title={`Outras usinas do conjunto ${cluster.name}`}>
          <PlantLinkList plants={cluster_plants.filter((u) => u.id !== plant.id)} />
        </Section>
      ) : null}

      <Section id="registry" title="Dados cadastrais">
        <dl className="divide-grid border-grid bg-surface shadow-card divide-y rounded-2xl border px-5">
          <DataItem term="Código ONS">{plant.id}</DataItem>
          <DataItem term="Tipo">{isCluster ? "Conjunto de usinas" : "Usina"}</DataItem>
          <DataItem term="Fonte">{formatSource(plant.source)}</DataItem>
          <DataItem term="Estado">
            {brazilianState ? `${brazilianState.name} (${plant.state})` : plant.state}
          </DataItem>
          <DataItem term="Subsistema">{subsystemName(plant.subsystem)}</DataItem>
          <DataItem term="Potência">
            {plant.capacity_mw !== null ? `${formatNumber(plant.capacity_mw, 1)} MW` : null}
          </DataItem>
          <DataItem term="CEG (ANEEL)">{plant.ceg}</DataItem>
          <DataItem term="Ponto de conexão">{plant.connection_point}</DataItem>
          <DataItem term="Agente operador">{plant.operator}</DataItem>
          <DataItem term="Atualizado em">{formatDate(plant.updated_at)}</DataItem>
        </dl>
      </Section>

      <div className="pb-6">
        <MemberCallout />
      </div>

      <Notice>
        {cluster
          ? "Os números desta usina são estimados a partir do corte oficial do conjunto a que ela pertence."
          : isCluster
            ? "Os números do conjunto são os oficiais do ONS."
            : "Esta usina é despachada individualmente pelo ONS; os números são os oficiais."}{" "}
        A perda em R$ é uma estimativa pelo PLD, não o prejuízo contábil da usina.{" "}
        <Link href="/metodologia" className="underline">
          Veja a metodologia
        </Link>
        .
      </Notice>
    </Container>
  );
}
