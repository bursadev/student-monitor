import { getClerkUser } from '@/shared/lib/auth/permissions';

export default async function PanelPage() {
  const user = await getClerkUser();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold">
        Hoş geldin{user?.firstName ? `, ${user.firstName}` : ''}
      </h1>
      <p className="text-sm text-black/60 dark:text-white/60">
        Giriş yaptın. Rol seçimi ve panel içeriği sonraki adımda gelecek.
      </p>
    </div>
  );
}
