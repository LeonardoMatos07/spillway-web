import Link from "next/link";
import { ExploreTabs } from "@/components/explore-tabs";
import { StatesMapPanel } from "@/components/maps/states-map-panel";
import { Container, PageHeader, Section } from "@/components/ui";
import { getGeoStatesCurtailment } from "@/lib/api/queries";
import { STATES, REGIONS } from "@/lib/geo";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Curtailment por estado",
  description:
    "Escolha um estado para ver a série mensal de energia eólica e solar cortada e as usinas mais afetadas.",
  path: "/estados",
});

export default async function StatesPage() {
  const map = await getGeoStatesCurtailment();
  return (
    <Container>
      <ExploreTabs active="estados" />
      <PageHeader title="Curtailment por estado">
        <p>
          A maior parte dos parques eólicos e solares fica no Nordeste, mas há usinas em quase todo
          o país. Estados sem usinas eólicas ou solares despachadas pelo ONS aparecem sem dados.
        </p>
      </PageHeader>
      {map.ok ? (
        <Section
          id="mapa"
          title="No mapa"
          description="O corte de eólica e solar em cada estado no último mês com dados. Clique em um estado para abrir a página dele."
        >
          <StatesMapPanel initial={map.data} initialMetric="pct" compact />
        </Section>
      ) : null}
      {REGIONS.map((region) => (
        <Section key={region} title={region}>
          <ul className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {STATES.filter((e) => e.region === region).map((e) => (
              <li key={e.state}>
                <Link
                  href={`/estados/${e.state.toLowerCase()}`}
                  className="group flex items-center justify-between rounded-xl border border-[var(--color-grid)] bg-[var(--color-surface)] px-4 py-3 shadow-[0_1px_3px_rgba(25,55,43,0.03)] hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:shadow-md"
                >
                  <span>
                    <span className="bg-accent-soft group-hover:bg-accent group-hover:text-on-accent mr-2 inline-flex h-8 w-9 items-center justify-center rounded-lg text-sm font-bold text-[var(--color-accent-strong)]">
                      {e.state}
                    </span>
                    <span className="text-sm font-medium text-[var(--color-ink-2)]">{e.name}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-lg text-[var(--color-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
                  >
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </Container>
  );
}
