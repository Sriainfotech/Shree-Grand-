import { useEffect, useState } from "react";
import { getProperty, type Property } from "@/lib/propertyApi";

const formatInr = (amount: number) =>
  amount.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

/**
 * Shows what a guest gets before they fill in the booking form below it —
 * the whole property (never a particular room within it), its amenities,
 * capacity and day rate.
 */
export function PropertyDetails() {
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    getProperty()
      .then(setProperty)
      .catch(() => setProperty(null));
  }, []);

  if (!property) return null;

  const hasDescription = property.description.trim().length > 0;

  return (
    <div className="border border-border bg-card p-8 sm:p-10">
      {property.images[0] ? (
        <img
          src={property.images[0]}
          alt={property.name}
          loading="lazy"
          decoding="async"
          className="mb-6 aspect-[4/3] w-full rounded-sm object-cover"
        />
      ) : null}

      <h3 className="display-lg">{property.name}</h3>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {hasDescription
          ? property.description
          : "Book the whole property for however many days you need — not a particular room or space within it."}
      </p>

      {property.amenities.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {property.amenities.map((a) => (
            <li
              key={a}
              className="rounded-sm border border-border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
            >
              {a}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
        <div className="bg-card p-6">
          <p className="eyebrow">Guest capacity</p>
          <p className="display-lg mt-2 text-2xl">{property.guestCapacity ?? "Based on party"}</p>
        </div>
        <div className="bg-card p-6">
          <p className="eyebrow">Price per day</p>
          <p className="display-lg mt-2 text-2xl">
            {property.pricePerDay ? formatInr(property.pricePerDay) : property.priceLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
