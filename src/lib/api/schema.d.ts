export interface paths {
    "/v1/curtailment/subsystems": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["subsystem_curtailment_v1_curtailment_subsystems_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/curtailment/states/{state}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["state_curtailment_v1_curtailment_states__state__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/curtailment/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["summary_v1_curtailment_summary_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/curtailment/hourly": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["hourly_v1_curtailment_hourly_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/plants": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_plants_v1_plants_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/plants/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_plant_v1_plants__slug__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/ranking": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ranking_v1_ranking_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/months": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["months_v1_months_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/rankings/operators": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["operators_v1_rankings_operators_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/rankings/connection-points": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["connection_points_v1_rankings_connection_points_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/reports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_reports_v1_reports_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/reports/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_report_v1_reports__slug__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/reports/{slug}/pdf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_report_pdf_v1_reports__slug__pdf_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/exports/analysis.pdf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["analysis_pdf_file_v1_exports_analysis_pdf_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/exports/analysis.xlsx": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["analysis_xlsx_file_v1_exports_analysis_xlsx_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/exports/analysis-csv.zip": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["analysis_csv_file_v1_exports_analysis_csv_zip_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/forecast": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["forecast_v1_forecast_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/forecast/scopes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["forecast_scopes_v1_forecast_scopes_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/forecast/model": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["forecast_model_v1_forecast_model_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/news/sources": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_sources_v1_news_sources_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/news": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_news_v1_news_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/news/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_news_v1_news__item_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/regulatory-acts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_acts_v1_regulatory_acts_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/regulatory-acts/{act_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_act_v1_regulatory_acts__act_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/system/balance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["system_balance_v1_system_balance_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/system/generation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["system_generation_v1_system_generation_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/plants/{slug}/generation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["plant_generation_v1_plants__slug__generation_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/system/interchange": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["system_interchange_v1_system_interchange_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/system/interchange/hourly": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["system_interchange_hourly_v1_system_interchange_hourly_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/system/thermal-dispatch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["system_thermal_dispatch_v1_system_thermal_dispatch_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/hydro/subsystems": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["hydro_subsystems_v1_hydro_subsystems_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/hydro/reservoirs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["hydro_reservoirs_v1_hydro_reservoirs_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/hydro/reservoirs/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["hydro_reservoir_v1_hydro_reservoirs__slug__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/hydro/spilled-energy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["hydro_spilled_energy_v1_hydro_spilled_energy_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/grid/lines": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["grid_lines_v1_grid_lines_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/grid/substations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["grid_substations_v1_grid_substations_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/geo/states/curtailment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["states_curtailment_v1_geo_states_curtailment_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/geo/reservoirs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["geo_reservoirs_v1_geo_reservoirs_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/market/pld": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["market_pld_v1_market_pld_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/reliability": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["reliability_v1_reliability_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/reliability/{cnpj}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["reliability_detail_v1_reliability__cnpj__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tariffs/flags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["tariff_flags_v1_tariffs_flags_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/market/consumption": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["market_consumption_v1_market_consumption_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/newsletter": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["subscribe_v1_newsletter_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/newsletter/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["confirm_v1_newsletter_confirm_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/newsletter/unsubscribe": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["unsubscribe_v1_newsletter_unsubscribe_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/signup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["signup_v1_auth_signup_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/verify-email": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["verify_email_v1_auth_verify_email_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/resend-verification": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["resend_verification_v1_auth_resend_verification_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["login_v1_auth_login_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["me_v1_auth_me_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/me/newsletter": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["set_newsletter_v1_auth_me_newsletter_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["logout_v1_auth_logout_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/forgot-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["forgot_password_v1_auth_forgot_password_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/reset-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["reset_password_v1_auth_reset_password_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/me/delete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["delete_account_v1_auth_me_delete_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["ingest_v1_events_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/admin/load-runs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_load_runs_v1_admin_load_runs_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/admin/reports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_all_reports_v1_admin_reports_get"];
        put?: never;
        post: operations["upsert_report_v1_admin_reports_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/admin/dispatches": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_dispatches_v1_admin_dispatches_get"];
        put?: never;
        post: operations["start_dispatch_v1_admin_dispatches_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/admin/revalidate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["revalidate_v1_admin_revalidate_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/admin/leads": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_leads_v1_admin_leads_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/admin/usage/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["usage_overview_v1_admin_usage_summary_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/admin/usage/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["usage_events_v1_admin_usage_events_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/admin/usage/events.csv": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["usage_events_csv_v1_admin_usage_events_csv_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/admin/usage/members/{member_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["member_timeline_v1_admin_usage_members__member_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/admin/usage/purge": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["usage_purge_v1_admin_usage_purge_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["health_health_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/admin/news": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["admin_list_news_v1_admin_news_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/admin/news/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["admin_patch_news_v1_admin_news__item_id__patch"];
        trace?: never;
    };
    "/v1/admin/regulatory-acts/{act_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["admin_patch_act_v1_admin_regulatory_acts__act_id__patch"];
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        ActiveLead: {
            member_id: string;
            name: string;
            email: string;
            organization: string | null;
            role: string;
            lead_tier: string;
            lead_score: number;
            events: number;
            last_seen: string | null;
        };
        AdminNewsItem: {
            id: number;
            source: string;
            publisher_name: string;
            license_code: string;
            license_url: string;
            url: string;
            title: string;
            summary: string | null;
            published_at: string;
            source_updated_at: string | null;
            topics: string[];
            has_editor_note: boolean;
            editor_note: string | null;
            editor_note_by: string | null;
            editor_note_at: string | null;
            related_links: components["schemas"]["RelatedLink"][];
            status: "published" | "hidden" | "removed_on_request";
        };
        AdminNewsList: {
            items: components["schemas"]["AdminNewsItem"][];
            next_cursor: string | null;
        };
        AdminReport: {
            month: string;
            title: string;
            slug: string;
            summary: string | null;
            published_at: string | null;
            content: string;
            created_at: string;
            updated_at: string;
        };
        AdminReportListResponse: {
            items: components["schemas"]["AdminReport"][];
        };
        BalancePoint: {
            hour: string;
            hour_utc: string;
            subsystem: "N" | "NE" | "S" | "SE";
            hydro_mw_avg: number | null;
            thermal_mw_avg: number | null;
            wind_mw_avg: number | null;
            solar_mw_avg: number | null;
            load_mw_avg: number | null;
            net_interchange_mw_avg: number | null;
        };
        BalanceResponse: {
            date_from: string;
            date_to: string;
            points: components["schemas"]["BalancePoint"][];
        };
        ConfirmedResponse: {
            confirmed: boolean;
        };
        CountItem: {
            name: string;
            count: number;
        };
        CurtailmentSummary: {
            scope: string;
            source: "wind" | "solar" | "total";
            start: string | null;
            end: string | null;
            months: number;
            verified_generation_mwh: number;
            curtailed_mwh: number;
            curtailed_rel_mwh: number;
            curtailed_cnf_mwh: number;
            curtailed_ene_mwh: number;
            curtailed_other_mwh: number;
            curtailment_pct: number | null;
            estimated_loss_brl: number | null;
            affected_plants: number;
        };
        DailyUsage: {
            day: string;
            page_views: number;
            interactions: number;
            members: number;
        };
        DataSourceInfo: {
            slug: string;
            publisher_name: string;
            dataset_name: string;
            dataset_url: string;
            license_code: string;
            license_url: string;
            license_verified_at: string;
            attribution_text: string;
            update_frequency: string;
        };
        Dispatch: {
            id: number;
            kind: "report" | "analysis";
            month: string;
            status: "running" | "done" | "partial";
            recipients: number;
            sent: number;
            failed: number;
            started_at: string;
            finished_at: string | null;
        };
        DispatchInput: {
            kind: "report" | "analysis";
            month?: string | null;
            retry: boolean;
        };
        DispatchListResponse: {
            items: components["schemas"]["Dispatch"][];
        };
        EmailOnly: {
            email: string;
        };
        EmailVerification: {
            email: string;
            code: string;
        };
        EntityUsage: {
            entity_type: string;
            entity_id: string;
            views: number;
            members: number;
        };
        EventBatch: {
            events: components["schemas"]["EventInput"][];
            visitor_id?: string | null;
            session_key?: string | null;
            user_agent?: string | null;
            referrer?: string | null;
            request_id?: string | null;
        };
        EventInput: {
            category: "page" | "interaction";
            action: string;
            path?: string | null;
            query?: {
                [key: string]: string;
            } | null;
            section?: string | null;
            entity_type?: string | null;
            entity_id?: string | null;
            properties?: {
                [key: string]: unknown;
            };
        };
        EventsAccepted: {
            accepted: number;
        };
        ForecastModelResponse: {
            model_version: string;
            trained_at: string;
            data_period: {
                [key: string]: unknown;
            };
            n_series: number;
            n_rows: number;
            metrics: {
                [key: string]: unknown;
            };
            calibration: {
                [key: string]: unknown;
            };
            feature_importance: {
                [key: string]: unknown;
            };
            model_card: {
                [key: string]: unknown;
            };
            last_run_at: string | null;
            last_data_through: string | null;
        };
        ForecastPoint: {
            ts: string;
            risk_probability: number;
            expected_curtailment_pct: number;
            level: "baixo" | "medio" | "alto";
            applicable: boolean;
        };
        ForecastResponse: {
            scope: string;
            source: "wind" | "solar";
            risk_definition: string;
            origin_ts: string;
            valid_from: string;
            valid_to: string;
            generated_at: string;
            data_through: string;
            stale_days: number;
            model_version: string;
            model_trained_at: string;
            points: components["schemas"]["ForecastPoint"][];
        };
        ForecastScope: {
            scope: string;
            source: "wind" | "solar";
        };
        FunnelStep: {
            step: string;
            count: number;
        };
        GeoMeta: {
            source_name: string;
            source_url: string;
            license: string;
            as_of: string | null;
            updated_at: string | null;
            warnings: string[];
            total: number;
            omitted: number;
        };
        GeoPoint: {
            type: "Point";
            coordinates: [
                number,
                number
            ];
        };
        GeoStateCurtailment: {
            state: string;
            curtailment_pct: number | null;
            curtailed_mwh: number;
            verified_generation_mwh: number;
            estimated_loss_brl: number | null;
            affected_plants: number;
        };
        GeoStatesMeta: {
            source_name: string;
            source_url: string;
            license: string;
            data_source: "wind" | "solar" | "total";
            month: string | null;
            months: string[];
            updated_at: string | null;
            warnings: string[];
            omitted: number;
            omitted_states: string[];
        };
        GeoStatesResponse: {
            meta: components["schemas"]["GeoStatesMeta"];
            items: components["schemas"]["GeoStateCurtailment"][];
        };
        GroupRankingResponse: {
            group: "operator" | "connection_point";
            source: "wind" | "solar" | "total";
            start: string | null;
            end: string | null;
            items: components["schemas"]["RankedGroup"][];
        };
        HTTPValidationError: {
            detail?: components["schemas"]["ValidationError"][];
        };
        HealthResponse: {
            status: string;
            database: string;
        };
        HourlyPoint: {
            day_type: "weekday" | "weekend";
            hour: number;
            avg_curtailed_mwh: number;
            avg_generation_mwh: number;
            curtailment_pct: number | null;
        };
        HourlyProfileResponse: {
            scope: string;
            source: "wind" | "solar" | "total";
            start: string | null;
            end: string | null;
            months: number;
            points: components["schemas"]["HourlyPoint"][];
        };
        InterchangeHourlyPoint: {
            hour: string;
            hour_utc: string;
            origin: string;
            destination: string;
            scope: "national" | "international";
            flow_mw_avg: number | null;
            scheduled_mw_avg: number | null;
        };
        InterchangeHourlyResponse: {
            date_from: string;
            date_to: string;
            points: components["schemas"]["InterchangeHourlyPoint"][];
        };
        InterchangeMonthlyPoint: {
            month: string;
            origin: string;
            destination: string;
            scope: "national" | "international";
            energy_mwh: number;
            scheduled_energy_mwh: number | null;
            avg_mw: number;
            peak_mw: number;
            min_mw: number;
        };
        InterchangeMonthlyResponse: {
            points: components["schemas"]["InterchangeMonthlyPoint"][];
        };
        Lead: {
            id: string;
            email: string;
            name: string;
            role: "researcher" | "student" | "professional" | "journalist" | "public_sector" | "investor" | "other";
            organization: string | null;
            job_title: string | null;
            segment: string | null;
            institution: string | null;
            regions: string[];
            plants: string[];
            interests: string[];
            marketing_opt_in: boolean;
            created_at: string;
            company_size: string | null;
            study_level: string | null;
            phone: string | null;
            referral: string | null;
            signup_source: string | null;
            email_verified_at: string | null;
            lead_score: number;
            lead_tier: "hot" | "warm" | "cold";
            last_login_at: string | null;
        };
        LeadListResponse: {
            items: components["schemas"]["Lead"][];
            total: number;
        };
        LoadRun: {
            id: number;
            dataset: string;
            period: string | null;
            source_file: string | null;
            checksum: string | null;
            row_count: number | null;
            started_at: string;
            finished_at: string | null;
            status: "running" | "success" | "failed";
            detail: string | null;
        };
        LoadRunListResponse: {
            items: components["schemas"]["LoadRun"][];
        };
        LoginResponse: {
            session_token: string;
            expires_at: string;
            member: components["schemas"]["MemberProfile"];
        };
        MarketAgentsPoint: {
            month: string;
            agent_class: string;
            agents: number;
        };
        MarketConsumptionPoint: {
            month: string;
            regulated_mw_avg: number;
            free_mw_avg: number;
            free_share_pct: number;
        };
        MarketConsumptionResponse: {
            source: components["schemas"]["DataSourceInfo"];
            consumption: components["schemas"]["MarketConsumptionPoint"][];
            agents: components["schemas"]["MarketAgentsPoint"][];
        };
        MemberLogin: {
            email: string;
            password: string;
        };
        MemberProfile: {
            id: string;
            email: string;
            name: string;
            role: "researcher" | "student" | "professional" | "journalist" | "public_sector" | "investor" | "other";
            organization: string | null;
            job_title: string | null;
            segment: string | null;
            institution: string | null;
            regions: string[];
            plants: string[];
            interests: string[];
            marketing_opt_in: boolean;
            created_at: string;
        };
        MemberSignup: {
            email: string;
            password: string;
            name: string;
            role: "researcher" | "student" | "professional" | "journalist" | "public_sector" | "investor" | "other";
            organization?: string | null;
            job_title?: string | null;
            segment?: ("generator" | "storage_developer" | "trader" | "consultancy" | "financial" | "consumer" | "utility" | "equipment" | "law_regulatory" | "other") | null;
            company_size?: ("1-10" | "11-50" | "51-200" | "201-1000" | "1000+") | null;
            institution?: string | null;
            study_level?: ("undergraduate" | "master" | "phd" | "postdoc" | "other") | null;
            regions?: ("Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul")[];
            plants?: string[];
            interests?: ("monitor_losses" | "compensation" | "storage" | "free_market" | "investment" | "data_api" | "research" | "press")[];
            phone?: string | null;
            referral?: string | null;
            marketing_opt_in: boolean;
            consent: true;
            source?: string | null;
        };
        MemberTimeline: {
            member: components["schemas"]["Lead"];
            events: components["schemas"]["UsageEventOut"][];
            total: number;
        };
        MessageResponse: {
            message: string;
        };
        MonthlyGenerationPoint: {
            month: string;
            subsystem: "N" | "NE" | "S" | "SE" | "SIN";
            source: "hydro" | "thermal" | "wind" | "solar";
            energy_mwh: number;
            avg_mw: number;
            peak_mw: number;
            share_pct: number | null;
        };
        MonthlyGenerationResponse: {
            points: components["schemas"]["MonthlyGenerationPoint"][];
        };
        MonthsResponse: {
            months: string[];
        };
        NewsItem: {
            id: number;
            source: string;
            publisher_name: string;
            license_code: string;
            license_url: string;
            url: string;
            title: string;
            summary: string | null;
            published_at: string;
            source_updated_at: string | null;
            topics: string[];
            has_editor_note: boolean;
        };
        NewsItemDetail: {
            id: number;
            source: string;
            publisher_name: string;
            license_code: string;
            license_url: string;
            url: string;
            title: string;
            summary: string | null;
            published_at: string;
            source_updated_at: string | null;
            topics: string[];
            has_editor_note: boolean;
            editor_note: string | null;
            editor_note_by: string | null;
            editor_note_at: string | null;
            related_links: components["schemas"]["RelatedLink"][];
        };
        NewsListResponse: {
            items: components["schemas"]["NewsItem"][];
            next_cursor: string | null;
        };
        NewsPatch: {
            status?: ("published" | "hidden" | "removed_on_request") | null;
            editor_note?: string | null;
            clear_editor_note: boolean;
            related_links?: components["schemas"]["RelatedLink"][] | null;
        };
        NewsSource: {
            slug: string;
            publisher_name: string;
            homepage_url: string;
            fetch_method: string;
            license_code: string;
            license_url: string;
            license_verified_at: string | null;
            license_evidence_url: string | null;
            active: boolean;
        };
        NewsSourceListResponse: {
            items: components["schemas"]["NewsSource"][];
        };
        NewsletterPreference: {
            enabled: boolean;
        };
        NewsletterSignup: {
            email: string;
            consent: true;
            source?: string | null;
        };
        PasswordConfirmation: {
            password: string;
        };
        PasswordReset: {
            email: string;
            code: string;
            password: string;
        };
        Plant: {
            id: string;
            kind: "plant" | "cluster";
            name: string;
            slug: string;
            source: "wind" | "solar";
            state: string;
            subsystem: string;
            capacity_mw: number | null;
            cluster_id: string | null;
            ceg: string | null;
            connection_point: string | null;
            operator: string | null;
            updated_at: string;
        };
        PlantCurtailment: {
            plant_id: string;
            month: string;
            verified_generation_mwh: number;
            curtailed_mwh: number;
            curtailment_pct: number | null;
            curtailed_rel_mwh: number;
            curtailed_cnf_mwh: number;
            curtailed_ene_mwh: number;
            curtailed_other_mwh: number;
            estimated_loss_brl: number | null;
            price_basis: string | null;
            restricted_hours: number;
            state_avg_curtailment_pct: number | null;
            national_rank: number | null;
            state_rank: number | null;
            updated_at: string;
        };
        PlantDetailResponse: {
            plant: components["schemas"]["Plant"];
            cluster: components["schemas"]["PlantSummary"] | null;
            cluster_plants: components["schemas"]["PlantSummary"][];
            series: components["schemas"]["PlantCurtailment"][];
        };
        PlantGenerationPoint: {
            month: string;
            energy_mwh: number;
            avg_mw: number;
            peak_mw: number;
            capacity_factor: number | null;
        };
        PlantGenerationResponse: {
            plant: components["schemas"]["PowerPlantInfo"];
            points: components["schemas"]["PlantGenerationPoint"][];
        };
        PlantListResponse: {
            items: components["schemas"]["PlantSummary"][];
            total: number;
            page: number;
            page_size: number;
        };
        PlantSummary: {
            id: string;
            kind: "plant" | "cluster";
            name: string;
            slug: string;
            source: "wind" | "solar";
            state: string;
            subsystem: string;
            capacity_mw: number | null;
        };
        PldPoint: {
            period: string;
            subsystem: "N" | "NE" | "S" | "SE";
            pld_avg_brl_per_mwh: number;
            pld_min_brl_per_mwh?: number | null;
            pld_max_brl_per_mwh?: number | null;
            pld_std_brl_per_mwh?: number | null;
            hours_at_floor?: number | null;
            hours_at_cap?: number | null;
            hours?: number | null;
        };
        PldResponse: {
            granularity: "hourly" | "daily" | "weekly" | "monthly";
            variant: "official" | "shadow";
            date_from: string;
            date_to: string;
            source: components["schemas"]["DataSourceInfo"];
            points: components["schemas"]["PldPoint"][];
        };
        PowerPlantInfo: {
            id: string;
            name: string;
            slug: string;
            source_type: string;
            fuel_type: string | null;
            state: string | null;
            subsystem: string | null;
            capacity_mw: number | null;
        };
        PurgeResponse: {
            deleted: number;
            older_than_days: number;
        };
        RankedGroup: {
            rank: number;
            name: string;
            state: string | null;
            plants: number;
            affected_plants: number;
            verified_generation_mwh: number;
            curtailed_mwh: number;
            curtailment_pct: number | null;
            estimated_loss_brl: number | null;
            compensable_mwh: number;
        };
        RankedPlant: {
            id: string;
            kind: "plant" | "cluster";
            name: string;
            slug: string;
            source: "wind" | "solar";
            state: string;
            subsystem: string;
            capacity_mw: number | null;
            rank: number;
            curtailed_mwh: number;
            curtailment_pct: number | null;
            estimated_loss_brl: number | null;
        };
        RankingResponse: {
            month: string | null;
            items: components["schemas"]["RankedPlant"][];
        };
        RegulatoryAct: {
            id: number;
            organ: string;
            act_type: string;
            act_number: string | null;
            act_date: string | null;
            title: string;
            summary: string | null;
            dou_date: string;
            dou_section: number | null;
            dou_edition: string | null;
            dou_page: string | null;
            dou_url: string;
            topics: string[];
        };
        RegulatoryActDetail: {
            id: number;
            organ: string;
            act_type: string;
            act_number: string | null;
            act_date: string | null;
            title: string;
            summary: string | null;
            dou_date: string;
            dou_section: number | null;
            dou_edition: string | null;
            dou_page: string | null;
            dou_url: string;
            topics: string[];
            body: string | null;
        };
        RegulatoryActListResponse: {
            items: components["schemas"]["RegulatoryAct"][];
            next_cursor: string | null;
        };
        RegulatoryActPatch: {
            status: "published" | "hidden" | "removed_on_request";
        };
        RelatedLink: {
            label: string;
            href: string;
        };
        ReliabilityDetailResponse: {
            year: number;
            years: number[];
            distributor: components["schemas"]["ReliabilityDistributor"];
            source: components["schemas"]["DataSourceInfo"];
            points: components["schemas"]["ReliabilityMonthPoint"][];
        };
        ReliabilityDistributor: {
            cnpj: string;
            acronym: string;
            consumers: number;
            dec_hours: number;
            fec_count: number;
            dec_limit_hours: number | null;
            fec_limit_count: number | null;
            months_with_data: number;
            sets: number;
        };
        ReliabilityMonthPoint: {
            month: string;
            consumers: number;
            dec_hours: number;
            fec_count: number;
        };
        ReliabilityResponse: {
            year: number;
            years: number[];
            months_with_data: number;
            source: components["schemas"]["DataSourceInfo"];
            items: components["schemas"]["ReliabilityDistributor"][];
        };
        Report: {
            month: string;
            title: string;
            slug: string;
            summary: string | null;
            published_at: string | null;
            content: string;
        };
        ReportInput: {
            month: string;
            title: string;
            slug?: string | null;
            summary?: string | null;
            content: string;
            publish: boolean;
        };
        ReportListResponse: {
            items: components["schemas"]["ReportSummary"][];
        };
        ReportSummary: {
            month: string;
            title: string;
            slug: string;
            summary: string | null;
            published_at: string | null;
        };
        ReservoirCollection: {
            type: "FeatureCollection";
            meta: components["schemas"]["GeoMeta"];
            features: components["schemas"]["ReservoirFeature"][];
        };
        ReservoirDailyPoint: {
            day: string;
            storage_mw_month: number | null;
            storage_max_mw_month: number | null;
            storage_pct: number | null;
            useful_volume_pct: number | null;
            ena_gross_mw_avg: number | null;
            ena_gross_pct_mlt: number | null;
            ena_storable_mw_avg: number | null;
            ena_storable_pct_mlt: number | null;
            inflow_m3s: number | null;
            natural_inflow_m3s: number | null;
            outflow_m3s: number | null;
            turbined_m3s: number | null;
            spilled_m3s: number | null;
            upstream_level_m: number | null;
            downstream_level_m: number | null;
        };
        ReservoirDetailResponse: {
            date_from: string;
            date_to: string;
            reservoir: components["schemas"]["ReservoirInfo"];
            points: components["schemas"]["ReservoirDailyPoint"][];
        };
        ReservoirFeature: {
            type: "Feature";
            geometry: components["schemas"]["GeoPoint"];
            properties: components["schemas"]["ReservoirProperties"];
        };
        ReservoirInfo: {
            id: string;
            name: string;
            slug: string;
            reservoir_type: string | null;
            plant_name: string | null;
            ceg: string | null;
            subsystem: string | null;
            ree: string | null;
            basin: string | null;
            river: string | null;
            commissioned_on: string | null;
            useful_volume_hm3: number | null;
            max_level_m: number | null;
            min_level_m: number | null;
            latitude: number | null;
            longitude: number | null;
        };
        ReservoirListResponse: {
            latest_day: string | null;
            items: components["schemas"]["ReservoirSummary"][];
        };
        ReservoirProperties: {
            slug: string;
            name: string;
            plant_name: string | null;
            subsystem: string | null;
            basin: string | null;
            river: string | null;
            useful_volume_hm3: number | null;
            storage_pct: number | null;
            ena_storable_pct_mlt: number | null;
            day: string | null;
        };
        ReservoirSummary: {
            id: string;
            name: string;
            slug: string;
            reservoir_type: string | null;
            plant_name: string | null;
            ceg: string | null;
            subsystem: string | null;
            ree: string | null;
            basin: string | null;
            river: string | null;
            commissioned_on: string | null;
            useful_volume_hm3: number | null;
            max_level_m: number | null;
            min_level_m: number | null;
            latitude: number | null;
            longitude: number | null;
            latest_day: string | null;
            storage_pct: number | null;
            ena_storable_pct_mlt: number | null;
        };
        RevalidateInput: {
            tags?: ("curtailment" | "plants" | "reports" | "forecast" | "news" | "market" | "reliability")[];
        };
        RevalidateResponse: {
            tags: ("curtailment" | "plants" | "reports" | "forecast" | "news" | "market" | "reliability")[];
            cache_cleared: boolean;
            entries_removed: number;
            web_revalidated: boolean;
            detail: string | null;
        };
        RoleUsage: {
            role: string | null;
            segment: string | null;
            members: number;
            events: number;
        };
        SectionUsage: {
            section: string;
            views: number;
            members: number;
        };
        SignupResponse: {
            message: string;
            dev_code?: string | null;
        };
        SpilledEnergyPoint: {
            month: string;
            plant_code: string;
            plant_name: string;
            subsystem: string | null;
            basin: string | null;
            river: string | null;
            agent: string | null;
            spilled_energy_mwh: number;
            spilled_turbinable_energy_mwh: number;
        };
        SpilledEnergyResponse: {
            points: components["schemas"]["SpilledEnergyPoint"][];
        };
        StateCurtailment: {
            source: "wind" | "solar" | "total";
            month: string;
            verified_generation_mwh: number;
            curtailed_mwh: number;
            curtailment_pct: number | null;
            curtailed_rel_mwh: number;
            curtailed_cnf_mwh: number;
            curtailed_ene_mwh: number;
            curtailed_other_mwh: number;
            estimated_loss_brl: number | null;
            affected_plants: number;
            updated_at: string;
            state: string;
        };
        StateCurtailmentResponse: {
            series: components["schemas"]["StateCurtailment"][];
            ranking: components["schemas"]["RankedPlant"][];
            ranking_month: string | null;
        };
        SubstationItem: {
            valid_from: string;
            valid_to: string | null;
            station_id: string;
            substation_id: string | null;
            name: string | null;
            voltage_kv: number | null;
            subsystem: string | null;
            state: string | null;
            main_agent: string | null;
            bus_number: number | null;
            latitude: number | null;
            longitude: number | null;
        };
        SubstationListResponse: {
            as_of: string | null;
            total: number;
            page: number;
            page_size: number;
            items: components["schemas"]["SubstationItem"][];
        };
        SubsystemCurtailment: {
            source: "wind" | "solar" | "total";
            month: string;
            verified_generation_mwh: number;
            curtailed_mwh: number;
            curtailment_pct: number | null;
            curtailed_rel_mwh: number;
            curtailed_cnf_mwh: number;
            curtailed_ene_mwh: number;
            curtailed_other_mwh: number;
            estimated_loss_brl: number | null;
            affected_plants: number;
            updated_at: string;
            subsystem: string;
        };
        SubsystemCurtailmentResponse: {
            items: components["schemas"]["SubsystemCurtailment"][];
        };
        SubsystemStoragePoint: {
            day: string;
            subsystem: "N" | "NE" | "S" | "SE";
            storage_max_mw_month: number | null;
            storage_mw_month: number | null;
            storage_pct: number | null;
            ena_gross_mw_avg: number | null;
            ena_gross_pct_mlt: number | null;
            ena_storable_mw_avg: number | null;
            ena_storable_pct_mlt: number | null;
        };
        SubsystemStorageResponse: {
            date_from: string;
            date_to: string;
            points: components["schemas"]["SubsystemStoragePoint"][];
        };
        TariffFlagPoint: {
            month: string;
            flag: string;
            additional_brl_per_mwh: number;
        };
        TariffFlagsResponse: {
            source: components["schemas"]["DataSourceInfo"];
            items: components["schemas"]["TariffFlagPoint"][];
        };
        ThermalDispatchPoint: {
            month: string;
            reason: string;
            subsystem: string;
            plant_code: string | null;
            plant_name: string | null;
            plants: number;
            verified_mwh: number;
            programmed_mwh: number | null;
        };
        ThermalDispatchResponse: {
            points: components["schemas"]["ThermalDispatchPoint"][];
        };
        TransmissionLineItem: {
            valid_from: string;
            valid_to: string | null;
            equipment_code: string;
            name: string | null;
            voltage_kv: number | null;
            line_type: string | null;
            network_type: string | null;
            owner_agent: string | null;
            from_substation: string | null;
            to_substation: string | null;
            from_subsystem: string | null;
            to_subsystem: string | null;
            from_state: string | null;
            to_state: string | null;
            length_km: number | null;
            capacity_long_no_limit_a: number | null;
            capacity_long_with_limit_a: number | null;
            capacity_short_no_limit_a: number | null;
            capacity_short_with_limit_a: number | null;
            positive_seq_resistance: number | null;
            positive_seq_reactance: number | null;
            positive_seq_shunt: number | null;
            commissioned_on: string | null;
            decommissioned_on: string | null;
            planned_on: string | null;
        };
        TransmissionLineListResponse: {
            as_of: string | null;
            total: number;
            page: number;
            page_size: number;
            items: components["schemas"]["TransmissionLineItem"][];
        };
        UnsubscribedResponse: {
            unsubscribed: boolean;
        };
        UsageEventList: {
            items: components["schemas"]["UsageEventOut"][];
            total: number;
        };
        UsageEventOut: {
            id: number;
            occurred_at: string;
            category: string;
            action: string;
            section: string | null;
            entity_type: string | null;
            entity_id: string | null;
            path: string | null;
            properties: {
                [key: string]: unknown;
            };
            member_id: string | null;
            member_role: string | null;
            member_segment: string | null;
            visitor_id: string | null;
            session_key: string | null;
            device: string | null;
            is_bot: boolean;
            referrer: string | null;
            request_id: string | null;
        };
        UsageSummary: {
            start: string;
            end: string;
            days: number;
            include_bots: boolean;
            totals: components["schemas"]["UsageTotals"];
            daily: components["schemas"]["DailyUsage"][];
            sections: components["schemas"]["SectionUsage"][];
            entities: components["schemas"]["EntityUsage"][];
            searches: components["schemas"]["CountItem"][];
            interactions: components["schemas"]["CountItem"][];
            compared: components["schemas"]["CountItem"][];
            funnel: components["schemas"]["FunnelStep"][];
            roles: components["schemas"]["RoleUsage"][];
            active_leads: components["schemas"]["ActiveLead"][];
        };
        UsageTotals: {
            events: number;
            page_views: number;
            members_active: number;
            visitors: number;
            sessions: number;
            new_members: number;
        };
        ValidationError: {
            loc: (string | number)[];
            msg: string;
            type: string;
            input?: unknown;
            ctx?: Record<string, never>;
        };
        VerifiedResponse: {
            verified: boolean;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    subsystem_curtailment_v1_curtailment_subsystems_get: {
        parameters: {
            query?: {
                source?: "wind" | "solar" | "total";
                start?: string | null;
                end?: string | null;
                subsystem?: ("N" | "NE" | "S" | "SE" | "SIN") | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubsystemCurtailmentResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    state_curtailment_v1_curtailment_states__state__get: {
        parameters: {
            query?: {
                source?: "wind" | "solar" | "total";
                month?: string | null;
            };
            header?: never;
            path: {
                state: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StateCurtailmentResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    summary_v1_curtailment_summary_get: {
        parameters: {
            query?: {
                scope?: string;
                source?: "wind" | "solar" | "total";
                start?: string | null;
                end?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CurtailmentSummary"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    hourly_v1_curtailment_hourly_get: {
        parameters: {
            query?: {
                scope?: "N" | "NE" | "S" | "SE" | "SIN";
                source?: "wind" | "solar" | "total";
                start?: string | null;
                end?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HourlyProfileResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_plants_v1_plants_get: {
        parameters: {
            query?: {
                search?: string | null;
                state?: string | null;
                source?: ("wind" | "solar") | null;
                kind?: ("plant" | "cluster") | null;
                page?: number;
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlantListResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_plant_v1_plants__slug__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlantDetailResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    ranking_v1_ranking_get: {
        parameters: {
            query?: {
                month?: string | null;
                state?: string | null;
                source?: "wind" | "solar" | "total";
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RankingResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    months_v1_months_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MonthsResponse"];
                };
            };
        };
    };
    operators_v1_rankings_operators_get: {
        parameters: {
            query?: {
                source?: "wind" | "solar" | "total";
                start?: string | null;
                end?: string | null;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GroupRankingResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    connection_points_v1_rankings_connection_points_get: {
        parameters: {
            query?: {
                source?: "wind" | "solar" | "total";
                start?: string | null;
                end?: string | null;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GroupRankingResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_reports_v1_reports_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReportListResponse"];
                };
            };
        };
    };
    get_report_v1_reports__slug__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Report"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_report_pdf_v1_reports__slug__pdf_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    analysis_pdf_file_v1_exports_analysis_pdf_get: {
        parameters: {
            query?: {
                scope?: "N" | "NE" | "S" | "SE" | "SIN";
                source?: "wind" | "solar" | "total";
                start?: string | null;
                end?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    analysis_xlsx_file_v1_exports_analysis_xlsx_get: {
        parameters: {
            query?: {
                scope?: "N" | "NE" | "S" | "SE" | "SIN";
                source?: "wind" | "solar" | "total";
                start?: string | null;
                end?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    analysis_csv_file_v1_exports_analysis_csv_zip_get: {
        parameters: {
            query?: {
                scope?: "N" | "NE" | "S" | "SE" | "SIN";
                source?: "wind" | "solar" | "total";
                start?: string | null;
                end?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    forecast_v1_forecast_get: {
        parameters: {
            query: {
                scope: string;
                source?: "wind" | "solar";
                days?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForecastResponse"];
                };
            };
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    forecast_scopes_v1_forecast_scopes_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForecastScope"][];
                };
            };
        };
    };
    forecast_model_v1_forecast_model_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForecastModelResponse"];
                };
            };
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    list_sources_v1_news_sources_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NewsSourceListResponse"];
                };
            };
        };
    };
    list_news_v1_news_get: {
        parameters: {
            query?: {
                topic?: string | null;
                source?: string | null;
                q?: string | null;
                cursor?: string | null;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NewsListResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_news_v1_news__item_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                item_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NewsItemDetail"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_acts_v1_regulatory_acts_get: {
        parameters: {
            query?: {
                organ?: string | null;
                type?: string | null;
                topic?: string | null;
                cursor?: string | null;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RegulatoryActListResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_act_v1_regulatory_acts__act_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                act_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RegulatoryActDetail"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    system_balance_v1_system_balance_get: {
        parameters: {
            query?: {
                subsystem?: ("N" | "NE" | "S" | "SE") | null;
                from?: string | null;
                to?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BalanceResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    system_generation_v1_system_generation_get: {
        parameters: {
            query?: {
                subsystem?: "N" | "NE" | "S" | "SE" | "SIN";
                from?: string | null;
                to?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MonthlyGenerationResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    plant_generation_v1_plants__slug__generation_get: {
        parameters: {
            query?: {
                from?: string | null;
                to?: string | null;
            };
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlantGenerationResponse"];
                };
            };
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    system_interchange_v1_system_interchange_get: {
        parameters: {
            query?: {
                origin?: string | null;
                destination?: string | null;
                scope?: ("national" | "international") | null;
                from?: string | null;
                to?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterchangeMonthlyResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    system_interchange_hourly_v1_system_interchange_hourly_get: {
        parameters: {
            query?: {
                origin?: string | null;
                destination?: string | null;
                from?: string | null;
                to?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterchangeHourlyResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    system_thermal_dispatch_v1_system_thermal_dispatch_get: {
        parameters: {
            query?: {
                subsystem?: ("N" | "NE" | "S" | "SE") | null;
                reason?: string | null;
                plant?: string | null;
                from?: string | null;
                to?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ThermalDispatchResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    hydro_subsystems_v1_hydro_subsystems_get: {
        parameters: {
            query?: {
                subsystem?: ("N" | "NE" | "S" | "SE") | null;
                from?: string | null;
                to?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubsystemStorageResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    hydro_reservoirs_v1_hydro_reservoirs_get: {
        parameters: {
            query?: {
                subsystem?: ("N" | "NE" | "S" | "SE") | null;
                basin?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReservoirListResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    hydro_reservoir_v1_hydro_reservoirs__slug__get: {
        parameters: {
            query?: {
                from?: string | null;
                to?: string | null;
            };
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReservoirDetailResponse"];
                };
            };
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    hydro_spilled_energy_v1_hydro_spilled_energy_get: {
        parameters: {
            query?: {
                subsystem?: ("N" | "NE" | "S" | "SE") | null;
                plant?: string | null;
                month?: string | null;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SpilledEnergyResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    grid_lines_v1_grid_lines_get: {
        parameters: {
            query?: {
                voltage_kv?: number | null;
                min_voltage_kv?: number | null;
                state?: string | null;
                subsystem?: ("N" | "NE" | "S" | "SE") | null;
                as_of?: string | null;
                page?: number;
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransmissionLineListResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    grid_substations_v1_grid_substations_get: {
        parameters: {
            query?: {
                voltage_kv?: number | null;
                min_voltage_kv?: number | null;
                state?: string | null;
                subsystem?: ("N" | "NE" | "S" | "SE") | null;
                as_of?: string | null;
                page?: number;
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubstationListResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    states_curtailment_v1_geo_states_curtailment_get: {
        parameters: {
            query?: {
                source?: "wind" | "solar" | "total";
                month?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GeoStatesResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    geo_reservoirs_v1_geo_reservoirs_get: {
        parameters: {
            query?: {
                date?: string | null;
                subsystem?: ("N" | "NE" | "S" | "SE") | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReservoirCollection"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    market_pld_v1_market_pld_get: {
        parameters: {
            query?: {
                granularity?: "hourly" | "daily" | "weekly" | "monthly";
                subsystem?: ("N" | "NE" | "S" | "SE") | null;
                variant?: "official" | "shadow";
                from?: string | null;
                to?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PldResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    reliability_v1_reliability_get: {
        parameters: {
            query?: {
                year?: number | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReliabilityResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    reliability_detail_v1_reliability__cnpj__get: {
        parameters: {
            query?: {
                year?: number | null;
            };
            header?: never;
            path: {
                cnpj: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReliabilityDetailResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    tariff_flags_v1_tariffs_flags_get: {
        parameters: {
            query?: {
                from?: string | null;
                to?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TariffFlagsResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    market_consumption_v1_market_consumption_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MarketConsumptionResponse"];
                };
            };
        };
    };
    subscribe_v1_newsletter_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NewsletterSignup"];
            };
        };
        responses: {
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    confirm_v1_newsletter_confirm_get: {
        parameters: {
            query: {
                token: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConfirmedResponse"];
                };
            };
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    unsubscribe_v1_newsletter_unsubscribe_get: {
        parameters: {
            query: {
                token: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UnsubscribedResponse"];
                };
            };
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    signup_v1_auth_signup_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MemberSignup"];
            };
        };
        responses: {
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SignupResponse"];
                };
            };
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    verify_email_v1_auth_verify_email_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EmailVerification"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VerifiedResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    resend_verification_v1_auth_resend_verification_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EmailOnly"];
            };
        };
        responses: {
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SignupResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    login_v1_auth_login_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MemberLogin"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponse"];
                };
            };
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    me_v1_auth_me_get: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemberProfile"];
                };
            };
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    set_newsletter_v1_auth_me_newsletter_put: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NewsletterPreference"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemberProfile"];
                };
            };
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    logout_v1_auth_logout_post: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    forgot_password_v1_auth_forgot_password_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EmailOnly"];
            };
        };
        responses: {
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SignupResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    reset_password_v1_auth_reset_password_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PasswordReset"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_account_v1_auth_me_delete_post: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PasswordConfirmation"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    ingest_v1_events_post: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EventBatch"];
            };
        };
        responses: {
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventsAccepted"];
                };
            };
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_load_runs_v1_admin_load_runs_get: {
        parameters: {
            query?: {
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoadRunListResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_all_reports_v1_admin_reports_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminReportListResponse"];
                };
            };
        };
    };
    upsert_report_v1_admin_reports_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReportInput"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminReport"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_dispatches_v1_admin_dispatches_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DispatchListResponse"];
                };
            };
        };
    };
    start_dispatch_v1_admin_dispatches_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DispatchInput"];
            };
        };
        responses: {
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Dispatch"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    revalidate_v1_admin_revalidate_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RevalidateInput"] | null;
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RevalidateResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_leads_v1_admin_leads_get: {
        parameters: {
            query?: {
                tier?: ("hot" | "warm" | "cold") | null;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LeadListResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    usage_overview_v1_admin_usage_summary_get: {
        parameters: {
            query?: {
                days?: number;
                include_bots?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UsageSummary"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    usage_events_v1_admin_usage_events_get: {
        parameters: {
            query?: {
                days?: number;
                action?: string | null;
                section?: string | null;
                member_id?: string | null;
                include_bots?: boolean;
                limit?: number;
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UsageEventList"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    usage_events_csv_v1_admin_usage_events_csv_get: {
        parameters: {
            query?: {
                days?: number;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    member_timeline_v1_admin_usage_members__member_id__get: {
        parameters: {
            query?: {
                limit?: number;
            };
            header?: never;
            path: {
                member_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemberTimeline"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    usage_purge_v1_admin_usage_purge_post: {
        parameters: {
            query?: {
                days?: number | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PurgeResponse"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    health_health_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthResponse"];
                };
            };
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthResponse"];
                };
            };
        };
    };
    admin_list_news_v1_admin_news_get: {
        parameters: {
            query?: {
                status?: ("published" | "hidden" | "removed_on_request") | null;
                topic?: string | null;
                source?: string | null;
                q?: string | null;
                cursor?: string | null;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminNewsList"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    admin_patch_news_v1_admin_news__item_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                item_id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NewsPatch"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminNewsItem"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    admin_patch_act_v1_admin_regulatory_acts__act_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                act_id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegulatoryActPatch"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RegulatoryAct"];
                };
            };
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
}
