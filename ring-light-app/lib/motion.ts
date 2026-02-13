export const LANDING_EASE = [0.22, 1, 0.36, 1] as [
  number,
  number,
  number,
  number,
];

export function initialIfMotion<T>(reduceMotion: boolean, value: T): T | false {
  return reduceMotion ? false : value;
}

export function animateIfMotion<T>(
  reduceMotion: boolean,
  value: T
): T | undefined {
  return reduceMotion ? undefined : value;
}
