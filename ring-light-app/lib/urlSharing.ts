import { LightSettings } from '@/types';

export function generateShareURL(settings: LightSettings): string {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams({
    b: settings.brightness.toString(),
    t: settings.temperature.toString(),
  });
  return `${window.location.origin}/studio?${params.toString()}`;
}

export function parseShareURL(searchParams: URLSearchParams): Partial<LightSettings> | null {
  const brightness = searchParams.get('b');
  const temperature = searchParams.get('t');

  if (brightness && temperature) {
    const b = parseInt(brightness, 10);
    const t = parseInt(temperature, 10);
    if (!isNaN(b) && !isNaN(t) && b >= 0 && b <= 100 && t >= 2700 && t <= 9000) {
      return { brightness: b, temperature: t };
    }
  }
  return null;
}
