import Link from "next/link";
import { Container, PageHeader } from "@/components/ui";
import { getForecastModel } from "@/lib/api/queries";
import { formatDate } from "@/lib/format";
import { FORECASTS, type ForecastEntry } from "@/lib/forecasts";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Previsões do setor elétrico",
  description:
    "Todas as previsões do site num só lugar: risco de curtailment, bandeira tarifária e afluência, com o modelo, o horizonte e a data da última atualização de cada uma.",
  path: "/previsoes",
});

interface ModelInfo {
  version?: string;
  updatedAt?: string;
}

/** Version and date of the model behind each forecast, when its API provides them. */
async function loadModelInfo(): Promise<Partial<Record<ForecastEntry["key"], ModelInfo>>> {
  const curtailment = await getForecastModel();
  return curtailment.ok
    ? {
        curtailment: {
          version: curtailment.data.model_version,
          updatedAt: curtailment.data.trained_at,
        },
      }
    : {};
}

function Details({ forecast, info }: { forecast: ForecastEntry; info?: ModelInfo }) {
  return (
    <dl className="mt-3 space-y-1.5 text-sm">
      <div className="flex gap-2">
        <dt className="text-muted shrink-0">Horizonte</dt>
        <dd className="text-ink-2">{forecast.horizon}</dd>
      </div>
      {info?.updatedAt ? (
        <div className="flex gap-2">
          <dt className="text-muted shrink-0">Atualizado</dt>
          <dd className="text-ink-2">{formatDate(info.updatedAt)}</dd>
        </div>
      ) : null}
    </dl>
  );
}

function ModelTag({ forecast, info }: { forecast: ForecastEntry; info?: ModelInfo }) {
  if (!forecast.model) {
    return <p className="text-muted mt-auto pt-4 text-xs">Modelo em definição</p>;
  }
  return (
    <p className="border-line text-ink-2 mt-auto rounded-lg border px-3 py-1.5 text-xs">
      <span className="text-muted">Modelo </span>
      <span className="font-semibold">{forecast.model}</span>
      {info?.version ? <span className="text-muted"> · versão {info.version}</span> : null}
    </p>
  );
}

export default async function ForecastsPage() {
  const info = await loadModelInfo();
  return (
    <Container>
      <PageHeader eyebrow="Previsões" title="Todas as previsões do setor num só lugar">
        <p>
          Cada previsão mostra o que prevê, até quando, e qual modelo está por trás. As que ainda
          estão sendo testadas aparecem como em avaliação e as que não estão no ar, como em breve.
        </p>
      </PageHeader>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FORECASTS.map((forecast) => {
          const available = forecast.status === "available";
          const open = available || forecast.status === "evaluating";
          const body = (
            <>
              <span className="flex items-center justify-between gap-2">
                <span className="text-lg font-semibold group-hover:underline">
                  {forecast.title}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    available ? "bg-accent-soft text-accent-strong" : "bg-surface-2 text-ink-2"
                  }`}
                >
                  {available ? "Disponível" : open ? "Em avaliação" : "Em breve"}
                </span>
              </span>
              <span className="text-ink-2 mt-2 block text-sm leading-6">{forecast.predicts}</span>
              <Details forecast={forecast} info={info[forecast.key]} />
              {available && forecast.members ? (
                <span className="text-muted mt-2 block text-xs">Com conta gratuita</span>
              ) : null}
              <div className="mt-auto flex pt-4">
                <ModelTag forecast={forecast} info={info[forecast.key]} />
              </div>
            </>
          );
          const className =
            "border-grid bg-surface shadow-card flex h-full flex-col rounded-2xl border p-5";
          return (
            <li key={forecast.key}>
              {open ? (
                <Link
                  href={forecast.href}
                  className={`${className} hover:border-accent focus-visible:outline-accent group transition-colors focus-visible:outline-2 focus-visible:outline-offset-2`}
                >
                  {body}
                </Link>
              ) : (
                <div className={`${className} opacity-80`}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
