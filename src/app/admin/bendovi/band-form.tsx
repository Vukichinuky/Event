import { ui } from "@/lib/ui";
import type { Band, Genre, Category } from "@/generated/prisma/client";

export function BandForm({
  action,
  band,
  genres,
  categories,
  selectedGenreIds,
  error,
  saved,
  showStatus = true,
}: {
  action: (formData: FormData) => Promise<void>;
  band?: Band;
  genres: Genre[];
  categories: Category[];
  selectedGenreIds?: string[];
  error?: string;
  saved?: boolean;
  // ponuđač ne kontroliše objavu sopstvenog profila — to radi admin
  showStatus?: boolean;
}) {
  return (
    <form action={action} className={`space-y-6 ${ui.card} p-6 sm:p-8`}>
      {error && (
        <p className="rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm text-red-700">
          {error}
        </p>
      )}
      {saved && (
        <p className="rounded-xl border border-green-100 bg-green-50 p-3.5 text-sm text-green-700">
          Sačuvano.
        </p>
      )}

      <div className="space-y-1.5">
        <label htmlFor="categoryId" className={ui.label}>
          Kategorija *
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue={band?.categoryId ?? ""}
          className={ui.input}
        >
          <option value="" disabled>
            Izaberi kategoriju…
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="name" className={ui.label}>
          Naziv *
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          defaultValue={band?.name}
          className={ui.input}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className={ui.label}>
          Opis
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={band?.description}
          className={ui.input}
        />
      </div>

      <fieldset className="space-y-2.5">
        <legend className={ui.label}>
          Žanrovi (samo za bendove) —{" "}
          <span className="font-semibold text-gold-dark">
            možeš izabrati više
          </span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <label key={genre.id} className="cursor-pointer">
              <input
                type="checkbox"
                name="genres"
                value={genre.id}
                defaultChecked={selectedGenreIds?.includes(genre.id)}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full border border-stone-200 bg-white px-4 py-1.5 text-sm text-stone-600 transition select-none peer-checked:border-gold peer-checked:bg-gold peer-checked:font-medium peer-checked:text-white peer-checked:before:content-['✓_'] peer-focus-visible:ring-4 peer-focus-visible:ring-gold/25 hover:border-gold">
                {genre.name}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="city" className={ui.label}>
            Grad (sedište — informativno, usluga važi svuda)
          </label>
          <input
            id="city"
            name="city"
            defaultValue={band?.city}
            className={ui.input}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="priceFrom" className={ui.label}>
              Cena od (KM) *
            </label>
            <input
              id="priceFrom"
              name="priceFrom"
              type="number"
              required
              min={1}
              defaultValue={band?.priceFrom}
              className={ui.input}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="priceTo" className={ui.label}>
              Cena do (KM)
            </label>
            <input
              id="priceTo"
              name="priceTo"
              type="number"
              min={1}
              defaultValue={band?.priceTo ?? ""}
              className={ui.input}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="contactEmail" className={ui.label}>
            Kontakt email (za upite)
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            defaultValue={band?.contactEmail ?? ""}
            className={ui.input}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="contactPhone" className={ui.label}>
            Kontakt telefon
          </label>
          <input
            id="contactPhone"
            name="contactPhone"
            defaultValue={band?.contactPhone ?? ""}
            className={ui.input}
          />
        </div>
      </div>

      {showStatus && (
        <div className="space-y-1.5">
          <label htmlFor="status" className={ui.label}>
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={band?.status ?? "DRAFT"}
            className={ui.input}
          >
            <option value="DRAFT">Nacrt (nije javno)</option>
            <option value="PUBLISHED">Objavljen</option>
            <option value="HIDDEN">Sakriven</option>
          </select>
        </div>
      )}

      <button type="submit" className={ui.btnPrimary}>
        Sačuvaj
      </button>
    </form>
  );
}
