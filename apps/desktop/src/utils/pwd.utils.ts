// Types for password options
export type PasswordStrength =
  | "weak"
  | "medium"
  | "strong"
  | "very-strong"
  | "paranoid";
export interface PasswordOptions {
  length?: number;
  strength?: PasswordStrength;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSpecial?: boolean;
  excludeSimilar?: boolean; // Exclude similar chars like i, l, 1, o, 0, O
  excludeAmbiguous?: boolean; // Exclude ambiguous chars: {}[]()/\'"`~,;:.<>
}

// Character sets
const CHAR_SETS = {
  uppercase: "ABCDEFGHJKLMNPQRSTUVWXYZ", // Removed I and O for clarity
  lowercase: "abcdefghijkmnpqrstuvwxyz", // Removed l and o for clarity
  numbers: "23456789", // Removed 0 and 1 for clarity
  special: "!@#$%^&*_-+=?",
  extendedSpecial: "!@#$%^&*()_-+=[]{}|;:,.<>?",
} as const;

// Strength presets
const STRENGTH_PRESETS: Record<PasswordStrength, PasswordOptions> = {
  weak: {
    length: 8,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: false,
  },
  medium: {
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: true,
  },
  strong: {
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: true,
    excludeSimilar: true,
  },
  "very-strong": {
    length: 20,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: true,
    excludeSimilar: true,
    excludeAmbiguous: true,
  },
  paranoid: {
    length: 32,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: true,
    excludeSimilar: true,
    excludeAmbiguous: true,
  },
};

/**
 * Generate a secure password with configurable options
 * @param options Password generation options
 * @returns Generated password
 */
export const generatePassword = (
  options?: PasswordOptions | PasswordStrength
): string => {
  // Parse options - allow string shorthand for strength
  const opts = parseOptions(options);

  // Build character set based on options
  let charSet = "";
  const charSetsUsed: string[] = [];

  if (opts.includeUppercase) {
    charSet += opts.excludeSimilar
      ? CHAR_SETS.uppercase
      : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    charSetsUsed.push(
      opts.excludeSimilar ? CHAR_SETS.uppercase : "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    );
  }

  if (opts.includeLowercase) {
    charSet += opts.excludeSimilar
      ? CHAR_SETS.lowercase
      : "abcdefghijklmnopqrstuvwxyz";
    charSetsUsed.push(
      opts.excludeSimilar ? CHAR_SETS.lowercase : "abcdefghijklmnopqrstuvwxyz"
    );
  }

  if (opts.includeNumbers) {
    charSet += opts.excludeSimilar ? CHAR_SETS.numbers : "0123456789";
    charSetsUsed.push(opts.excludeSimilar ? CHAR_SETS.numbers : "0123456789");
  }

  if (opts.includeSpecial) {
    charSet += opts.excludeAmbiguous
      ? CHAR_SETS.special
      : CHAR_SETS.extendedSpecial;
    charSetsUsed.push(
      opts.excludeAmbiguous ? CHAR_SETS.special : CHAR_SETS.extendedSpecial
    );
  }

  // Validate character set
  if (charSet.length === 0) {
    throw new Error("At least one character type must be included");
  }

  if (opts.length < charSetsUsed.length) {
    throw new Error(
      `Password length must be at least ${charSetsUsed.length} to include all character types`
    );
  }

  // Generate secure random bytes
  const randomBytes = getSecureRandomBytes(opts.length);
  const passwordArray = new Array(opts.length);

  // First, ensure at least one character from each selected set
  charSetsUsed.forEach((set, index) => {
    const randomValue = randomBytes[index] % set.length;
    passwordArray[index] = set.charAt(randomValue);
  });

  // Fill the rest with random characters from the combined set
  for (let i = charSetsUsed.length; i < opts.length; i++) {
    const randomValue = randomBytes[i] % charSet.length;
    passwordArray[i] = charSet.charAt(randomValue);
  }

  // Shuffle the password array to avoid predictable patterns
  return shuffleArray(passwordArray).join("");
};

/**
 * Parse and normalize options
 */
const parseOptions = (
  options?: PasswordOptions | PasswordStrength
): Required<PasswordOptions> => {
  // If options is a string, use the corresponding preset
  if (typeof options === "string") {
    const preset = STRENGTH_PRESETS[options];
    return {
      length: preset.length ?? 16,
      strength: options,
      includeUppercase: preset.includeUppercase ?? true,
      includeLowercase: preset.includeLowercase ?? true,
      includeNumbers: preset.includeNumbers ?? true,
      includeSpecial: preset.includeSpecial ?? true,
      excludeSimilar: preset.excludeSimilar ?? false,
      excludeAmbiguous: preset.excludeAmbiguous ?? false,
    };
  }

  // Use provided options or defaults
  const strength = options?.strength || "strong";
  const baseOptions = options
    ? { ...STRENGTH_PRESETS[strength], ...options }
    : STRENGTH_PRESETS[strength];

  return {
    length: baseOptions.length ?? 16,
    strength: strength,
    includeUppercase: baseOptions.includeUppercase ?? true,
    includeLowercase: baseOptions.includeLowercase ?? true,
    includeNumbers: baseOptions.includeNumbers ?? true,
    includeSpecial: baseOptions.includeSpecial ?? true,
    excludeSimilar: baseOptions.excludeSimilar ?? false,
    excludeAmbiguous: baseOptions.excludeAmbiguous ?? false,
  };
};

/**
 * Get cryptographically secure random bytes
 */
const getSecureRandomBytes = (length: number): Uint8Array => {
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return array;
  } else if (typeof require !== "undefined") {
    // Node.js environment
    const crypto = require("crypto");
    return crypto.randomBytes(length);
  } else {
    // Fallback (less secure, for environments without crypto)
    console.warn(
      "Using Math.random() fallback - not cryptographically secure!"
    );
    const array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  }
};

