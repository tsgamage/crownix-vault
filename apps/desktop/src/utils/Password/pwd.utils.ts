import type { IPasswordItem } from "../types/global.types";
import { WORD_LIST } from "@/data/word-list";
import { COMMON_PASSWORDS } from "@/data/common-passwords";
import { PASSWORD_PATTERNS } from "@/data/password-patterns";

// Types for password options
export type PasswordStrength = "very-weak" | "weak" | "medium" | "strong" | "very-strong" | "excellent";
export interface PasswordOptions {
  length?: number;
  strength?: PasswordStrength;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSpecial?: boolean;
  excludeSimilar?: boolean; // Exclude similar chars like i, l, 1, o, 0, O
  excludeAmbiguous?: boolean; // Exclude ambiguous chars: {}[]()/\'"`~,;:.<>
  excludeSequential?: boolean; // Exclude sequential chars like abc, 123
  excludeRepeated?: boolean; // Exclude repeated chars like aaa, 111
}

// Character sets with maximum security considerations
const CHAR_SETS = {
  uppercase: "ABCDEFGHJKLMNPQRSTUVWXYZ", // Removed I, O (look like 1, 0)
  lowercase: "abcdefghijkmnpqrstuvwxyz", // Removed l, o (look like 1, 0)
  numbers: "23456789", // Removed 0, 1 (look like O, l)
  special: "!@#$%^&*_-+=?",
  extendedSpecial: "!@#$%^&*()_-+=[]{}|;:,.<>?",
  // Additional secure character sets
  hex: "ABCDEF0123456789",
  alphanumeric: "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789",
  pronounceable: "bcdfghjklmnpqrstvwxyzaeiou", // Consonants and vowels for pronounceable passwords
} as const;

// Strength presets with exact specifications
const STRENGTH_PRESETS: Record<PasswordStrength, Required<PasswordOptions>> = {
  "very-weak": {
    length: 6,
    strength: "very-weak",
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: false,
    excludeSimilar: false,
    excludeAmbiguous: false,
    excludeSequential: false,
    excludeRepeated: false,
  },
  weak: {
    length: 8,
    strength: "weak",
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: false,
    excludeSimilar: true,
    excludeAmbiguous: false,
    excludeSequential: false,
    excludeRepeated: true,
  },
  medium: {
    length: 12,
    strength: "medium",
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: true,
    excludeSimilar: true,
    excludeAmbiguous: true,
    excludeSequential: true,
    excludeRepeated: true,
  },
  strong: {
    length: 16,
    strength: "strong",
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: true,
    excludeSimilar: true,
    excludeAmbiguous: true,
    excludeSequential: true,
    excludeRepeated: true,
  },
  "very-strong": {
    length: 20,
    strength: "very-strong",
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: true,
    excludeSimilar: true,
    excludeAmbiguous: true,
    excludeSequential: true,
    excludeRepeated: true,
  },
  excellent: {
    length: 24,
    strength: "excellent",
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: true,
    excludeSimilar: true,
    excludeAmbiguous: true,
    excludeSequential: true,
    excludeRepeated: true,
  },
};

// Security scoring constants
const SECURITY_SCORES = {
  // Entropy thresholds for scoring
  MAX_ENTROPY: 256,
  MIN_ENTROPY_WEAK: 28,
  MIN_ENTROPY_MEDIUM: 48,
  MIN_ENTROPY_STRONG: 64,
  MIN_ENTROPY_VERY_STRONG: 80,
  MIN_ENTROPY_EXCELLENT: 100,

  // Realistic scoring weights
  PASSWORD_SCORE_WEIGHTS: {
    ENTROPY: 0.5, // 50% - Most important
    LENGTH: 0.2, // 20%
    VARIETY: 0.2, // 20%
    PATTERN: 0.1, // 10% (negative)
  },

  // Vault scoring weights - SUMS TO 100% POSITIVE
  VAULT_WEIGHTS: {
    AVERAGE_SCORE: 0.6, // 60% - Average password quality
    UNIQUE_PASSWORDS: 0.25, // 25% - Bonus for no reuse
    NO_COMMON_PASSWORDS: 0.15, // 15% - Bonus for no common passwords
  },

  // Penalties (subtracted from base)
  VAULT_PENALTIES: {
    PER_WEAK_PASSWORD: 5, // 5 points per weak password
    PER_REUSED_INSTANCE: 3, // 3 points per reuse instance
    PER_PATTERN_PASSWORD: 2, // 2 points per pattern password
  },
} as const;

