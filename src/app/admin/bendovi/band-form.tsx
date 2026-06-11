import type { Band, Genre } from "@/generated/prisma/client";

const inputClass =
  "w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none";

export function BandForm({
  action,
  band,
  genres,
  selectedGenreIds,
  error,
  saved,
}: {
  action: (formData: FormData) => Promise<void>;
  band?: Band;
  genres: Genre[];
  selectedGenreIds?: string[];
  error?: string;
  saved?: boolean;
}) {
  return (
    <form
      action={action}
      className="space-y-5 rounded-xl border border-stone-200 bg-white p-6"
    >
      {error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      {saved && (
        <p className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          Sačuvano.
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-stone-700">
          Ime benda *
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          defaultValue={band?.name}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="description"
          className="text-sm font-medium text-stone-700"
        >
          Opis
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={band?.description}
          className={inputClass}
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-stone-700">Žanrovi</legend>
        <div className="flex flex-wrap gap-3">
          {genres.map((genre) => (
            <label
              key={genre.id}
              className="flex items-center gap-1.5 text-sm text-stone-700"
            >
              <input
                type="checkbox"
                name="genres"
                value={genre.id}
                defaultChecked={selectedGenreIds?.includes(genre.id)}
              />
              {genre.name}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="city" className="text-sm font-medium text-stone-700">
            Grad (sedište — informativno, bend svira svuda)
          </label>
          <input
            id="city"
            name="city"
            defaultValue={band?.city}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label
              htmlFor="priceFrom"
              className="text-sm font-medium text-stone-700"
            >
              Cena od (KM) *
            </label>
            <input
              id="priceFrom"
              name="priceFrom"
              type="number"
              required
              min={1}
              defaultValue={band?.priceFrom}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="priceTo"
              className="text-sm font-medium text-stone-700"
            >
              Cena do (KM)
            </label>
            <input
              id="priceTo"
              name="priceTo"
              type="number"
              min={1}
              defaultValue={band?.priceTo ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1">
          <label
            htmlFor="contactEmail"
            className="text-sm font-medium text-stone-700"
          >
            Kontakt email (za upite)
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            defaultValue={band?.contactEmail ?? ""}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="contactPhone"
            className="text-sm font-medium text-stone-700"
          >
            Kontakt telefon
          </label>
          <input
            id="contactPhone"
            name="contactPhone"
            defaultValue={band?.contactPhone ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="status" className="text-sm font-medium text-stone-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={band?.status ?? "DRAFT"}
          className={inputClass}
        >
          <option value="DRAFT">Nacrt (nije javno)</option>
          <option value="PUBLISHED">Objavljen</option>
          <option value="HIDDEN">Sakriven</option>
        </select>
      </div>

      <button
        type="submit"
        className="rounded-md bg-stone-900 px-5 py-2 text-sm font-medium text-white hover:bg-stone-700"
      >
        Sačuvaj
      </button>
    </form>
  );
}