/**
 * Fisher-Yates shuffle algorithm
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor((getSecureRandomBytes(1)[0] / 256) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Calculate password entropy in bits
 */
export const calculatePasswordEntropy = (password: string): number => {
  // Determine character set size
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32; // Approximate special chars

  // Entropy formula: log2(charsetSize^length)
  return Math.log2(Math.pow(charsetSize || 1, password.length));
};

/**
 * Get password strength rating based on entropy
 */
export const getPasswordStrength = (password: string): PasswordStrength => {
  const entropy = calculatePasswordEntropy(password);

  if (entropy < 40) return "weak";
  if (entropy < 60) return "medium";
  if (entropy < 80) return "strong";
  if (entropy < 120) return "very-strong";
  return "paranoid";
};

// Convenience functions
export const generateStrongPassword = (): string => generatePassword("strong");
export const generateVeryStrongPassword = (): string =>
  generatePassword("very-strong");
export const generatePassphrase = (wordCount: number = 4): string => {
  // Simple wordlist (in practice, use a larger, cryptographically secure wordlist)
  const wordlist = [
    "apple",
    "brave",
    "cloud",
    "dragon",
    "eagle",
    "flame",
    "globe",
    "haven",
    "ice",
    "jazz",
    "king",
    "light",
    "moon",
    "nova",
    "ocean",
    "prism",
    "quest",
    "river",
    "star",
    "tiger",
    "unity",
    "vivid",
    "whale",
    "xenon",
    "yearn",
    "zenith",
  ];

  const randomBytes = getSecureRandomBytes(wordCount * 2);
  const words: string[] = [];

  for (let i = 0; i < wordCount; i++) {
    const index =
      (randomBytes[i * 2] * 256 + randomBytes[i * 2 + 1]) % wordlist.length;
    words.push(wordlist[index]);
  }

  return words.join("-") + Math.floor(Math.random() * 100);
};

import type { IPasswordItem } from "./types/global.types";

/**
 * Calculate the overall health score of the vault (0-100)
 */
export const calculateVaultHealthScore = (items: IPasswordItem[]): number => {
  if (items.length === 0) return 100;

  const validItems = items.filter((i) => !i.isDeleted && i.password);
  if (validItems.length === 0) return 100;

  let totalScore = 0;
  const reusedGroups = findReusedPasswords(items); // Groups of reused passwords
  const reusedCount = reusedGroups.length;

  validItems.forEach((item) => {
    const strength = calculatePasswordEntropy(item.password);
    // entropy 80 is roughly "strong" (score 100)
    // entropy 0 is score 0
    let itemScore = Math.min(100, (strength / 80) * 100);
    totalScore += itemScore;
  });

  let averageScore = totalScore / validItems.length;

  // Penalize for reused passwords
  // If 10% of items are reused, deduct 10 points, etc.
  const reusePenalty = Math.min(30, (reusedCount / validItems.length) * 100);

  return Math.max(0, Math.floor(averageScore - reusePenalty));
};

/**
 * Find items with reused passwords
 * Returns list of items that share passwords with others
 */
export const findReusedPasswords = (
  items: IPasswordItem[]
): IPasswordItem[] => {
  const activeItems = items.filter((i) => !i.isDeleted && i.password);
  const passwordMap = new Map<string, IPasswordItem[]>();

  activeItems.forEach((item) => {
    const pwd = item.password;
    if (!passwordMap.has(pwd)) {
      passwordMap.set(pwd, []);
    }
    passwordMap.get(pwd)?.push(item);
  });

  const reusedItems: IPasswordItem[] = [];
  passwordMap.forEach((group) => {
    if (group.length > 1) {
      reusedItems.push(...group);
    }
  });

  return reusedItems;
};

/**
 * Find items with weak passwords
 */
export const findWeakPasswords = (items: IPasswordItem[]): IPasswordItem[] => {
  return items.filter((item) => {
    if (item.isDeleted || !item.password) return false;
    const strength = getPasswordStrength(item.password);
    // Consider 'weak' and 'medium' as warning-worthy, or just 'weak'
    return strength === "weak" || strength === "medium";
  });
};

/**
 * Find active items (not deleted)
 */
export const getActiveItems = (items: IPasswordItem[]): IPasswordItem[] => {
  return items.filter((i) => !i.isDeleted);
};

// Top 20 most common passwords (in reality this should be a larger list or loaded from a file)
const COMMON_PASSWORDS = new Set([
  "123456",
  "password",
  "123456789",
  "12345678",
  "12345",
  "111111",
  "1234567",
  "sunshine",
  "qwerty",
  "iloveyou",
  "princess",
  "admin",
  "welcome",
  "clover",
  "secret",
  "profile",
  "cookie",
  "monkey",
  "dragon",
  "123123",
  "987654321",
  "football",
  "baseball",
  "superman",
  "charlie",
  "angel",
]);

/**
 * Find items with common passwords
 */
export const findCommonPasswords = (
  items: IPasswordItem[]
): IPasswordItem[] => {
  return items.filter((item) => {
    if (item.isDeleted || !item.password) return false;
    return COMMON_PASSWORDS.has(item.password.toLowerCase());
  });
};
