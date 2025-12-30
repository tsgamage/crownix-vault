# Password Utilities Documentation

## Overview

The `pwd.utils.ts` module provides comprehensive password generation, analysis, and security assessment functionality for a production-ready password manager. This module implements military-grade security practices, exact scoring algorithms, and comprehensive pattern detection.

## Table of Contents

1. [Types & Interfaces](#types--interfaces)
2. [Character Sets](#character-sets)
3. [Strength Presets](#strength-presets)
4. [Core Functions](#core-functions)
5. [Password Analysis](#password-analysis)
6. [Pattern Detection](#pattern-detection)
7. [Vault Health Assessment](#vault-health-assessment)
8. [Convenience Functions](#convenience-functions)
9. [Security Considerations](#security-considerations)
10. [Usage Examples](#usage-examples)

## Types & Interfaces

### PasswordStrength

```typescript
type PasswordStrength = "very-weak" | "weak" | "medium" | "strong" | "very-strong" | "excellent";
```

Password strength classification based on exact scoring (0-100).

### PasswordOptions

```typescript
interface PasswordOptions {
  length?: number;               // Desired password length
  strength?: PasswordStrength;   // Strength preset to use
  includeUppercase?: boolean;    // Include A-Z
  includeLowercase?: boolean;    // Include a-z
  includeNumbers?: boolean;      // Include 0-9
  includeSpecial?: boolean;      // Include special characters
  excludeSimilar?: boolean;      // Exclude i, l, 1, o, 0, O
  excludeAmbiguous?: boolean;    // Exclude {}[]()/\'"`~,;:.<>
  excludeSequential?: boolean;   // Exclude sequences like abc, 123
  excludeRepeated?: boolean;     // Exclude repeated chars like aaa
}
```

### PasswordAnalysis

```typescript
interface PasswordAnalysis {
  password: string;            // The analyzed password
  entropy: number;             // Entropy in bits
  strength: PasswordStrength;  // Strength classification
  score: number;               // Exact score (0-100)
  weaknesses: string[];        // List of weaknesses found
  suggestions: string[];       // Improvement suggestions
  details: {                   // Detailed breakdown
    length: number;            // Password length
    hasUppercase: boolean;     // Contains uppercase letters
    hasLowercase: boolean;     // Contains lowercase letters
    hasNumbers: boolean;       // Contains numbers
    hasSpecial: boolean;       // Contains special characters
    charsetSize: number;       // Effective character set size
    patternScore: number;      // Pattern avoidance score (0-100)
    reuseCount: number;        // Times password is reused (vault context)
  };
}
```

## Character Sets

The module uses carefully curated character sets to avoid confusion:

```typescript
const CHAR_SETS = {
  uppercase: "ABCDEFGHJKLMNPQRSTUVWXYZ", // Removed I, O
  lowercase: "abcdefghijkmnpqrstuvwxyz", // Removed l, o
  numbers: "23456789",                   // Removed 0, 1
  special: "!@#$%^&*_-+=?",
  extendedSpecial: "!@#$%^&*()_-+=[]{}|;:,.<>?",
  hex: "ABCDEF0123456789",
  alphanumeric: "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789",
  pronounceable: "bcdfghjklmnpqrstvwxyzaeiou"
};
```

## Strength Presets

Predefined strength configurations:

| Strength | Length | Uppercase | Lowercase | Numbers | Special | Exclude Similar | Exclude Ambiguous | Exclude Sequential | Exclude Repeated |
|----------|--------|-----------|-----------|---------|---------|-----------------|-------------------|-------------------|------------------|
| very-weak | 6 | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| weak | 8 | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✓ |
| medium | 12 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| strong | 16 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| very-strong | 20 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| excellent | 24 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

## Core Functions

### `generatePassword(options?: PasswordOptions | PasswordStrength): string`

Generates a secure password with configurable options.

**Parameters:**
- `options` (optional): Either a `PasswordOptions` object or a `PasswordStrength` string preset

**Returns:** Generated password string

**Example:**
```typescript
// Using strength preset
const password1 = generatePassword("strong");
// Output: "J8k#n2P!qR9tY4wX"

// Using custom options
const password2 = generatePassword({
  length: 20,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSpecial: true,
  excludeSimilar: true,
  excludeAmbiguous: true
});
// Output: "H7m#n3K!pR8tV2wZ@q9"
```

### `calculatePasswordEntropy(password: string): number`

Calculates the exact entropy of a password in bits.

**Parameters:**
- `password`: The password to analyze

**Returns:** Entropy value in bits

**Example:**
```typescript
const entropy = calculatePasswordEntropy("MySecureP@ssw0rd");
// Output: 78.4
```

### `calculatePasswordScore(password: string): number`

Calculates an exact security score (0-100) for a password.

**Scoring Breakdown:**
- 40% - Entropy (information theory)
- 20% - Length adequacy
- 20% - Character variety
- 20% - Pattern avoidance (negative)

**Parameters:**
- `password`: The password to score

**Returns:** Score from 0 to 100

**Example:**
```typescript
const score = calculatePasswordScore("P@ssw0rd123");
// Output: 45.2
```

### `getPasswordStrength(password: string): PasswordStrength`

Classifies password strength based on exact scoring.

**Score Ranges:**
- 0-19: `very-weak`
- 20-39: `weak`
- 40-59: `medium`
- 60-79: `strong`
- 80-89: `very-strong`
- 90-100: `excellent`

**Parameters:**
- `password`: The password to classify

**Returns:** Strength classification

**Example:**
```typescript
const strength = getPasswordStrength("Tr0ub4dor&3");
// Output: "medium"
```

## Password Analysis

### `analyzePassword(password: string): PasswordAnalysis`

Comprehensive password analysis with detailed breakdown.

**Parameters:**
- `password`: The password to analyze

**Returns:** Complete `PasswordAnalysis` object

**Example:**
```typescript
const analysis = analyzePassword("Password123");

console.log(analysis);
/*
{
  password: "Password123",
  entropy: 42.7,
  strength: "weak",
  score: 25.3,
  weaknesses: [
    "Missing special characters",
    "Contains dictionary word",
    "Password is too short (11 characters)"
  ],
  suggestions: [
    "Add special characters (!@#$%^&* etc.)",
    "Avoid common dictionary words",
    "Use at least 12 characters"
  ],
  details: {
    length: 11,
    hasUppercase: true,
    hasLowercase: true,
    hasNumbers: true,
    hasSpecial: false,
    charsetSize: 62,
    patternScore: 65,
    reuseCount: 0
  }
}
*/
```

### `analyzePasswordPatterns(password: string): PatternAnalysis`

Analyzes password for common patterns and provides suggestions.

**Returns:**
```typescript
{
  hasPatterns: boolean;      // Whether patterns were detected
  patterns: string[];        // List of detected patterns
  patternScore: number;      // Pattern avoidance score (0-100)
  suggestions: string[];     // Improvement suggestions
}
```

**Example:**
```typescript
const patternAnalysis = analyzePasswordPatterns("qwerty123");

console.log(patternAnalysis);
/*
{
  hasPatterns: true,
  patterns: [
    "Keyboard walk pattern detected",
    "Sequential numbers detected"
  ],
  patternScore: 35,
  suggestions: [
    "Avoid keyboard patterns like 'qwerty', 'asdfgh'",
    "Avoid sequences like 'abc', '123'"
  ]
}
*/
```

## Pattern Detection Functions

### `hasSequentialChars(password: string, minLength: number = 3): boolean`

Checks for sequential characters (abc, 123, etc.).

**Parameters:**
- `password`: Password to check
- `minLength`: Minimum sequence length to detect (default: 3)

**Returns:** Boolean indicating if sequential chars are found

### `hasKeyboardWalk(password: string): boolean`

Detects keyboard walking patterns (qwerty, asdfgh, etc.).

### `hasRepeatedChars(password: string, minRepeat: number = 3): boolean`

Checks for repeated characters (aaa, 111, etc.).

### `hasDatePattern(password: string): boolean`

Detects date patterns (1990, 0101, YYYY-MM-DD, etc.).

### `hasLeetPattern(password: string): boolean`

Detects l33t speak patterns (P@ssw0rd, h4x0r, etc.).

### `hasDictionaryWord(password: string): boolean`

Checks for common dictionary words in password.

### `hasPersonalInfoPattern(password: string): boolean`

Detects patterns that might contain personal information.

### `findPatternPasswords(items: IPasswordItem[]): IPasswordItem[]`

Finds all items with passwords containing common patterns.

**Parameters:**
- `items`: Array of password items

**Returns:** Filtered array of items with pattern passwords

## Vault Health Assessment

### `calculateVaultHealthScore(items: IPasswordItem[]): number`

Calculates exact vault health score (0-100).

**Scoring Formula:**
- 40% - Average password entropy
- 25% - Weak password penalty (negative)
- 20% - Password reuse penalty (negative)
- 15% - Pattern password penalty (negative)
- Additional severe penalty for common passwords

**Parameters:**
- `items`: Array of password vault items

**Returns:** Health score from 0 to 100

**Example:**
```typescript
const vaultScore = calculateVaultHealthScore(passwordItems);
// Output: 78.5
```

### `analyzeVaultHealth(items: IPasswordItem[]): VaultAnalysis`

Comprehensive vault health analysis.

**Returns:**
```typescript
{
  score: number;           // Overall health score
  totalItems: number;      // Total items in vault
  activeItems: number;     // Non-deleted items
  weakCount: number;       // Weak passwords count
  reusedCount: number;     // Unique reused passwords
  patternCount: number;    // Passwords with patterns
  commonCount: number;     // Common passwords count
  suggestions: string[];   // Improvement suggestions
}
```

**Example:**
```typescript
const vaultAnalysis = analyzeVaultHealth(vaultItems);

console.log(vaultAnalysis);
/*
{
  score: 65.3,
  totalItems: 42,
  activeItems: 38,
  weakCount: 7,
  reusedCount: 3,
  patternCount: 12,
  commonCount: 2,
  suggestions: [
    "Change 2 common passwords",
    "Stop reusing 3 passwords across multiple sites",
    "Strengthen 7 weak passwords",
    "Fix 12 passwords with common patterns"
  ]
}
*/
```

### `findWeakPasswords(items: IPasswordItem[]): IPasswordItem[]`

Finds passwords with score < 60.

### `findReusedPasswords(items: IPasswordItem[]): IPasswordItem[]`

Finds all reused passwords in vault.

### `findCommonPasswords(items: IPasswordItem[]): IPasswordItem[]`

Finds passwords in common passwords list.

### `getActiveItems(items: IPasswordItem[]): IPasswordItem[]`

Filters out deleted items.

## Convenience Functions

### `generateStrongPassword(): string`

Generates a strong password (16 chars, all char types).

**Returns:** Strong password string

### `generateVeryStrongPassword(): string`

Generates a very strong password (20 chars, all char types).

### `generateExcellentPassword(): string`

Generates an excellent password (24 chars, all char types).

### `generatePassphrase(wordCount: number = 4, includeNumber: boolean = true): string`

Generates a memorable passphrase.

**Parameters:**
- `wordCount`: Number of words (default: 4)
- `includeNumber`: Append random number (default: true)

**Returns:** Passphrase string

**Example:**
```typescript
const passphrase = generatePassphrase(4, true);
// Output: "brave-cloud-dragon-eagle-4297"
```

### `generateOTP(length: number = 6): string`

Generates a secure numeric OTP.

**Parameters:**
- `length`: OTP length (default: 6)

**Returns:** OTP string

**Example:**
```typescript
const otp = generateOTP(6);
// Output: "429173"
```

### `generateRecoveryCode(): string`

Generates a secure recovery code.

**Returns:** Recovery code in format "XXXX-XXXX-XXXX-XXXX"

**Example:**
```typescript
const recoveryCode = generateRecoveryCode();
// Output: "J8K3-N2P1-QR9T-Y4WX"
```

## Security Considerations

### Randomness Sources

The module uses cryptographically secure random sources:

1. **Browser:** `window.crypto.getRandomValues()`
2. **Node.js:** `crypto.randomBytes()`
3. **Fallback:** `Math.random()` with warning (not secure)

### Character Set Security

- Excludes visually similar characters (I, l, 1, O, 0)
- Provides option to exclude ambiguous special characters
- Uses rejection sampling to avoid modulo bias

### Pattern Detection

The module detects:
- Sequential characters (abc, 123, 987)
- Keyboard walks (qwerty, asdfgh, 1qaz)
- Repeated patterns (aaa, 111, ababab)
- Date patterns (1990, 0101, YYYY-MM-DD)
- L33t speak (P@ssw0rd, h4x0r)
- Dictionary words
- Personal information patterns

### Performance Considerations

- All pattern detection uses efficient algorithms
- Common password checking uses `Set` for O(1) lookups
- Large password lists (1M+) are supported with efficient memory usage

## Usage Examples

### Basic Password Generation

```typescript
import { 
  generatePassword, 
  generatePassphrase,
  analyzePassword 
} from './pwd.utils';

// Generate a strong password
const password = generatePassword("strong");

// Generate a passphrase
const passphrase = generatePassphrase(5, true);

// Analyze password security
const analysis = analyzePassword(password);
console.log(`Strength: ${analysis.strength}, Score: ${analysis.score}`);
```

### Vault Health Monitoring

```typescript
import { 
  analyzeVaultHealth,
  findWeakPasswords,
  findReusedPasswords 
} from './pwd.utils';

// Get comprehensive vault analysis
const vaultHealth = analyzeVaultHealth(vaultItems);

// Find specific issues
const weakPasswords = findWeakPasswords(vaultItems);
const reusedPasswords = findReusedPasswords(vaultItems);

// Take action based on results
if (vaultHealth.score < 70) {
  console.warn("Vault needs improvement:", vaultHealth.suggestions);
}
```

### Password Policy Enforcement

```typescript
import { 
  analyzePassword,
  getPasswordStrength,
  hasCommonPatterns 
} from './pwd.utils';

function validatePassword(password: string): {
  isValid: boolean;
  message: string;
} {
  const analysis = analyzePassword(password);
  
  if (analysis.score < 60) {
    return {
      isValid: false,
      message: `Password is too weak (score: ${analysis.score}). ${analysis.suggestions[0]}`
    };
  }
  
  if (hasCommonPatterns(password)) {
    return {
      isValid: false,
      message: "Password contains common patterns that are easy to guess"
    };
  }
  
  return {
    isValid: true,
    message: "Password meets security requirements"
  };
}
```

### Integration with UI Components

```typescript
import { 
  calculatePasswordScore,
  getPasswordStrength,
  analyzePasswordPatterns 
} from './pwd.utils';

// Real-time password strength meter
function updatePasswordStrength(password: string) {
  const score = calculatePasswordScore(password);
  const strength = getPasswordStrength(password);
  const patterns = analyzePasswordPatterns(password);
  
  return {
    score,
    strength,
    hasPatterns: patterns.hasPatterns,
    suggestions: patterns.suggestions
  };
}

// Use in React/Vue component
const strengthInfo = updatePasswordStrength(userInput);
// Update UI based on strengthInfo
```

## Error Handling

The module throws specific errors for common issues:

```typescript
try {
  const password = generatePassword({
    length: 4,  // Too short for character types
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: true
  });
} catch (error) {
  if (error.message.includes("Password length must be at least")) {
    // Handle insufficient length
  } else if (error.message.includes("At least one character type must be included")) {
    // Handle no character types selected
  }
}
```

## Best Practices

1. **Always use the highest strength preset** for sensitive accounts
2. **Regularly run vault health checks** to identify issues
3. **Educate users** about password patterns and weaknesses
4. **Implement password expiration** for critical accounts
5. **Use passphrases** for memorable yet secure passwords
6. **Monitor for password reuse** across different services
7. **Keep the common passwords list updated** regularly

## Testing

The module is designed for reliability. Recommended test cases:

```typescript
// Test password generation
test('generates password with specified length', () => {
  const password = generatePassword({ length: 12 });
  expect(password.length).toBe(12);
});

// Test strength classification
test('classifies password strength correctly', () => {
  const strength = getPasswordStrength("P@ssw0rd123");
  expect(strength).toBe("weak");
});

// Test pattern detection
test('detects keyboard walks', () => {
  const hasWalk = hasKeyboardWalk("qwerty123");
  expect(hasWalk).toBe(true);
});

// Test vault health calculation
test('calculates vault health score', () => {
  const score = calculateVaultHealthScore(testItems);
  expect(score).toBeGreaterThanOrEqual(0);
  expect(score).toBeLessThanOrEqual(100);
});
```

## Contributing

When extending this module:

1. **Maintain backward compatibility** with existing APIs
2. **Add comprehensive tests** for new functionality
3. **Update documentation** for all new features
4. **Follow security best practices** for cryptography
5. **Performance test** with large datasets (1M+ passwords)

## License & Credits

This module implements industry-standard password security practices based on:

- NIST Special Publication 800-63B
- OWASP Authentication Cheat Sheet
- Common password pattern research
- Cryptography best practices

For production use, ensure compliance with relevant security standards and regulations in your jurisdiction.