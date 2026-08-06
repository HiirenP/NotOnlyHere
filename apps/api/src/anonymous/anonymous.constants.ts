import { randomInt } from 'crypto';

export const ANONYMOUS_DAILY_LIMIT = 10;

const ADJECTIVES = [
  'Quiet',
  'Gentle',
  'Brave',
  'Calm',
  'Kind',
  'Warm',
  'Soft',
  'Bright',
  'Steady',
  'Hopeful',
];

const NOUNS = [
  'Fox',
  'Wave',
  'Leaf',
  'Star',
  'River',
  'Cloud',
  'Pine',
  'Dawn',
  'Meadow',
  'Harbor',
];

export function generateAnonymousDisplayLabel() {
  const adjective = ADJECTIVES[randomInt(ADJECTIVES.length)]!;
  const noun = NOUNS[randomInt(NOUNS.length)]!;
  const suffix = randomInt(900) + 100;
  return `${adjective}${noun}${suffix}`;
}

export function utcUsageDate(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function nextUtcMidnight(from = new Date()) {
  return new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate() + 1));
}
