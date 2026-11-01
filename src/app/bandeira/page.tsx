import { FlagSimulator } from "@/components/flag/simulator";
import {
  Card,
  Container,
  DataUnavailable,
  Notice,
  PageHeader,
  Section,
  TextLink,
} from "@/components/ui";
import { getFlagForecast, getFlagMonths, getFlagRule, getFlagScoreboard } from "@/lib/api/queries";
import type { FlagAttribution, FlagForecastResponse, FlagMonth } from "@/lib/api/types";
import { computeBands, flagColor, flagLabel, pickVersion, whatMustChange } from "@/lib/flag";
import { formatBRL, formatDate, formatLongMonth, formatNumber, formatPercent } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Bandeira tarifária: calculadora, histórico e previsão",
  description:
    "Veja como a bandeira tarifária é calculada, simule o resultado com seus próprios números e acompanhe o histórico, o placar e a previsão do próximo mês, com a regra à mostra.",
  path: "/bandeira",
});

const DISCLAIMER =
  "Previsão estatística, não é a decisão da ANEEL nem aconselhamento financeiro. A bandeira oficial é a que a ANEEL anuncia.";

function FlagName({ name }: { name: string | null | undefined }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-medium">
      <span
        aria-hidden="true"
        className="inline-block size-2.5 rounded-full"
        style={{ backgroundColor: flagColor(name) }}
      />
      {flagLabel(name)}
    </span>
  );
}

function Attribution({ attribution }: { attribution: FlagAttribution }) {
  return (
    <div className="text-muted mt-3 text-xs leading-5">
      <p>{attribution.text}</p>
      <p>{attribution.legal_note}</p>
    </div>
  );
}

