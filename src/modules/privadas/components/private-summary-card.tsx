type PrivateSummaryCardProps = {
  name: string;
  city: string;
  country: string;
  createdAt: string;
};

export function PrivateSummaryCard({
  name,
  city,
  country,
  createdAt,
}: PrivateSummaryCardProps) {
  return (
    <article className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold">{name}</h3>
          <p className="text-xs text-muted-foreground">
            {city}, {country}
          </p>
        </div>
        <span className="rounded-full border px-2 py-1 text-xs">Activa</span>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Creada: {new Date(createdAt).toLocaleDateString("es-MX")}
      </p>
    </article>
  );
}