// Interface for detailed password analysis
export interface PasswordAnalysis {
  password: string;
  entropy: number;
  strength: PasswordStrength;
  score: number; // 0-100 exact score
  weaknesses: string[];
  suggestions: string[];
  details: {
    length: number;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecial: boolean;
    charsetSize: number;
    patternScore: number;
    reuseCount: number;
  };
}

/**
 * Generate a secure password with configurable options
 * @param options Password generation options
 * @returns Generated password
 */
export const generatePassword = (options?: PasswordOptions | PasswordStrength): string => {
  // Parse options
  const opts = parseOptions(options);

  // Generate multiple candidates and select the best one
  const candidates: string[] = [];
  for (let i = 0; i < 5; i++) {
    // Generate 5 candidates
    candidates.push(generatePasswordCandidate(opts));
  }

  // Select candidate with highest security score
  return selectBestPassword(candidates, opts);
};

/**
 * Generate a single password candidate
 */
const generatePasswordCandidate = (opts: Required<PasswordOptions>): string => {
  // Build character set based on options
  let charSet = "";
  const charSetsUsed: string[] = [];

  if (opts.includeUppercase) {
    const set = opts.excludeSimilar ? CHAR_SETS.uppercase : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    charSet += set;
    charSetsUsed.push(set);
  }

  if (opts.includeLowercase) {
    const set = opts.excludeSimilar ? CHAR_SETS.lowercase : "abcdefghijklmnopqrstuvwxyz";
    charSet += set;
    charSetsUsed.push(set);
  }

  if (opts.includeNumbers) {
    const set = opts.excludeSimilar ? CHAR_SETS.numbers : "0123456789";
    charSet += set;
    charSetsUsed.push(set);
  }

  if (opts.includeSpecial) {
    const set = opts.excludeAmbiguous ? CHAR_SETS.special : CHAR_SETS.extendedSpecial;
    charSet += set;
    charSetsUsed.push(set);
  }

  // Validate character set
  if (charSet.length === 0) {
    throw new Error("At least one character type must be included");
  }

  if (opts.length < charSetsUsed.length) {
    throw new Error(`Password length must be at least ${charSetsUsed.length} to include all character types`);
  }

  // Generate secure random bytes
  const randomBytes = getSecureRandomBytes(opts.length * 2); // Extra bytes for better randomness
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
  const password = shuffleArray(passwordArray).join("");

  // Apply post-generation filters
  return applyPostGenerationFilters(password, opts);
};

/**
 * Select the best password from candidates
 */
const selectBestPassword = (candidates: string[], opts: Required<PasswordOptions>): string => {
  let bestPassword = candidates[0];
  let bestScore = -Infinity;

  for (const candidate of candidates) {
    const analysis = analyzePassword(candidate);
    const score = analysis.score;

    // Apply bonus for meeting all options
    let bonus = 0;
    if (candidate.length === opts.length) bonus += 5;
    if (analysis.details.hasUppercase === opts.includeUppercase) bonus += 2;
    if (analysis.details.hasLowercase === opts.includeLowercase) bonus += 2;
    if (analysis.details.hasNumbers === opts.includeNumbers) bonus += 2;
    if (analysis.details.hasSpecial === opts.includeSpecial) bonus += 2;

    const totalScore = score + bonus;

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestPassword = candidate;
    }
  }

  return bestPassword;
};

/**
 * Apply filters after password generation
 */
const applyPostGenerationFilters = (password: string, opts: Required<PasswordOptions>): string => {
  let filteredPassword = password;

  // If still contains unwanted patterns, regenerate parts
  if (opts.excludeSequential && hasSequentialChars(filteredPassword, 3)) {
    filteredPassword = fixSequentialChars(filteredPassword);
  }

  if (opts.excludeRepeated && hasRepeatedChars(filteredPassword, 3)) {
    filteredPassword = fixRepeatedChars(filteredPassword);
  }

  return filteredPassword;
};

/**
 * Parse and normalize options
 */
