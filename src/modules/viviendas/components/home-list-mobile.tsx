type HomeItem = {
  id: string;
  homeNumber: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
  regulationSigned: boolean;
};

type HomeListMobileProps = {
  homes: HomeItem[];
};

export function HomeListMobile({ homes }: HomeListMobileProps) {
  return (
    <div className="space-y-3 md:hidden">
      {homes.map((home) => (
        <article key={home.id} className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Casa {home.homeNumber}</h3>
            <span className="text-xs text-muted-foreground">
              {home.contactPhone ?? "Sin teléfono"}
            </span>
          </div>
          <p className="mt-2 text-sm">
            Reglamento:{" "}
            <span className="font-medium">
              {home.regulationSigned ? "Firmado" : "Pendiente"}
            </span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {home.contactEmail ?? "Sin email"}
          </p>
        </article>
      ))}
    </div>
  );
}
