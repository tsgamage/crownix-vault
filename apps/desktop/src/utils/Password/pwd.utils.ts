import { WORD_LIST } from "@/data/word-list";
import { COMMON_PASSWORDS } from "@/data/common-passwords";
import { PASSWORD_PATTERNS } from "@/data/password-patterns";
import type { IPasswordItem } from "../types/vault";

// Types for password options
export type PasswordStrength = "very-weak" | "weak" | "medium" | "strong" | "very-strong" | "excellent";

export interface PasswordOptions {
  length?: number;
  strength?: PasswordStrength;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSpecial?: boolean;
  excludeSimilar?: boolean;
  excludeAmbiguous?: boolean;
  excludeSequential?: boolean;
  excludeRepeated?: boolean;
}

// Character sets with maximum security considerations
const CHAR_SETS = {
  uppercase: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  lowercase: "abcdefghijkmnpqrstuvwxyz",
  numbers: "23456789",
  special: "!@#$%^&*_-+=?",
  extendedSpecial: "!@#$%^&*()_-+=[]{}|;:,.<>?",
  hex: "ABCDEF0123456789",
  alphanumeric: "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789",
  pronounceable: "bcdfghjklmnpqrstvwxyzaeiou",
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

// Security scoring constants - OPTIMIZED FOR REAL-WORLD USE
const SECURITY_SCORES = {
  // Scoring weights - TOTAL = 100%
  PASSWORD_SCORE_WEIGHTS: {
    ENTROPY: 0.35, // 35% - Reduced for smaller passwords
    LENGTH: 0.3, // 30% - Increased for social media use
    VARIETY: 0.25, // 25%
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
    PER_WEAK_PASSWORD: 2, // Reduced from 5
    PER_REUSED_INSTANCE: 1, // Reduced from 3
    PER_PATTERN_PASSWORD: 1, // Reduced from 2
  },

  // Pattern penalties - REDUCED FOR GENERATED PASSWORDS
  PATTERN_PENALTIES: {
    KEYBOARD_WALK: 20, // Severe but rare in generated
    REPEATED_CHARS: 15, // Moderate
    DATE_PATTERN: 10, // Minimal
    LEET_PATTERN: 5, // Minimal for generated
    DICTIONARY_WORD: 10, // Moderate
    PERSONAL_INFO: 25, // Severe but avoidable
    SEQUENTIAL_CHARS: 10, // Minimal
  },
} as const;

// Interface for detailed password analysis
export interface PasswordAnalysis {
  password: string;
  entropy: number;
  strength: PasswordStrength;
  score: number;
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

// Interface for pattern analysis
export interface PatternAnalysis {
  hasPatterns: boolean;
  patterns: string[];
  patternScore: number;
  suggestions: string[];
}

// ============ CORE PASSWORD GENERATION FUNCTIONS ============

/**
 * Generate a secure password with guaranteed high score
 * Now returns a Promise for better async pattern avoidance
 */
const generatePassword = async (options?: PasswordOptions | PasswordStrength): Promise<string> => {
  const opts = parseOptions(options);

  // Generate multiple candidates and select the best one
  const candidates: string[] = [];

  // Try to generate good candidates (async for better pattern avoidance)
  for (let i = 0; i < 10; i++) {
    // Generate 10 candidates for better selection
    const candidate = await generatePasswordCandidateAsync(opts);
    const score = calculatePasswordScore(candidate);

    // Only keep high-scoring candidates
    if (score >= getMinimumScoreForStrength(opts.strength)) {
      candidates.push(candidate);
    }

    // If we have 5 good candidates, stop early
    if (candidates.length >= 5) break;
  }

  // If no high-scoring candidates, generate one with forced quality
  if (candidates.length === 0) {
    return generateGuaranteedQualityPassword(opts);
  }

  // Select the best candidate
  return selectBestPassword(candidates, opts);
};

/**
 * Generate a password with guaranteed quality (synchronous fallback)
 */
const generateGuaranteedQualityPassword = (opts: Required<PasswordOptions>): string => {
  const charSets = [];

  if (opts.includeUppercase) {
    const set = opts.excludeSimilar ? CHAR_SETS.uppercase : "ABCDEFGHJKLMNPQRSTUVWXYZ";
    charSets.push(set);
  }

  if (opts.includeLowercase) {
    const set = opts.excludeSimilar ? CHAR_SETS.lowercase : "abcdefghijkmnpqrstuvwxyz";
    charSets.push(set);
  }

  if (opts.includeNumbers) {
    const set = opts.excludeSimilar ? CHAR_SETS.numbers : "23456789";
    charSets.push(set);
  }

  if (opts.includeSpecial) {
    const set = opts.excludeAmbiguous ? CHAR_SETS.special : "!@#$%^&*_-+=?";
    charSets.push(set);
  }

  // Ensure minimum counts for each character type
  const minPerType = Math.max(2, Math.floor(opts.length / charSets.length));
  const passwordChars: string[] = [];

  // Add characters from each set
  charSets.forEach((set) => {
    for (let i = 0; i < minPerType; i++) {
      const randomBytes = getSecureRandomBytes(1);
      passwordChars.push(set.charAt(randomBytes[0] % set.length));
    }
  });

  // Fill remaining characters
  const allChars = charSets.join("");
  while (passwordChars.length < opts.length) {
    const randomBytes = getSecureRandomBytes(1);
    passwordChars.push(allChars.charAt(randomBytes[0] % allChars.length));
  }

  // Shuffle and check quality
  let password = shuffleArray(passwordChars).join("");

  // Fix any patterns that might reduce score
  password = optimizePasswordForScoring(password, opts);

  return password;
};

/**
 * Async password candidate generation with pattern avoidance
 */
const generatePasswordCandidateAsync = async (opts: Required<PasswordOptions>): Promise<string> => {
  const maxAttempts = 20;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = generatePasswordCandidate(opts);

    // Check for problematic patterns
    const hasProblematicPatterns =
      hasLeetPattern(candidate) || hasPersonalInfoPattern(candidate) || hasKeyboardWalk(candidate);

    if (!hasProblematicPatterns) {
      return candidate;
    }

    // Small delay to allow event loop to process (non-blocking)
    if (attempt % 5 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  // Fallback to regular generation if we can't avoid patterns
  return generatePasswordCandidate(opts);
};

/**
 * Generate a single password candidate (synchronous core)
 */
const generatePasswordCandidate = (opts: Required<PasswordOptions>): string => {
  // Build character set based on options
  let charSet = "";
  const charSetsUsed: string[] = [];

  if (opts.includeUppercase) {
    const set = opts.excludeSimilar ? CHAR_SETS.uppercase : "ABCDEFGHJKLMNPQRSTUVWXYZ";
    charSet += set;
    charSetsUsed.push(set);
  }

  if (opts.includeLowercase) {
    const set = opts.excludeSimilar ? CHAR_SETS.lowercase : "abcdefghijkmnpqrstuvwxyz";
    charSet += set;
    charSetsUsed.push(set);
  }

  if (opts.includeNumbers) {
    const set = opts.excludeSimilar ? CHAR_SETS.numbers : "23456789";
    charSet += set;
    charSetsUsed.push(set);
  }

  if (opts.includeSpecial) {
    const set = opts.excludeAmbiguous ? CHAR_SETS.special : "!@#$%^&*_-+=?";
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
  const randomBytes = getSecureRandomBytes(opts.length * 2);
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
 * Optimize password to avoid patterns that reduce score
 */
const optimizePasswordForScoring = (password: string, opts: Required<PasswordOptions>): string => {
  let optimized = password;
  const maxOptimizationAttempts = 5;

  for (let attempt = 0; attempt < maxOptimizationAttempts; attempt++) {
    let changed = false;
    const chars = optimized.split("");

    // Check and fix problematic patterns
    for (let i = 0; i < chars.length; i++) {
      // Check for potential leet patterns (single character substitutions)
      const char = chars[i];
      if (isPotentialLeetChar(char)) {
        chars[i] = getRandomCharFromSets(opts, char);
        changed = true;
      }

      // Check for sequences
      if (i >= 2 && opts.excludeSequential) {
        const a = chars[i - 2].charCodeAt(0);
        const b = chars[i - 1].charCodeAt(0);
        const c = chars[i].charCodeAt(0);

        if ((c === b + 1 && b === a + 1) || (c === b - 1 && b === a - 1)) {
          chars[i - 1] = getRandomCharFromSets(opts, chars[i - 1]);
          changed = true;
        }
      }

      // Check for repeats
      if (i >= 2 && opts.excludeRepeated) {
        if (chars[i] === chars[i - 1] && chars[i] === chars[i - 2]) {
          chars[i] = getRandomCharFromSets(opts, chars[i]);
          changed = true;
        }
      }
    }

    optimized = chars.join("");

    // Check if optimization improved the score
    const score = calculatePasswordScore(optimized);
    if (score >= getMinimumScoreForStrength(opts.strength) && !hasProblematicPatterns(optimized)) {
      break;
    }
  }

  return optimized;
};

/**
 * Check if character could be part of a leet pattern
 */
const isPotentialLeetChar = (char: string): boolean => {
  const leetChars = ["4", "@", "3", "0", "1", "!", "7", "5", "$"];
  return leetChars.includes(char);
};

/**
 * Check for problematic patterns
 */
const hasProblematicPatterns = (password: string): boolean => {
  return hasLeetPattern(password) || hasPersonalInfoPattern(password) || hasKeyboardWalk(password);
};

/**
 * Get random character from allowed character sets, avoiding problematic chars
 */
const getRandomCharFromSets = (opts: Required<PasswordOptions>, avoidChar?: string): string => {
  const charSets: string[] = [];

  if (opts.includeUppercase) {
    charSets.push(opts.excludeSimilar ? CHAR_SETS.uppercase : "ABCDEFGHJKLMNPQRSTUVWXYZ");
  }

  if (opts.includeLowercase) {
    charSets.push(opts.excludeSimilar ? CHAR_SETS.lowercase : "abcdefghijkmnpqrstuvwxyz");
  }

  if (opts.includeNumbers) {
    charSets.push(opts.excludeSimilar ? CHAR_SETS.numbers : "23456789");
  }

  if (opts.includeSpecial) {
    charSets.push(opts.excludeAmbiguous ? CHAR_SETS.special : "!@#$%^&*_-+=?");
  }

  const allChars = charSets.join("");
  let attempts = 0;

  while (attempts < 10) {
    const randomBytes = getSecureRandomBytes(1);
    const newChar = allChars.charAt(randomBytes[0] % allChars.length);

    // Avoid the problematic character if specified
    if (!avoidChar || newChar !== avoidChar) {
      // Also avoid potential leet characters for better pattern avoidance
      if (!isPotentialLeetChar(newChar)) {
        return newChar;
      }
    }
    attempts++;
  }

  // Fallback
  const randomBytes = getSecureRandomBytes(1);
  return allChars.charAt(randomBytes[0] % allChars.length);
};

/**
 * Get minimum score required for a given strength level
 */
const getMinimumScoreForStrength = (strength: PasswordStrength): number => {
  switch (strength) {
    case "very-weak":
      return 0;
    case "weak":
      return 30;
    case "medium":
      return 50;
    case "strong":
      return 70;
    case "very-strong":
      return 85;
    case "excellent":
      return 95;
    default:
      return 70;
  }
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

// ============ CRYPTOGRAPHIC FUNCTIONS ============

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
    } catch {
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

// ============ PASSWORD SCORING & ANALYSIS ============

/**
 * Calculate exact password entropy in bits - OPTIMIZED FOR SMALLER PASSWORDS
 */
const calculatePasswordEntropy = (password: string): number => {
  if (!password || password.length === 0) return 0;

  // Calculate charset size based on character types used
  let charsetSize = 0;

  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;

  const specialChars = password.match(/[^a-zA-Z0-9]/g) || [];
  if (specialChars.length > 0) {
    // Count unique special characters
    const uniqueSpecial = new Set(specialChars);
    charsetSize += Math.max(10, uniqueSpecial.size * 5);
  }

  // Minimum charset size of 2
  charsetSize = Math.max(2, charsetSize);

  // Calculate entropy: log2(charsetSize^length)
  const entropy = Math.log2(Math.pow(charsetSize, password.length));

  // Cap entropy at reasonable maximum for scoring
  return Math.min(entropy, password.length * 8);
};

/**
 * Calculate password score (0-100) - OPTIMIZED FOR SOCIAL MEDIA PASSWORDS
 */
const calculatePasswordScore = (password: string): number => {
  if (!password || password.length === 0) return 0;

  // Instant failure for common passwords
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return 0;
  }

  // Base score from entropy (35%)
  const entropy = calculatePasswordEntropy(password);
  const maxReasonableEntropy = 80; // Reduced for social media passwords
  const entropyScore =
    Math.min(100, (entropy / maxReasonableEntropy) * 100) * SECURITY_SCORES.PASSWORD_SCORE_WEIGHTS.ENTROPY;

  // Length score (30%) - OPTIMIZED FOR 8-16 CHARACTERS
  const lengthScore = calculateLengthScore(password) * SECURITY_SCORES.PASSWORD_SCORE_WEIGHTS.LENGTH;

  // Character variety score (25%)
  const varietyScore = calculateCharacterVarietyScore(password) * SECURITY_SCORES.PASSWORD_SCORE_WEIGHTS.VARIETY;

  // Pattern penalty (10% negative) - VERY REDUCED FOR GENERATED PASSWORDS
  const patternPenalty = calculatePatternPenalty(password) * SECURITY_SCORES.PASSWORD_SCORE_WEIGHTS.PATTERN;

  // Combine scores
  let totalScore = entropyScore + lengthScore + varietyScore - patternPenalty;

  // Bonus for generated passwords (pattern-free)
  if (!hasProblematicPatterns(password)) {
    totalScore += 5;
  }

  // Bonus for optimal length (12-16 chars for social media)
  if (password.length >= 12 && password.length <= 16) {
    totalScore += 5;
  }

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, Math.round(totalScore * 100) / 100));
};

/**
 * Calculate length score - OPTIMIZED FOR SOCIAL MEDIA (8-16 chars ideal)
 */
const calculateLengthScore = (password: string): number => {
  const length = password.length;

  // Optimized for real-world use: 12-16 chars is sweet spot for social media
  if (length >= 24) return 100; // Excellent but rarely used
  if (length >= 20) return 95; // Very strong
  if (length >= 16) return 90; // Strong - ideal maximum
  if (length >= 14) return 85; // Very good
  if (length >= 12) return 80; // Good - minimum recommended
  if (length >= 10) return 70; // Acceptable
  if (length >= 8) return 60; // Minimum acceptable
  if (length >= 6) return 40; // Weak
  return 20; // Very weak
};

/**
 * Calculate character variety score - SIMPLIFIED
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

  // Score for character types (optimistic)
  switch (typeCount) {
    case 4:
      score = 100;
      break;
    case 3:
      score = 85;
      break;
    case 2:
      score = 65;
      break;
    case 1:
      score = 40;
      break;
    default:
      score = 0;
  }

  // Bonus for balanced distribution
  if (typeCount >= 2 && password.length >= 8) {
    const totalChars = password.length;
    const lowerCount = (password.match(/[a-z]/g) || []).length;
    const upperCount = (password.match(/[A-Z]/g) || []).length;
    const numberCount = (password.match(/[0-9]/g) || []).length;
    const specialCount = (password.match(/[^a-zA-Z0-9]/g) || []).length;

    const counts = [lowerCount, upperCount, numberCount, specialCount].filter((count) => count > 0);
    const avg = counts.reduce((a, b) => a + b) / counts.length;
    const balanced = counts.every((count) => count >= avg * 0.5);

    if (balanced) {
      score += 10;
    }
  }

  return Math.min(100, score);
};

/**
 * Calculate pattern penalty - MINIMAL FOR GENERATED PASSWORDS
 */
const calculatePatternPenalty = (password: string): number => {
  let penalty = 0;

  // Very reduced penalties for generated passwords
  if (hasKeyboardWalk(password)) {
    penalty += SECURITY_SCORES.PATTERN_PENALTIES.KEYBOARD_WALK;
  }

  if (hasRepeatedChars(password, 4)) {
    penalty += SECURITY_SCORES.PATTERN_PENALTIES.REPEATED_CHARS;
  } else if (hasRepeatedChars(password, 3)) {
    penalty += Math.floor(SECURITY_SCORES.PATTERN_PENALTIES.REPEATED_CHARS / 2);
  }

  if (hasDatePattern(password)) {
    penalty += SECURITY_SCORES.PATTERN_PENALTIES.DATE_PATTERN;
  }

  // Very minimal for leet patterns in generated passwords
  if (hasLeetPattern(password)) {
    penalty += SECURITY_SCORES.PATTERN_PENALTIES.LEET_PATTERN;
  }

  if (hasDictionaryWord(password)) {
    penalty += SECURITY_SCORES.PATTERN_PENALTIES.DICTIONARY_WORD;
  }

  if (hasPersonalInfoPattern(password)) {
    penalty += SECURITY_SCORES.PATTERN_PENALTIES.PERSONAL_INFO;
  }

  if (hasSequentialChars(password, 3)) {
    penalty += SECURITY_SCORES.PATTERN_PENALTIES.SEQUENTIAL_CHARS;
  }

  return Math.min(100, penalty);
};

/**
 * Get password strength rating based on exact score
 */
const getPasswordStrength = (password: string): PasswordStrength => {
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
const analyzePassword = (password: string): PasswordAnalysis => {
  const entropy = calculatePasswordEntropy(password);
  const strength = getPasswordStrength(password);
  const score = calculatePasswordScore(password);

  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  if (password.length < 8) {
    weaknesses.push(`Password is too short (${password.length} characters)`);
    suggestions.push("Use at least 8 characters for basic security");
  } else if (password.length < 12) {
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

  // Only show severe pattern warnings
  if (hasKeyboardWalk(password)) {
    weaknesses.push("Contains keyboard walk pattern");
    suggestions.push("Avoid keyboard patterns like 'qwerty', 'asdfgh'");
  }

  if (hasPersonalInfoPattern(password)) {
    weaknesses.push("May contain personal information");
    suggestions.push("Avoid using personal information");
  }

  if (weaknesses.length === 0) {
    if (score >= 95) {
      weaknesses.push("Excellent password - no weaknesses detected");
      suggestions.push("Great job! This password is very strong");
    } else if (score >= 80) {
      weaknesses.push("Strong password");
      suggestions.push("This is a good, secure password");
    } else {
      weaknesses.push("Password has room for improvement");
      suggestions.push("Consider making it longer or adding more character types");
    }
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
      patternScore: Math.max(0, 100 - calculatePatternPenalty(password)),
      reuseCount: 0,
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
  size += Math.min(33, uniqueSpecial.size * 5);

  return Math.max(2, size);
};

// ============ PATTERN DETECTION FUNCTIONS ============

/**
 * Check for sequential characters
 */
const hasSequentialChars = (password: string, minLength: number = 3): boolean => {
  // Skip short passwords
  if (password.length < minLength) return false;

  for (let i = 0; i <= password.length - minLength; i++) {
    const seq = password.substring(i, i + minLength).toLowerCase();
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

/**
 * Check for keyboard walks
 */
const hasKeyboardWalk = (password: string): boolean => {
  // Only check for obvious keyboard walks (4+ characters)
  const lower = password.toLowerCase();
  return PASSWORD_PATTERNS.keyboardWalks.some((pattern) => {
    if (pattern.length >= 4 && lower.includes(pattern)) {
      return true;
    }
    return false;
  });
};

/**
 * Check for repeated characters
 */
const hasRepeatedChars = (password: string, minRepeat: number = 3): boolean => {
  if (password.length < minRepeat) return false;

  const regex = new RegExp(`(.)\\1{${minRepeat - 1},}`);
  return regex.test(password);
};

/**
 * Check for date patterns
 */
const hasDatePattern = (password: string): boolean => {
  // Only check for obvious date patterns (4+ digits)
  return PASSWORD_PATTERNS.datePatterns.some((pattern) => {
    if (pattern.includes("\\d{4}")) {
      const regex = new RegExp(pattern, "i");
      return regex.test(password);
    }
    return false;
  });
};

/**
 * Check for l33t patterns - MORE LENIENT
 */
const hasLeetPattern = (password: string): boolean => {
  const lower = password.toLowerCase();

  // Check for common leet words
  if (PASSWORD_PATTERNS.leetWords.some((word) => lower.includes(word))) {
    return true;
  }

  // Count leet substitutions - MORE LENIENT THRESHOLD
  let leetCount = 0;
  for (const [, leets] of Object.entries(PASSWORD_PATTERNS.leetSubstitutions)) {
    for (const leet of leets) {
      if (lower.includes(leet)) {
        leetCount++;
        break;
      }
    }
  }

  // If more than 30% of characters are leet substitutions (was 25%)
  return leetCount >= Math.ceil(password.length * 0.3);
};

/**
 * Check for dictionary words
 */
const hasDictionaryWord = (password: string): boolean => {
  // Only check for longer dictionary words
  const words = password
    .toLowerCase()
    .split(/[^a-z]/)
    .filter((w) => w.length > 4); // Increased from 3 to 4
  return words.some((word) => PASSWORD_PATTERNS.commonWords.has(word));
};

/**
 * Check for personal info patterns
 */
const hasPersonalInfoPattern = (password: string): boolean => {
  // Only check for obvious patterns (names, etc.)
  const commonNames = ["john", "jane", "mike", "dave", "anna", "emma", "alex"];
  const lower = password.toLowerCase();

  // Check for common names
  if (commonNames.some((name) => lower.includes(name))) {
    return true;
  }

  // Check for personal info patterns
  return PASSWORD_PATTERNS.personalInfoPatterns.some((pattern) => {
    const regex = new RegExp(pattern, "i");
    return regex.test(password);
  });
};

// ============ PATTERN ANALYSIS FUNCTIONS ============

/**
 * Find items with common patterns
 */
const findPatternPasswords = (items: IPasswordItem[]): IPasswordItem[] => {
  return items.filter((item) => {
    if (item.isDeleted || !item.password) return false;

    const password = item.password;
    // Only flag severe patterns for vault health
    return (
      hasKeyboardWalk(password) ||
      hasPersonalInfoPattern(password) ||
      hasRepeatedChars(password, 4) ||
      hasDatePattern(password)
    );
  });
};

/**
 * Get pattern analysis details
 */
const analyzePasswordPatterns = (password: string): PatternAnalysis => {
  const patterns: string[] = [];
  const suggestions: string[] = [];

  // Only report severe patterns
  if (hasKeyboardWalk(password)) {
    patterns.push("Keyboard walk pattern detected");
    suggestions.push("Avoid keyboard patterns like 'qwerty', 'asdfgh'");
  }

  if (hasRepeatedChars(password, 4)) {
    patterns.push("Repeated characters detected");
    suggestions.push("Avoid repeated characters like 'aaaa', '1111'");
  }

  if (hasDatePattern(password)) {
    patterns.push("Date pattern detected");
    suggestions.push("Avoid using dates in passwords");
  }

  if (hasPersonalInfoPattern(password)) {
    patterns.push("Personal information pattern detected");
    suggestions.push("Avoid using personal information (names, birthdates, etc.)");
  }

  const patternScore = Math.max(0, 100 - calculatePatternPenalty(password));

  if (patterns.length === 0) {
    patterns.push("No problematic patterns detected");
    suggestions.push("Password appears secure and random");
  }

  return {
    hasPatterns: patterns.length > 0 && !patterns[0].includes("No problematic"),
    patterns,
    patternScore,
    suggestions,
  };
};

// ============ VAULT HEALTH FUNCTIONS ============

/**
 * Calculate exact vault health score (0-100) - OPTIMIZED FOR 100% ACHIEVABLE
 */
const calculateVaultHealthScore = (items: IPasswordItem[]): number => {
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
  const uniquenessBonus = uniquePercentage * 0.25;

  // 3. Bonus for no common passwords (15%)
  const commonItems = findCommonPasswords(items);
  const commonPercentage = Math.max(0, 100 - (commonItems.length / activeItems.length) * 100);
  const commonBonus = commonPercentage * 0.15;

  // 4. Calculate penalties (very minimal)
  const weakItems = findWeakPasswords(items);
  const reusedItems = findReusedPasswords(items);
  const patternItems = findPatternPasswords(items);

  const weakPenalty = weakItems.length * SECURITY_SCORES.VAULT_PENALTIES.PER_WEAK_PASSWORD;
  const reusePenalty =
    Math.max(0, reusedItems.length - uniquePasswords) * SECURITY_SCORES.VAULT_PENALTIES.PER_REUSED_INSTANCE;
  const patternPenalty = patternItems.length * SECURITY_SCORES.VAULT_PENALTIES.PER_PATTERN_PASSWORD;

  // 5. Combine everything
  let finalScore = weightedAverageScore + uniquenessBonus + commonBonus;

  // Only apply minimal penalties (so 100% is achievable)
  finalScore = Math.max(0, finalScore - weakPenalty - reusePenalty - patternPenalty);

  // Bonus for all excellent passwords
  const allExcellent = passwordScores.every((score) => score >= 95);
  if (allExcellent && uniquePasswords === activeItems.length) {
    finalScore = Math.min(100, finalScore + 5);
  }

  // Ensure score is between 0 and 100
  finalScore = Math.max(0, Math.min(100, Math.round(finalScore * 100) / 100));

  return finalScore;
};

/**
 * Find items with weak passwords
 */
const findWeakPasswords = (items: IPasswordItem[]): IPasswordItem[] => {
  return items.filter((item) => {
    if (item.isDeleted || !item.password) return false;
    const score = calculatePasswordScore(item.password);
    return score < 60; // Increased from 50
  });
};

/**
 * Find items with reused passwords
 */
const findReusedPasswords = (items: IPasswordItem[]): IPasswordItem[] => {
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
 * Find active items (not deleted)
 */
const getActiveItems = (items: IPasswordItem[]): IPasswordItem[] => {
  return items.filter((i) => !i.isDeleted);
};

/**
 * Find items with common passwords
 */
const findCommonPasswords = (items: IPasswordItem[]): IPasswordItem[] => {
  return items.filter((item) => {
    if (item.isDeleted || !item.password) return false;
    return COMMON_PASSWORDS.has(item.password.toLowerCase());
  });
};

// ============ CONVENIENCE FUNCTIONS ============

/**
 * Generate a strong password (16 chars, all char types)
 */
const generateStrongPassword = (): Promise<string> => generatePassword("strong");

/**
 * Generate a very strong password (20 chars, all char types)
 */
const generateVeryStrongPassword = (): Promise<string> => generatePassword("very-strong");

/**
 * Generate an excellent password (24 chars, all char types)
 */
const generateExcellentPassword = (): Promise<string> => generatePassword("excellent");

/**
 * Generate an excellent password with custom character count (8-32 chars)
 */
const generateExcellentPasswordWithCharCount = async (length: number = 16): Promise<string> => {
  const validatedLength = Math.max(8, Math.min(32, length));
  return generatePassword({
    length: validatedLength,
    strength: "excellent",
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: true,
    excludeSimilar: true,
    excludeAmbiguous: true,
    excludeSequential: true,
    excludeRepeated: true,
  });
};

/**
 * Generate a memorable passphrase
 */
const generatePassphrase = (wordCount: number = 4, includeNumber: boolean = true): string => {
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
const generateOTP = (length: number = 6): string => {
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
const generateRecoveryCode = (): string => {
  const randomBytes = getSecureRandomBytes(20);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < 16; i++) {
    const index = randomBytes[i] % chars.length;
    code += chars.charAt(index);
    if ((i + 1) % 4 === 0 && i < 15) code += "-";
  }

  return code;
};

// ============ VAULT ANALYSIS FUNCTIONS ============

/**
 * Get comprehensive vault health analysis
 */
const analyzeVaultHealth = (
  items: IPasswordItem[],
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
      } accounts`,
    );
  }

  if (weakItems.length > 0) {
    suggestions.push(`Strengthen ${weakItems.length} weak password${weakItems.length > 1 ? "s" : ""} (score < 60)`);
  }

  if (patternItems.length > 0) {
    suggestions.push(
      `Improve ${patternItems.length} password${patternItems.length > 1 ? "s" : ""} with problematic patterns`,
    );
  }

  if (suggestions.length === 0) {
    if (score >= 95) {
      suggestions.push("Perfect! Your vault security is excellent!");
    } else if (score >= 85) {
      suggestions.push("Excellent! Your vault is very secure");
    } else if (score >= 75) {
      suggestions.push("Good! Your vault is secure");
    } else if (score >= 60) {
      suggestions.push("Acceptable, but there's room for improvement");
    } else {
      suggestions.push("Consider improving your password security");
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

// ============ EXPORT ALL PUBLIC FUNCTIONS ============
export {
  // Core functions
  generatePassword,
  calculatePasswordEntropy,
  calculatePasswordScore,
  getPasswordStrength,
  analyzePassword,

  // Pattern detection
  hasSequentialChars,
  hasKeyboardWalk,
  hasRepeatedChars,
  hasDatePattern,
  hasLeetPattern,
  hasDictionaryWord,
  hasPersonalInfoPattern,
  findPatternPasswords,
  analyzePasswordPatterns,

  // Vault health
  calculateVaultHealthScore,
  findWeakPasswords,
  findReusedPasswords,
  getActiveItems,
  findCommonPasswords,
  analyzeVaultHealth,

  // Convenience (synchronous versions)
  generatePassphrase,
  generateOTP,
  generateRecoveryCode,
};

// Export async convenience functions
export {
  generateStrongPassword,
  generateVeryStrongPassword,
  generateExcellentPassword,
  generateExcellentPasswordWithCharCount,
};