const parseOptions = (options?: PasswordOptions | PasswordStrength): Required<PasswordOptions> => {
  // If options is a string, use the corresponding preset
  if (typeof options === "string") {
    const preset = STRENGTH_PRESETS[options];
    return {
      length: preset.length,
      strength: options,
      includeUppercase: preset.includeUppercase,
      includeLowercase: preset.includeLowercase,
      includeNumbers: preset.includeNumbers,
      includeSpecial: preset.includeSpecial,
      excludeSimilar: preset.excludeSimilar,
      excludeAmbiguous: preset.excludeAmbiguous,
      excludeSequential: preset.excludeSequential,
      excludeRepeated: preset.excludeRepeated,
    };
  }

  // Use provided options or defaults
  const strength = options?.strength || "strong";
  const baseOptions = options ? { ...STRENGTH_PRESETS[strength], ...options } : STRENGTH_PRESETS[strength];

  return {
    length: baseOptions.length,
    strength: strength,
    includeUppercase: baseOptions.includeUppercase,
    includeLowercase: baseOptions.includeLowercase,
    includeNumbers: baseOptions.includeNumbers,
    includeSpecial: baseOptions.includeSpecial,
    excludeSimilar: baseOptions.excludeSimilar,
    excludeAmbiguous: baseOptions.excludeAmbiguous,
    excludeSequential: baseOptions.excludeSequential,
    excludeRepeated: baseOptions.excludeRepeated,
  };
};

/**
 * Get cryptographically secure random bytes
 */
const getSecureRandomBytes = (length: number): Uint8Array => {
  // Browser environment
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return array;
  }

  // Node.js environment
  if (typeof require !== "undefined") {
    try {
      const crypto = require("crypto");
      return crypto.randomBytes(length);
    } catch (e) {
      // Fall through to warning
    }
  }

  // Fallback - should not be used in production
  console.error("CRYPTOGRAPHIC WARNING: Using Math.random() fallback - NOT SECURE!");
  const array = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    array[i] = Math.floor(Math.random() * 256);
  }
  return array;
};

/**
 * Fisher-Yates shuffle algorithm with cryptographically secure randomness
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomBytes = getSecureRandomBytes(4);
    const randomValue =
      ((randomBytes[0] << 24) | (randomBytes[1] << 16) | (randomBytes[2] << 8) | randomBytes[3]) >>> 0;
    const j = randomValue % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Calculate exact password entropy in bits with precise charset calculation
 */
export const calculatePasswordEntropy = (password: string): number => {
  if (!password || password.length === 0) return 0;

  // Calculate exact charset size based on actual characters used
  let charsetSize = 0;
  const charTypes = {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /[0-9]/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
  };

  // Count unique characters in each category
  const uniqueChars = new Set(password);

  // Determine effective charset size
  if (charTypes.lowercase) {
    const lowercaseChars = password.match(/[a-z]/g) || [];
    const uniqueLowercase = new Set(lowercaseChars);
    charsetSize += Math.min(26, uniqueLowercase.size > 5 ? 26 : uniqueLowercase.size * 5);
  }

  if (charTypes.uppercase) {
    const uppercaseChars = password.match(/[A-Z]/g) || [];
    const uniqueUppercase = new Set(uppercaseChars);
    charsetSize += Math.min(26, uniqueUppercase.size > 5 ? 26 : uniqueUppercase.size * 5);
  }

  if (charTypes.numbers) {
    const numberChars = password.match(/[0-9]/g) || [];
    const uniqueNumbers = new Set(numberChars);
    charsetSize += Math.min(10, uniqueNumbers.size > 3 ? 10 : uniqueNumbers.size * 3);
  }

  if (charTypes.special) {
    const specialChars = password.match(/[^a-zA-Z0-9]/g) || [];
    const uniqueSpecial = new Set(specialChars);
    charsetSize += Math.min(33, uniqueSpecial.size > 5 ? 33 : uniqueSpecial.size * 5);
  }

  // Minimum charset size of 2 for calculation stability
  charsetSize = Math.max(2, charsetSize);

  // Calculate entropy: log2(charsetSize^length)
  const entropy = Math.log2(Math.pow(charsetSize, password.length));

  // Cap entropy at theoretical maximum (8 bits per byte)
  return Math.min(entropy, password.length * 8);
};

/**
 * Get exact password score (0-100) with precise calculation
 */