function ForecastBlock({ forecast }: { forecast: FlagForecastResponse }) {
  if (!forecast.published) {
    return (
      <Notice>
        <p className="font-semibold">Previsão em avaliação</p>
        <p className="mt-1">
          {forecast.notice} Só publicamos um prazo depois que ele vence referências simples num
          teste com dados que o modelo não viu, e dizemos aqui quando isso acontecer.
        </p>
      </Notice>
    );
  }
  return (
    <div className="space-y-6">
      {forecast.runs.map((run) => (
        <Card key={run.lead_days} className="p-5">
          <h3 className="text-base font-semibold">
            {run.lead_days} dias antes do anúncio, para {formatLongMonth(forecast.target_month)}
          </h3>
          <p className="text-muted mt-1 text-xs">
            Gerada em {formatDate(run.generated_at)}, com dados até {formatDate(run.data_through)}.
            Modelo {run.model_version}, regra {run.rule_version}.
          </p>
          <table className="tabular mt-3 w-full max-w-xl text-sm">
            <caption className="sr-only">Probabilidade de cada bandeira</caption>
            <thead className="text-ink-2 text-left">
              <tr>
                <th scope="col" className="py-1.5 font-medium">
                  Bandeira
                </th>
                <th scope="col" className="py-1.5 font-medium">
                  Chance
                </th>
                <th scope="col" className="py-1.5 font-medium">
                  Faixa do PLD gatilho
                </th>
              </tr>
            </thead>
            <tbody>
              {run.probabilities.map((p) => (
                <tr key={p.flag} className="border-grid border-t">
                  <th scope="row" className="py-1.5 text-left">
                    <FlagName name={p.flag} />
                  </th>
                  <td className="py-1.5">
                    <span
                      aria-hidden="true"
                      className="mr-2 inline-block h-2 rounded-full align-middle"
                      style={{
                        width: `${Math.round(p.prob * 120)}px`,
                        backgroundColor: flagColor(p.flag),
                      }}
                    />
                    {formatPercent(p.prob * 100, 0)}
                  </td>
                  <td className="py-1.5">
                    {formatBRL(p.band_lower_brl_per_mwh)} a {formatBRL(p.band_upper_brl_per_mwh)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {run.trigger_p50_brl_per_mwh !== null ? (
            <p className="text-ink-2 mt-3 text-sm">
              PLD gatilho previsto: mediana R$ {formatNumber(run.trigger_p50_brl_per_mwh, 2, 2)},
              intervalo de 80% de R$ {formatNumber(run.trigger_p10_brl_per_mwh, 2, 2)} a R${" "}
              {formatNumber(run.trigger_p90_brl_per_mwh, 2, 2)}.
            </p>
          ) : null}
        </Card>
      ))}
      <Notice>{forecast.notice}</Notice>
    </div>
  );
}

function History({ months }: { months: FlagMonth[] }) {
  const rows = [...months].reverse().slice(0, 24);
  return (
    <Card className="overflow-x-auto">
      <table className="tabular w-full min-w-[640px] text-sm">
        <caption className="sr-only">Insumos e resultado da regra nos últimos meses</caption>
        <thead className="bg-surface-2 text-ink-2 text-left">
          <tr>
            {["Mês", "Bandeira", "PLD gatilho", "GSF", "Verde até", "Amarela até", "Boletim"].map(
              (h) => (
                <th key={h} scope="col" className="px-3 py-2.5 font-medium">
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => (
            <tr key={m.month} className="border-grid border-t">
              <th scope="row" className="px-3 py-2 text-left font-medium">
                {formatLongMonth(m.month)}
              </th>
              <td className="px-3 py-2">
                <FlagName name={m.flag} />
              </td>
              <td className="px-3 py-2">{formatBRL(m.pld_trigger_brl_per_mwh)}</td>
              <td className="px-3 py-2">{formatNumber(m.gsf, 2, 2)}</td>
              <td className="px-3 py-2">{formatBRL(m.green_upper_brl_per_mwh)}</td>
              <td className="px-3 py-2">{formatBRL(m.yellow_upper_brl_per_mwh)}</td>
              <td className="px-3 py-2">
                {m.bulletin_url ? (
                  <a
                    className="text-accent underline"
                    href={m.bulletin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    nº {m.bulletin_number}
                  </a>
                ) : (
                  (m.bulletin_number ?? "—")
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export default async function FlagPage() {
  const [rule, months, forecast, scoreboard] = await Promise.all([
    getFlagRule(),
    getFlagMonths("2022-01-01"),
    getFlagForecast(),
    getFlagScoreboard(),
  ]);
  const latest = rule.ok ? rule.data : null;
  const change =
    latest &&
    latest.pld_min_brl_per_mwh !== null &&
    latest.pld_max_brl_per_mwh !== null &&
    latest.gsf !== null &&
    latest.pld_trigger_brl_per_mwh !== null
      ? whatMustChange(
          computeBands(
            latest.pld_min_brl_per_mwh,
            latest.pld_max_brl_per_mwh,
            latest.gsf,
            pickVersion(latest.versions, latest.latest_rule_version),
          ),
          latest.pld_trigger_brl_per_mwh,
        )
      : null;

  return (
    <Container>
      <PageHeader eyebrow="Mercado" title="Bandeira tarifária: como é calculada e o que esperar">
        <p>
          A bandeira não é um palpite: é o resultado de uma regra aplicada a números publicados.
          Aqui você vê a regra, simula com seus números, acompanha o histórico e, quando houver, a
          previsão do próximo mês.
        </p>
      </PageHeader>

      <Section id="agora" title="Bandeira e previsão">
        {forecast.ok ? (
          <>
            <p className="text-ink-2 mb-4 text-sm">
              Última bandeira oficial ({formatLongMonth(forecast.data.latest_official_month)}):{" "}
              <FlagName name={forecast.data.latest_official_flag} />
              {forecast.data.target_month && forecast.data.official_flag ? (
                <>
                  {" "}
                  · oficial de {formatLongMonth(forecast.data.target_month)}:{" "}
                  <FlagName name={forecast.data.official_flag} />
                </>
              ) : null}
            </p>
            <ForecastBlock forecast={forecast.data} />
            <p className="text-muted mt-3 text-xs">{forecast.data.disclaimer}</p>
          </>
        ) : (
          <DataUnavailable />
        )}
      </Section>

      <Section id="calculadora" title="Calculadora: mude os números e veja a cor">
        {latest ? (
          <>
            {change?.up || change?.down ? (
              <p className="text-ink-2 mb-4 text-sm leading-6">
                No último mês da base ({formatLongMonth(latest.latest_month)}):{" "}
                {change.up
                  ? `a bandeira passaria a ${flagLabel(change.up.flag)} se o PLD gatilho fosse acima de R$ ${formatNumber(change.up.triggerAbove, 2, 2)}. `
                  : ""}
                {change.down
                  ? `Voltaria a ${flagLabel(change.down.flag)} com R$ ${formatNumber(change.down.triggerAtOrBelow, 2, 2)} ou menos.`
                  : ""}
              </p>
            ) : null}
            <FlagSimulator rule={latest} />
          </>
        ) : (
          <DataUnavailable />
        )}
      </Section>

      <Section id="como-e-calculada" title="Como é calculada">
        {latest ? (
          <div className="text-ink-2 max-w-3xl space-y-3 text-sm leading-6">
            <p>{latest.formula}</p>
            <p>
              O PLD gatilho é a média mensal dos preços de cada submercado, ponderada pela carga,
              calculada pela CCEE a partir do modelo DECOMP. O GSF é a geração hidrelétrica prevista
              pelo ONS dividida pela garantia física. A ANEEL anuncia a cor no fim do mês anterior.
            </p>
            <p>
              Norma: REH ANEEL 3.306/2024 e REN ANEEL 1.084/2024. Números: boletim InfoBandeira
              Tarifária da CCEE. Os limites de cada versão foram ajustados nas faixas dos boletins e
              estão marcados como a confirmar no Anexo I da REH 3.306/2024.
            </p>
            <p>
              <TextLink href="https://www.ccee.org.br/web/guest/dados-e-analises/dados-bandeira-tarifaria">
                Boletins da CCEE
              </TextLink>
              {" · "}
              <TextLink href="https://www.gov.br/aneel/pt-br/assuntos/tarifas/bandeiras-tarifarias">
                Bandeiras tarifárias na ANEEL
              </TextLink>
            </p>
          </div>
        ) : (
          <DataUnavailable />
        )}
      </Section>

      <Section id="historico" title="Histórico: insumos e resultado, mês a mês">
        {months.ok ? (
          <>
            <History months={months.data.items} />
            <Attribution attribution={months.data.attribution} />
          </>
        ) : (
          <DataUnavailable />
        )}
      </Section>

      <Section id="placar" title="Placar: previsto contra o que a ANEEL anunciou">
        {scoreboard.ok ? (
          <>
            <p className="text-ink-2 mb-3 text-sm">{scoreboard.data.notice}</p>
            {scoreboard.data.summary.length ? (
              <Card className="overflow-x-auto">
                <table className="tabular w-full min-w-[420px] text-sm">
                  <caption className="sr-only">Resumo do placar por prazo</caption>
                  <thead className="bg-surface-2 text-ink-2 text-left">
                    <tr>
                      <th scope="col" className="px-3 py-2.5 font-medium">
                        Prazo
                      </th>
                      <th scope="col" className="px-3 py-2.5 font-medium">
                        Meses
                      </th>
                      <th scope="col" className="px-3 py-2.5 font-medium">
                        Acertou a cor mais provável
                      </th>
                      <th scope="col" className="px-3 py-2.5 font-medium">
                        Erro (Brier)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoreboard.data.summary.map((row) => (
                      <tr key={row.lead_days} className="border-grid border-t">
                        <th scope="row" className="px-3 py-2 text-left font-medium">
                          {row.lead_days} dias antes
                        </th>
                        <td className="px-3 py-2">{row.n}</td>
                        <td className="px-3 py-2">{formatPercent(row.hit_rate * 100, 0)}</td>
                        <td className="px-3 py-2">{formatNumber(row.mean_brier, 3, 3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            ) : null}
          </>
        ) : (
          <DataUnavailable />
        )}
      </Section>

      <Section id="avisos" title="Avisos">
        <ul className="text-ink-2 list-disc space-y-1.5 pl-5 text-sm leading-6">
          <li>{DISCLAIMER}</li>
          <li>
            Não temos as rodadas do DECOMP nem a previsão de geração hidrelétrica do ONS: qualquer
            previsão aqui é uma aproximação, mostrada sempre como probabilidade.
          </li>
          <li>
            Os números da regra vêm dos boletins da CCEE (só fatos numéricos, sem os arquivos) e a
            cor oficial vem da ANEEL (dados abertos, licença ODbL).
          </li>
        </ul>
        {latest ? <Attribution attribution={latest.attribution} /> : null}
      </Section>
    </Container>
  );
}
