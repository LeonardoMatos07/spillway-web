import { Suspense } from "react";
import { AreaFilters } from "@/components/area-filters";
import { BlockSkeleton } from "@/components/block-skeleton";
import { ReservoirsBlock, SpilledBlock, StorageBlock } from "@/components/blocks/water-blocks";
import { WaterViewSwitch } from "@/components/maps/water-map-section";
import { Container, PageHeader, Section } from "@/components/ui";
import { currentMonth, FIRST_MONTH, parseFilters, type SearchParams } from "@/lib/filters";

/**
 * The Água page for a set of search params (?de=&ate=&sub=). /agua renders it statically with
 * no params; /agua/periodo (reached by the middleware rewrite) renders it per request.
 */
export function WaterView({ params }: { params: SearchParams }) {
  const filters = parseFilters(params, FIRST_MONTH, currentMonth());
  const key = `${filters.start}|${filters.end}|${filters.sub}`;
  return (
    <Container>
      <PageHeader eyebrow="Água" title="Reservatórios, vazões e energia vertida">
        A maior parte da eletricidade do Brasil vem da água. Aqui está quanto estoque os
        reservatórios guardam, quanta água chega e onde ela passa sem virar energia.
      </PageHeader>

      <WaterViewSwitch>
        <AreaFilters
          first={FIRST_MONTH}
          last={currentMonth()}
          start={filters.start}
          end={filters.end}
          sub={filters.sub}
          note="O período vale para EAR e ENA (até cerca de seis anos, contados do fim do período) e o vertimento mostra o último mês dele. A lista de reservatórios é a posição mais recente."
        />

        <Section
          id="armazenamento"
          title="Armazenamento e afluência"
          description="Por subsistema, dia a dia."
        >
          <Suspense key={key} fallback={<BlockSkeleton height={520} />}>
            <StorageBlock filters={filters} />
          </Suspense>
        </Section>

        <div className="grid gap-x-8 lg:grid-cols-2">
          <Section id="reservatorios" title="Maiores reservatórios">
            <Suspense key={key} fallback={<BlockSkeleton height={420} />}>
              <ReservoirsBlock filters={filters} />
            </Suspense>
          </Section>
          <Section id="vertimento" title="Energia vertida">
            <Suspense key={key} fallback={<BlockSkeleton height={420} />}>
              <SpilledBlock filters={filters} />
            </Suspense>
          </Section>
        </div>
      </WaterViewSwitch>
    </Container>
  );
}