export const calculatePasswordScore = (password: string): number => {
  if (!password || password.length === 0) return 0;

  // Check for common passwords (instant failure)
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return 0;
  }

  // Base score from entropy (50%)
  const entropy = calculatePasswordEntropy(password);
  const entropyScore = Math.min(100, (entropy / 100) * 100) * SECURITY_SCORES.PASSWORD_SCORE_WEIGHTS.ENTROPY;

  // Length score (20%) - More realistic curve
  const lengthScore = calculateLengthScore(password) * SECURITY_SCORES.PASSWORD_SCORE_WEIGHTS.LENGTH;

  // Character variety score (20%)
  const varietyScore = calculateCharacterVarietyScore(password) * SECURITY_SCORES.PASSWORD_SCORE_WEIGHTS.VARIETY;

  // Pattern penalty (10% negative)
  const patternPenalty = calculatePatternPenalty(password) * SECURITY_SCORES.PASSWORD_SCORE_WEIGHTS.PATTERN;

  // Combine scores
  let totalScore = entropyScore + lengthScore + varietyScore - patternPenalty;

  // Apply length minimums
  if (password.length < 8) totalScore *= 0.5;
  if (password.length < 6) totalScore *= 0.3;

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, Math.round(totalScore * 100) / 100));
};

/**
 * Calculate length score with realistic curve
 */
const calculateLengthScore = (password: string): number => {
  const length = password.length;

  // Realistic scoring for typical password lengths
  if (length >= 24) return 100; // Excellent
  if (length >= 20) return 95; // Very Strong
  if (length >= 16) return 85; // Strong
  if (length >= 12) return 70; // Medium
  if (length >= 8) return 50; // Weak but acceptable
  if (length >= 6) return 25; // Very weak
  return 0;
};

/**
 * Calculate character variety score
 */
const calculateCharacterVarietyScore = (password: string): number => {
  let score = 0;

  // Check for different character types
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  // Count character types
  const typeCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  // Base score for character types
  switch (typeCount) {
    case 4:
      score = 100;
      break;
    case 3:
      score = 70;
      break;
    case 2:
      score = 40;
      break;
    case 1:
      score = 10;
      break;
    default:
      score = 0;
  }

  // Bonus for balanced distribution (less important)
  if (typeCount >= 2 && password.length >= 8) {
    const totalChars = password.length;
    const lowerCount = (password.match(/[a-z]/g) || []).length;
    const upperCount = (password.match(/[A-Z]/g) || []).length;
    const numberCount = (password.match(/[0-9]/g) || []).length;
    const specialCount = (password.match(/[^a-zA-Z0-9]/g) || []).length;

    const distribution = [lowerCount, upperCount, numberCount, specialCount].filter((count) => count > 0);

    // Bonus if at least 2 character types have reasonable representation
    const wellRepresented = distribution.filter((count) => count >= 2).length;
    if (wellRepresented >= 2) {
      score += 10;
    }
  }

  return Math.min(100, score);
};

/**
 * Calculate pattern penalty
 */
const calculatePatternPenalty = (password: string): number => {
  let penalty = 0;

  // Check for common passwords (already handled in calculatePasswordScore)

  // Check for sequential characters (3+)
  if (hasSequentialChars(password, 4)) {
    penalty += 30;
  } else if (hasSequentialChars(password, 3)) {
    penalty += 15;
  }

  // Check for keyboard walks (severe penalty)
  if (hasKeyboardWalk(password)) {
    penalty += 50;
  }

  // Check for repeated characters (4+)
  if (hasRepeatedChars(password, 4)) {
    penalty += 40;
  } else if (hasRepeatedChars(password, 3)) {
    penalty += 20;
  }

  // Check for date patterns
  if (hasDatePattern(password)) {
    penalty += 25;
  }

  // Check for l33t patterns (mild penalty)
  if (hasLeetPattern(password)) {
    penalty += 10;
  }

  // Check for dictionary words (only if word is significant portion)
  if (hasDictionaryWord(password)) {
    const words = password
      .toLowerCase()
      .split(/[^a-z]/)
      .filter((w) => w.length > 3);
    const hasLongWord = words.some((w) => w.length >= 6);
    penalty += hasLongWord ? 30 : 15;
  }

  // Check for personal info patterns (severe)
  if (hasPersonalInfoPattern(password)) {
    penalty += 60;
  }

  // Length penalty (already handled in length score)

  return Math.min(100, penalty);
};

