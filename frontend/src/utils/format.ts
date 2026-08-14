import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatEventDate(isoDate: string | null): string | null {
  if (!isoDate) return null;
  try {
    return format(new Date(isoDate), "d 'de' MMMM, HH:mm'hs'", { locale: es });
  } catch {
    return null;
  }
}

export function formatPrice(price: string | null): string | null {
  if (!price) return null;
  const numeric = Number(price);
  if (Number.isNaN(numeric)) return null;
  return numeric === 0 ? 'Gratis' : `$${numeric.toLocaleString('es-AR')}`;
}
