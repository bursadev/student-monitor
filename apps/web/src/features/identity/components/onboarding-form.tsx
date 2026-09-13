'use client';

import { useActionState } from 'react';

import { type OnboardingState, submitOnboarding } from '../lib/onboarding-action';

const ROLES = [
  {
    value: 'COACH',
    label: 'Koç',
    hint: 'Öğrenci takip ederim, görev ve ödev veririm.',
  },
  {
    value: 'STUDENT',
    label: 'Öğrenci',
    hint: 'Koçumla çalışırım, görevlerimi buradan takip ederim.',
  },
  {
    value: 'PARENT',
    label: 'Veli',
    hint: 'Çocuğumun gelişimini takip ederim.',
  },
] as const;

const INITIAL: OnboardingState = { error: null };

export function OnboardingForm({ defaultName }: { defaultName?: string }) {
  const [state, action, isPending] = useActionState(submitOnboarding, INITIAL);

  return (
    <form action={action} className="flex w-full max-w-md flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-medium">Seni nasıl tanıyalım?</legend>

        {ROLES.map((role, index) => (
          <label
            key={role.value}
            className="flex cursor-pointer gap-3 rounded-xl border border-black/10 p-4 transition-colors hover:border-black/30 has-[:checked]:border-black has-[:checked]:bg-black/[0.03] dark:border-white/15 dark:hover:border-white/40 dark:has-[:checked]:border-white dark:has-[:checked]:bg-white/[0.06]"
          >
            <input
              type="radio"
              name="role"
              value={role.value}
              defaultChecked={index === 0}
              className="mt-1"
            />
            <span className="flex flex-col gap-0.5">
              <span className="font-medium">{role.label}</span>
              <span className="text-sm text-black/60 dark:text-white/60">{role.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Ad soyad</span>
        <input
          name="displayName"
          defaultValue={defaultName ?? ''}
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          className="rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-black dark:border-white/20 dark:focus:border-white"
        />
      </label>

      {/* Rol sonradan değiştirilemez (ADR-0014), so say so before they commit. */}
      <p className="text-sm text-black/50 dark:text-white/50">
        Rolünü daha sonra değiştiremezsin.
      </p>

      {state.error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-black px-4 py-2.5 font-medium text-white disabled:opacity-60 dark:bg-white dark:text-black"
      >
        {isPending ? 'Kaydediliyor…' : 'Devam et'}
      </button>
    </form>
  );
}