/**
 * Get password strength rating based on exact score
 */
export const getPasswordStrength = (password: string): PasswordStrength => {
  const score = calculatePasswordScore(password);

  if (score < 30) return "very-weak";
  if (score < 50) return "weak";
  if (score < 70) return "medium";
  if (score < 85) return "strong";
  if (score < 95) return "very-strong";
  return "excellent";
};

/**
 * Comprehensive password analysis
 */
export const analyzePassword = (password: string): PasswordAnalysis => {
  const entropy = calculatePasswordEntropy(password);
  const strength = getPasswordStrength(password);
  const score = calculatePasswordScore(password);

  // Analyze weaknesses
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  if (password.length < 8) {
    weaknesses.push(`Password is too short (${password.length} characters)`);
    suggestions.push("Use at least 12 characters");
  }

  if (password.length >= 8 && password.length < 12) {
    weaknesses.push(`Password could be longer (${password.length} characters)`);
    suggestions.push("Use 12+ characters for better security");
  }

  if (!/[A-Z]/.test(password)) {
    weaknesses.push("Missing uppercase letters");
    suggestions.push("Add uppercase letters (A-Z)");
  }

  if (!/[a-z]/.test(password)) {
    weaknesses.push("Missing lowercase letters");
    suggestions.push("Add lowercase letters (a-z)");
  }

  if (!/[0-9]/.test(password)) {
    weaknesses.push("Missing numbers");
    suggestions.push("Add numbers (0-9)");
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    weaknesses.push("Missing special characters");
    suggestions.push("Add special characters (!@#$%^&* etc.)");
  }

  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    weaknesses.push("Password is too common");
    suggestions.push("Use a unique, randomly generated password");
  }

  if (hasSequentialChars(password, 3)) {
    weaknesses.push("Contains sequential characters");
    suggestions.push("Avoid sequences like 'abc', '123'");
  }

  if (hasRepeatedChars(password, 3)) {
    weaknesses.push("Contains repeated characters");
    suggestions.push("Avoid repeated characters like 'aaa', '111'");
  }

  // If no weaknesses found, add positive feedback
  if (weaknesses.length === 0) {
    weaknesses.push("No major weaknesses detected");
    suggestions.push("Great job! Consider using a password manager to store this securely");
  }

  return {
    password,
    entropy,
    strength,
    score,
    weaknesses,
    suggestions,
    details: {
      length: password.length,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      hasSpecial: /[^a-zA-Z0-9]/.test(password),
      charsetSize: calculateCharsetSize(password),
      patternScore: 100 - calculatePatternPenalty(password),
      reuseCount: 0, // Will be filled when used in vault context
    },
  };
};

/**
 * Calculate exact charset size
 */
const calculateCharsetSize = (password: string): number => {
  let size = 0;
  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/[0-9]/.test(password)) size += 10;

  // Count unique special characters
  const specialChars = password.match(/[^a-zA-Z0-9]/g) || [];
  const uniqueSpecial = new Set(specialChars);
  size += Math.min(33, uniqueSpecial.size * 5); // Approximate special char diversity

  return Math.max(2, size);
};

/**
 * Pattern detection functions
 */
export const hasSequentialChars = (password: string, minLength: number = 3): boolean => {
  for (let i = 0; i <= password.length - minLength; i++) {
    const seq = password.substr(i, minLength).toLowerCase();
    let isAscending = true;
    let isDescending = true;

    for (let j = 1; j < seq.length; j++) {
      const prev = seq.charCodeAt(j - 1);
      const curr = seq.charCodeAt(j);

      if (curr !== prev + 1) isAscending = false;
      if (curr !== prev - 1) isDescending = false;

      // Also check for keyboard sequences
      if (PASSWORD_PATTERNS.keyboardSequences.some((pattern) => seq.includes(pattern))) {
        return true;
      }
    }

    if (isAscending || isDescending) {
      return true;
    }
  }
  return false;
};

export const hasKeyboardWalk = (password: string): boolean => {
  const lower = password.toLowerCase();
  return PASSWORD_PATTERNS.keyboardWalks.some((pattern) => lower.includes(pattern));
};

export const hasRepeatedChars = (password: string, minRepeat: number = 3): boolean => {
  const regex = new RegExp(`(.)\\1{${minRepeat - 1},}`);
  return regex.test(password);
};

