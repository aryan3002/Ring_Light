export function kelvinToRGB(kelvin: number): { r: number; g: number; b: number } {
  const temp = kelvin / 100;
  let red: number, green: number, blue: number;

  if (temp <= 66) {
    red = 255;
    green = temp <= 19 ? 0 : 99.4708025861 * Math.log(temp - 10) - 161.1195681661;
    blue =
      temp <= 19
        ? 0
        : temp >= 66
          ? 255
          : 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
  } else {
    red = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
    green = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
    blue = 255;
  }

  return {
    r: Math.max(0, Math.min(255, Math.round(red))),
    g: Math.max(0, Math.min(255, Math.round(green))),
    b: Math.max(0, Math.min(255, Math.round(blue))),
  };
}

export function rgbToCSS(r: number, g: number, b: number): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
  );
}

export function temperatureLabel(kelvin: number): string {
  if (kelvin < 3000) return 'Candle';
  if (kelvin < 4000) return 'Warm';
  if (kelvin < 5000) return 'Neutral';
  if (kelvin < 6000) return 'Cool White';
  if (kelvin < 7000) return 'Daylight';
  return 'Blue Sky';
}
