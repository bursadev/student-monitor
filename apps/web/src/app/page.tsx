import { LocaleSwitcher } from "@/shared/components/ui/LocaleSwitcher";
import { getTranslation } from "@/shared/lib/i18n/server";

export default async function Home() {
  const { t, locale } = await getTranslation();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">{t("appName")}</h1>
      <p className="text-sm text-black/60 dark:text-white/60">{t("appDescription")}</p>

      {/* Plurals differ by language: Turkish does not pluralise after a number. */}
      <p className="text-sm">
        {t("taskCount", { count: 1 })} · {t("taskCount", { count: 5 })}
      </p>

      <LocaleSwitcher />

      <p className="text-xs text-black/40 dark:text-white/40">{locale}</p>
    </main>
  );
}