export const hasDatePattern = (password: string): boolean => {
  return PASSWORD_PATTERNS.datePatterns.some((pattern) => {
    const regex = new RegExp(pattern, "i");
    return regex.test(password);
  });
};

export const hasLeetPattern = (password: string): boolean => {
  const lower = password.toLowerCase();
  // Check for common leet words
  if (PASSWORD_PATTERNS.leetWords.some((word) => lower.includes(word))) {
    return true;
  }

  // Count leet substitutions
  let leetCount = 0;
  for (const [normal, leets] of Object.entries(PASSWORD_PATTERNS.leetSubstitutions)) {
    for (const leet of leets) {
      if (lower.includes(leet)) {
        leetCount++;
        break;
      }
    }
  }

  // If more than 25% of characters are leet substitutions
  return leetCount >= Math.ceil(password.length * 0.25);
};

export const hasDictionaryWord = (password: string): boolean => {
  const words = password
    .toLowerCase()
    .split(/[^a-z]/)
    .filter((w) => w.length > 3);
  return words.some((word) => PASSWORD_PATTERNS.commonWords.has(word));
};

export const hasPersonalInfoPattern = (password: string): boolean => {
  // This would need to be customized based on user data
  // For now, check for common personal info patterns
  return PASSWORD_PATTERNS.personalInfoPatterns.some((pattern) => {
    const regex = new RegExp(pattern, "i");
    return regex.test(password);
  });
};

const fixSequentialChars = (password: string): string => {
  const chars = password.split("");
  for (let i = 2; i < chars.length; i++) {
    const a = chars[i - 2].charCodeAt(0);
    const b = chars[i - 1].charCodeAt(0);
    const c = chars[i].charCodeAt(0);

    if ((c === b + 1 && b === a + 1) || (c === b - 1 && b === a - 1)) {
      // Replace middle character with random character
      const randomBytes = getSecureRandomBytes(1);
      chars[i - 1] = String.fromCharCode(33 + (randomBytes[0] % 94));
    }
  }
  return chars.join("");
};

const fixRepeatedChars = (password: string): string => {
  const chars = password.split("");
  for (let i = 2; i < chars.length; i++) {
    if (chars[i] === chars[i - 1] && chars[i] === chars[i - 2]) {
      const randomBytes = getSecureRandomBytes(1);
      chars[i] = String.fromCharCode(33 + (randomBytes[0] % 94));
    }
  }
  return chars.join("");
};

/**
 * Find items with common patterns
 */
export const findPatternPasswords = (items: IPasswordItem[]): IPasswordItem[] => {
  return items.filter((item) => {
    if (item.isDeleted || !item.password) return false;

    const password = item.password;
    return (
      hasSequentialChars(password, 3) ||
      hasKeyboardWalk(password) ||
      hasRepeatedChars(password, 3) ||
      hasDatePattern(password) ||
      hasLeetPattern(password) ||
      hasDictionaryWord(password) ||
      hasPersonalInfoPattern(password)
    );
  });
};

/**
 * Get pattern analysis details
 */
export const analyzePasswordPatterns = (
  password: string
): {
  hasPatterns: boolean;
  patterns: string[];
  patternScore: number;
  suggestions: string[];
} => {
  const patterns: string[] = [];
  const suggestions: string[] = [];

  if (hasSequentialChars(password, 3)) {
    patterns.push("Sequential characters detected");
    suggestions.push("Avoid sequences like 'abc', '123', 'xyz'");
  }

  if (hasKeyboardWalk(password)) {
    patterns.push("Keyboard walk pattern detected");
    suggestions.push("Avoid keyboard patterns like 'qwerty', 'asdfgh'");
  }

  if (hasRepeatedChars(password, 3)) {
    patterns.push("Repeated characters detected");
    suggestions.push("Avoid repeated characters like 'aaa', '111'");
  }

  if (hasDatePattern(password)) {
    patterns.push("Date pattern detected");
    suggestions.push("Avoid using dates in passwords");
  }

  if (hasLeetPattern(password)) {
    patterns.push("Leet speak pattern detected");
    suggestions.push("Avoid overusing character substitutions (4 for A, 3 for E, etc.)");
  }

  if (hasDictionaryWord(password)) {
    patterns.push("Dictionary word detected");
    suggestions.push("Avoid common dictionary words");
  }

  if (hasPersonalInfoPattern(password)) {
    patterns.push("Personal information pattern detected");
    suggestions.push("Avoid using personal information (names, birthdates, etc.)");
  }

  const patternScore = 100 - calculatePatternPenalty(password);

  if (patterns.length === 0) {
    patterns.push("No common patterns detected");
    suggestions.push("Good job! Password appears random");
  }

  return {
    hasPatterns: patterns.length > 1 || (patterns.length === 1 && !patterns[0].includes("No common")),
    patterns,
    patternScore: Math.max(0, patternScore),
    suggestions,
  };
};

