export type PasswordOptions = {
  length: number;
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean;
};

const AMBIGUOUS = new Set("Il1O0o`'\"".split(""));

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?/|~";

function poolFor(options: PasswordOptions): { pool: string; required: string[] } {
  const required: string[] = [];
  let pool = "";
  if (options.lower) { pool += LOWER; required.push(LOWER); }
  if (options.upper) { pool += UPPER; required.push(UPPER); }
  if (options.numbers) { pool += NUMBERS; required.push(NUMBERS); }
  if (options.symbols) { pool += SYMBOLS; required.push(SYMBOLS); }
  if (options.avoidAmbiguous) {
    pool = pool.split("").filter((char) => !AMBIGUOUS.has(char)).join("");
  }
  const cleanRequired = required
    .map((chars) => options.avoidAmbiguous ? chars.split("").filter((char) => !AMBIGUOUS.has(char)).join("") : chars)
    .filter((chars) => chars.length > 0);
  return { pool, required: cleanRequired };
}

function randomInt(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] ?? 0) % max;
}

export function generatePassword(options: PasswordOptions): string {
  const { pool, required } = poolFor(options);
  if (!pool) return "";
  const chars: string[] = required.map((set) => set[randomInt(set.length)] ?? "");
  const remaining = options.length - chars.length;
  for (let index = 0; index < remaining; index += 1) {
    chars.push(pool[randomInt(pool.length)] ?? "");
  }
  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swap = randomInt(index + 1);
    const swapValue = chars[swap] ?? "";
    chars[swap] = chars[index] ?? "";
    chars[index] = swapValue;
  }
  return chars.slice(0, options.length).join("");
}

const WORDS = [
  "correct", "horse", "battery", "cloud", "staple", "summer", "velvet", "silver", "copper", "golden",
  "mountain", "river", "ocean", "forest", "desert", "planet", "comet", "galaxy", "ember", "breeze",
  "candle", "dragon", "falcon", "garden", "harbor", "island", "jasmine", "kelp", "lantern", "meadow",
  "nebula", "orbit", "pine", "quartz", "raven", "sapphire", "thunder", "willow", "zenith", "aspen"
];

export function generatePassphrase(wordCount = 4, separator = "-", number = true): string {
  const words: string[] = [];
  for (let index = 0; index < wordCount; index += 1) {
    words.push(WORDS[randomInt(WORDS.length)] ?? "");
  }
  let passphrase = words.join(separator);
  if (number) passphrase += `${separator}${randomInt(90) + 10}`;
  return passphrase;
}