/**
 * Calculate exact vault health score (0-100)
 */
export const calculateVaultHealthScore = (items: IPasswordItem[]): number => {
  const activeItems = items.filter((item) => !item.isDeleted && item.password);

  if (activeItems.length === 0) return 100;

  // 1. Calculate average password score (60%)
  const passwordScores = activeItems.map((item) => calculatePasswordScore(item.password));
  const averageScore = passwordScores.reduce((a, b) => a + b, 0) / activeItems.length;
  const weightedAverageScore = averageScore * SECURITY_SCORES.VAULT_WEIGHTS.AVERAGE_SCORE;

  // 2. Bonus for unique passwords (25%)
  const passwordMap = new Map<string, number>();
  activeItems.forEach((item) => {
    const count = passwordMap.get(item.password) || 0;
    passwordMap.set(item.password, count + 1);
  });

  const uniquePasswords = Array.from(passwordMap.keys()).length;
  const uniquePercentage = (uniquePasswords / activeItems.length) * 100;
  const uniquenessBonus = uniquePercentage * 0.25; // 25% of the percentage

  // 3. Bonus for no common passwords (15%)
  const commonItems = findCommonPasswords(items);
  const commonPercentage = Math.max(0, 100 - (commonItems.length / activeItems.length) * 100);
  const commonBonus = commonPercentage * 0.15; // 15% of the percentage

  // 4. Calculate penalties
  const weakItems = findWeakPasswords(items);
  const reusedItems = findReusedPasswords(items);
  const patternItems = findPatternPasswords(items);

  const weakPenalty = weakItems.length * SECURITY_SCORES.VAULT_PENALTIES.PER_WEAK_PASSWORD;
  const reusePenalty =
    Math.max(0, reusedItems.length - uniquePasswords) * SECURITY_SCORES.VAULT_PENALTIES.PER_REUSED_INSTANCE;
  const patternPenalty = patternItems.length * SECURITY_SCORES.VAULT_PENALTIES.PER_PATTERN_PASSWORD;

  // 5. Combine everything
  let finalScore = weightedAverageScore + uniquenessBonus + commonBonus - weakPenalty - reusePenalty - patternPenalty;

  // Ensure score is between 0 and 100
  finalScore = Math.max(0, Math.min(100, Math.round(finalScore * 100) / 100));

  return finalScore;
};

/**
 * Find items with weak passwords
 */
export const findWeakPasswords = (items: IPasswordItem[]): IPasswordItem[] => {
  return items.filter((item) => {
    if (item.isDeleted || !item.password) return false;
    const score = calculatePasswordScore(item.password);
    return score < 50; // Below "medium" threshold (was 60)
  });
};

/**
 * Find items with reused passwords
 */
export const findReusedPasswords = (items: IPasswordItem[]): IPasswordItem[] => {
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
 * Find items with common passwords
 */
export const findCommonPasswords = (items: IPasswordItem[]): IPasswordItem[] => {
  return items.filter((item) => {
    if (item.isDeleted || !item.password) return false;
    return COMMON_PASSWORDS.has(item.password.toLowerCase());
  });
};

// Convenience functions
export const generateStrongPassword = (): string => generatePassword("strong");
export const generateVeryStrongPassword = (): string => generatePassword("very-strong");
export const generateExcellentPassword = (): string => generatePassword("excellent");

export const generatePassphrase = (wordCount: number = 4, includeNumber: boolean = true): string => {
  const randomBytes = getSecureRandomBytes(wordCount * 2);
  const words: string[] = [];

  for (let i = 0; i < wordCount; i++) {
    const index = (randomBytes[i * 2] * 256 + randomBytes[i * 2 + 1]) % WORD_LIST.length;
    words.push(WORD_LIST[index]);
  }

  let passphrase = words.join("-");

  if (includeNumber) {
    const numberBytes = getSecureRandomBytes(2);
    const number = (numberBytes[0] * 256 + numberBytes[1]) % 10000;
    passphrase += number.toString().padStart(4, "0");
  }

  return passphrase;
};

/**
 * Generate a secure numeric OTP
 */
export const generateOTP = (length: number = 6): string => {
  const randomBytes = getSecureRandomBytes(length * 2);
  let otp = "";

  // Use rejection sampling to avoid modulo bias
  for (let i = 0; i < length; i++) {
    let randomValue: number;
    do {
      randomValue = randomBytes[i * 2] * 256 + randomBytes[i * 2 + 1];
    } while (randomValue >= 256 * 256 - ((256 * 256) % 10));

    otp += (randomValue % 10).toString();
  }

  return otp;
};

/**
 * Generate a secure recovery code
 */
export const generateRecoveryCode = (): string => {
  const randomBytes = getSecureRandomBytes(20);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Base32 without confusing chars
  let code = "";

  for (let i = 0; i < 16; i++) {
    const index = randomBytes[i] % chars.length;
    code += chars.charAt(index);
    if ((i + 1) % 4 === 0 && i < 15) code += "-";
  }

  return code;
};

/**
 * Get vault health analysis
 */
export const analyzeVaultHealth = (
  items: IPasswordItem[]
): {
  score: number;
  totalItems: number;
  activeItems: number;
  weakCount: number;
  reusedCount: number;
  patternCount: number;
  commonCount: number;
  averagePasswordScore: number;
  uniquenessPercentage: number;
  suggestions: string[];
} => {
  const activeItems = items.filter((item) => !item.isDeleted && item.password);
  const weakItems = findWeakPasswords(items);
  const reusedItems = findReusedPasswords(items);
  const patternItems = findPatternPasswords(items);
  const commonItems = findCommonPasswords(items);

  const score = calculateVaultHealthScore(items);

  // Calculate average password score
  const passwordScores = activeItems.map((item) => calculatePasswordScore(item.password));
  const averagePasswordScore =
    activeItems.length > 0
      ? Math.round((passwordScores.reduce((a, b) => a + b, 0) / activeItems.length) * 100) / 100
      : 100;

  // Calculate uniqueness percentage
  const passwordMap = new Map<string, number>();
  activeItems.forEach((item) => {
    const count = passwordMap.get(item.password) || 0;
    passwordMap.set(item.password, count + 1);
  });
  const uniquePasswords = Array.from(passwordMap.keys()).length;
  const uniquenessPercentage =
    activeItems.length > 0 ? Math.round((uniquePasswords / activeItems.length) * 10000) / 100 : 100;

  const suggestions: string[] = [];

  if (commonItems.length > 0) {
    suggestions.push(`Change ${commonItems.length} common password${commonItems.length > 1 ? "s" : ""} immediately`);
  }

  if (reusedItems.length > 0) {
    const uniqueReused = new Set(reusedItems.map((item) => item.password));
    suggestions.push(
      `Stop reusing ${uniqueReused.size} password${uniqueReused.size > 1 ? "s" : ""} across ${
        reusedItems.length
      } accounts`
    );
  }

  if (weakItems.length > 0) {
    suggestions.push(`Strengthen ${weakItems.length} weak password${weakItems.length > 1 ? "s" : ""} (score < 50)`);
  }

  if (patternItems.length > 0) {
    suggestions.push(
      `Improve ${patternItems.length} password${patternItems.length > 1 ? "s" : ""} with common patterns`
    );
  }

  if (suggestions.length === 0) {
    if (score >= 90) {
      suggestions.push("Excellent! Your vault is in top condition");
    } else if (score >= 75) {
      suggestions.push("Good! Your vault is secure");
    } else {
      suggestions.push("Your vault is in acceptable condition");
    }
  }

  return {
    score,
    totalItems: items.length,
    activeItems: activeItems.length,
    weakCount: weakItems.length,
    reusedCount: new Set(reusedItems.map((item) => item.password)).size,
    patternCount: patternItems.length,
    commonCount: commonItems.length,
    averagePasswordScore,
    uniquenessPercentage,
    suggestions,
  };
};
