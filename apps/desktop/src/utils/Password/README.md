# Password Utilities Documentation

## Overview

The `pwd.utils.ts` module provides comprehensive password security functionality for a production-ready password manager. This module implements military-grade security practices with optimized scoring for real-world use, especially for social media platforms where password length is often limited.

## Key Features

- 🔒 **Async Password Generation** with pattern avoidance
- 📊 **Optimized Scoring** for 8-16 character passwords (social media friendly)
- 🎯 **Achievable 100% Vault Score** - users can reach perfect scores
- 🛡️ **Pattern Detection & Avoidance** - prevents common vulnerabilities
- 📈 **Comprehensive Analysis** - detailed password and vault health reports
- ⚡ **Performance Optimized** - balances security with generation speed

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Types & Interfaces](#types--interfaces)
3. [Core Functions](#core-functions)
4. [Password Analysis](#password-analysis)
5. [Pattern Detection](#pattern-detection)
6. [Vault Health](#vault-health)
7. [Convenience Functions](#convenience-functions)
8. [Examples](#examples)
9. [Best Practices](#best-practices)

## Installation & Setup

### Prerequisites

```typescript
// Ensure you have the required data files
import { WORD_LIST } from "@/data/word-list";
import { COMMON_PASSWORDS } from "@/data/common-passwords";
import { PASSWORD_PATTERNS } from "@/data/password-patterns";
```

### Basic Usage

```typescript
import {
  generatePassword,
  analyzePassword,
  analyzeVaultHealth,
  // ... other functions
} from "./pwd.utils";
```

## Types & Interfaces

### PasswordStrength

```typescript
type PasswordStrength = 
  | "very-weak"    // Score: 0-29
  | "weak"         // Score: 30-49
  | "medium"       // Score: 50-69
  | "strong"       // Score: 70-84
  | "very-strong"  // Score: 85-94
  | "excellent";   // Score: 95-100
```

### PasswordOptions

```typescript
interface PasswordOptions {
  length?: number;               // Password length (8-32 recommended)
  strength?: PasswordStrength;   // Strength preset
  includeUppercase?: boolean;    // Include A-Z (default: true)
  includeLowercase?: boolean;    // Include a-z (default: true)
  includeNumbers?: boolean;      // Include 0-9 (default: true)
  includeSpecial?: boolean;      // Include special chars (default: true)
  excludeSimilar?: boolean;      // Exclude i,l,1,o,0,O (default: true)
  excludeAmbiguous?: boolean;    // Exclude ambiguous chars (default: true)
  excludeSequential?: boolean;   // Exclude abc, 123 (default: true)
  excludeRepeated?: boolean;     // Exclude aaa, 111 (default: true)
}
```

### PasswordAnalysis

```typescript
interface PasswordAnalysis {
  password: string;            // The analyzed password
  entropy: number;             // Entropy in bits
  strength: PasswordStrength;  // Strength classification
  score: number;               // Exact score 0-100
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
    reuseCount: number;        // Times password is reused
  };
}
```

### PatternAnalysis

```typescript
interface PatternAnalysis {
  hasPatterns: boolean;      // Whether problematic patterns exist
  patterns: string[];        // List of detected patterns
  patternScore: number;      // Pattern avoidance score (0-100)
  suggestions: string[];     // Pattern avoidance suggestions
}
```

## Core Functions

### `generatePassword(options?: PasswordOptions | PasswordStrength): Promise<string>`

**Async function** that generates a secure password with guaranteed high score.

#### Parameters:
- `options` (optional): Either a `PasswordOptions` object or a `PasswordStrength` string preset

#### Returns: `Promise<string>` - Generated password

#### Example:
```typescript
// Using strength preset (async/await)
const password1 = await generatePassword("excellent");
// Output: "J8k#n2P!qR9tY4wX@z7vB1m"

// Using custom options
const password2 = await generatePassword({
  length: 16,
  strength: "excellent",
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSpecial: true,
  excludeSimilar: true,
  excludeAmbiguous: true,
  excludeSequential: true,
  excludeRepeated: true
});
// Output: "H7m#n3K!pR8tV2wZ"

// Using .then() syntax
generatePassword("strong").then(password => {
  console.log("Generated:", password);
});
```

#### Features:
- ✅ Generates multiple candidates and selects the best
- ✅ Actively avoids problematic patterns
- ✅ Guarantees high scores (≥95 for "excellent")
- ✅ Optimized for 8-32 character passwords
- ✅ Async operation for better pattern avoidance

### `generateExcellentPasswordWithCharCount(length: number = 16): Promise<string>`

**Specialized function** that generates excellent-strength passwords with custom length.

#### Parameters:
- `length` (optional): Desired password length (8-32, default: 16)

#### Returns: `Promise<string>` - Generated password

#### Example:
```typescript
// Generate 12-char password for social media
const socialMediaPassword = await generateExcellentPasswordWithCharCount(12);
// Output: "K8n#pR!t2wX" (score: 85-95)

// Generate 20-char password for banking
const bankingPassword = await generateExcellentPasswordWithCharCount(20);
// Output: "J8k#n2P!qR9tY4wX@z7v" (score: 95-100)
```

#### Notes:
- Length is automatically clamped between 8 and 32
- Uses all character types by default
- Excellent strength preset with pattern avoidance

### `calculatePasswordScore(password: string): number`

Calculates exact security score (0-100) for any password.

#### Scoring Breakdown:
- **35%** - Entropy (information theory)
- **30%** - Length adequacy (optimized for 12-16 chars)
- **25%** - Character variety
- **10%** - Pattern avoidance (negative)

#### Parameters:
- `password`: The password to score

#### Returns: `number` - Score from 0 to 100

#### Example:
```typescript
const score1 = calculatePasswordScore("P@ssw0rd123");
// Output: 45.2 (weak)

const score2 = calculatePasswordScore("J8k#n2P!qR9tY4wX");
// Output: 92.7 (excellent)
```

#### Score Ranges:
| Score Range | Strength | Description |
|-------------|----------|-------------|
| 0-29 | Very Weak | Easily crackable |
| 30-49 | Weak | Basic protection |
| 50-69 | Medium | Reasonable security |
| 70-84 | Strong | Good for most purposes |
| 85-94 | Very Strong | Excellent security |
| 95-100 | Excellent | Maximum security |

### `calculatePasswordEntropy(password: string): number`

Calculates password entropy in bits (measure of randomness).

#### Parameters:
- `password`: The password to analyze

#### Returns: `number` - Entropy in bits

#### Example:
```typescript
const entropy = calculatePasswordEntropy("MySecureP@ssw0rd");
// Output: 78.4 bits
```

#### Entropy Guidelines:
- < 28 bits: Very Weak
- 28-47 bits: Weak
- 48-63 bits: Medium
- 64-79 bits: Strong
- 80+ bits: Very Strong
- 100+ bits: Excellent

### `getPasswordStrength(password: string): PasswordStrength`

Classifies password strength based on exact scoring.

#### Parameters:
- `password`: The password to classify

#### Returns: `PasswordStrength` - Strength classification

#### Example:
```typescript
const strength1 = getPasswordStrength("password123");
// Output: "very-weak"

const strength2 = getPasswordStrength("Tr0ub4dor&3");
// Output: "medium"

const strength3 = getPasswordStrength(await generatePassword("excellent"));
// Output: "excellent"
```

## Password Analysis

### `analyzePassword(password: string): PasswordAnalysis`

Comprehensive password analysis with detailed breakdown.

#### Parameters:
- `password`: The password to analyze

#### Returns: `PasswordAnalysis` - Complete analysis object

#### Example:
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
    "Password could be longer (11 characters)"
  ],
  suggestions: [
    "Add special characters (!@#$%^&* etc.)",
    "Use 12+ characters for better security"
  ],
  details: {
    length: 11,
    hasUppercase: true,
    hasLowercase: true,
    hasNumbers: true,
    hasSpecial: false,
    charsetSize: 62,
    patternScore: 85,
    reuseCount: 0
  }
}
*/
```

#### Real-World Example:
```typescript
// Analyze a generated password
const excellentPassword = await generatePassword("excellent");
const analysis = analyzePassword(excellentPassword);

if (analysis.score >= 95) {
  console.log("✅ Excellent password!");
  console.log(`Score: ${analysis.score}/100`);
  console.log(`Strength: ${analysis.strength}`);
  console.log(`Entropy: ${analysis.entropy.toFixed(1)} bits`);
}
```

### `analyzePasswordPatterns(password: string): PatternAnalysis`

Analyzes password for common patterns and provides suggestions.

#### Parameters:
- `password`: The password to analyze

#### Returns: `PatternAnalysis` - Pattern analysis results

#### Example:
```typescript
const patternAnalysis = analyzePasswordPatterns("qwerty123");

console.log(patternAnalysis);
/*
{
  hasPatterns: true,
  patterns: [
    "Keyboard walk pattern detected",
    "Date pattern detected"
  ],
  patternScore: 65,
  suggestions: [
    "Avoid keyboard patterns like 'qwerty', 'asdfgh'",
    "Avoid using dates in passwords"
  ]
}
*/
```

## Pattern Detection Functions

### Pattern Detection Functions

All pattern detection functions return `boolean` indicating if the pattern exists.

| Function | Parameters | Description | Example |
|----------|------------|-------------|---------|
| `hasSequentialChars` | `password: string`, `minLength: number = 3` | Checks for sequential characters | `hasSequentialChars("abc123", 3)` → `true` |
| `hasKeyboardWalk` | `password: string` | Detects keyboard patterns | `hasKeyboardWalk("qwerty")` → `true` |
| `hasRepeatedChars` | `password: string`, `minRepeat: number = 3` | Checks for repeated characters | `hasRepeatedChars("aaa111", 3)` → `true` |
| `hasDatePattern` | `password: string` | Detects date patterns | `hasDatePattern("19901231")` → `true` |
| `hasLeetPattern` | `password: string` | Detects l33t speak patterns | `hasLeetPattern("P@ssw0rd")` → `true` |
| `hasDictionaryWord` | `password: string` | Checks for dictionary words | `hasDictionaryWord("password123")` → `true` |
| `hasPersonalInfoPattern` | `password: string` | Detects personal info patterns | `hasPersonalInfoPattern("john1980")` → `true` |

### `findPatternPasswords(items: IPasswordItem[]): IPasswordItem[]`

Finds all items with passwords containing problematic patterns.

#### Parameters:
- `items`: Array of password items

#### Returns: `IPasswordItem[]` - Filtered items with pattern passwords

#### Example:
```typescript
const itemsWithPatterns = findPatternPasswords(passwordItems);
itemsWithPatterns.forEach(item => {
  console.log(`Item "${item.title}" has problematic patterns`);
});
```

## Vault Health

### `calculateVaultHealthScore(items: IPasswordItem[]): number`

Calculates vault health score (0-100).

#### Scoring Formula:
- **60%** - Average password quality (0-100 scores)
- **25%** - Bonus for unique passwords (no reuse)
- **15%** - Bonus for no common passwords
- **Penalties** (minimal, so 100% is achievable):
  - 2 points per weak password
  - 1 point per reused instance
  - 1 point per pattern password

#### Parameters:
- `items`: Array of password vault items

#### Returns: `number` - Health score from 0 to 100

#### Example:
```typescript
const vaultScore = calculateVaultHealthScore(passwordItems);
console.log(`Vault Health: ${vaultScore}/100`);

if (vaultScore >= 95) {
  console.log("🎉 Perfect vault security!");
} else if (vaultScore >= 75) {
  console.log("✅ Good vault security");
} else {
  console.log("⚠️ Needs improvement");
}
```

### `analyzeVaultHealth(items: IPasswordItem[]): VaultAnalysis`

Comprehensive vault health analysis.

#### Returns:
```typescript
{
  score: number;                   // Overall health score
  totalItems: number;              // Total items in vault
  activeItems: number;             // Non-deleted items
  weakCount: number;               // Weak passwords count
  reusedCount: number;             // Unique reused passwords
  patternCount: number;            // Passwords with patterns
  commonCount: number;             // Common passwords count
  averagePasswordScore: number;    // Average password score
  uniquenessPercentage: number;    // Percentage of unique passwords
  suggestions: string[];           // Improvement suggestions
}
```

#### Example:
```typescript
const vaultAnalysis = analyzeVaultHealth(vaultItems);

console.log(vaultAnalysis);
/*
{
  score: 92.5,
  totalItems: 8,
  activeItems: 8,
  weakCount: 0,
  reusedCount: 0,
  patternCount: 0,
  commonCount: 0,
  averagePasswordScore: 94.3,
  uniquenessPercentage: 100,
  suggestions: ["Excellent! Your vault is very secure"]
}
*/
```

### Vault Health Categories:

| Score Range | Category | Description |
|-------------|----------|-------------|
| 95-100 | Perfect | All passwords excellent, no reuse |
| 85-94 | Excellent | Strong passwords, minimal issues |
| 75-84 | Good | Secure with minor improvements needed |
| 60-74 | Acceptable | Needs attention |
| < 60 | Needs Improvement | Significant security issues |

### `findWeakPasswords(items: IPasswordItem[]): IPasswordItem[]`

Finds passwords with score < 60.

### `findReusedPasswords(items: IPasswordItem[]): IPasswordItem[]`

Finds all reused passwords in vault.

### `findCommonPasswords(items: IPasswordItem[]): IPasswordItem[]`

Finds passwords in common passwords list.

### `getActiveItems(items: IPasswordItem[]): IPasswordItem[]`

Filters out deleted items.

## Convenience Functions

### Synchronous Password Generation (Quick, less pattern avoidance)

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `generateStrongPassword` | None | `Promise<string>` | 16-char strong password |
| `generateVeryStrongPassword` | None | `Promise<string>` | 20-char very strong password |
| `generateExcellentPassword` | None | `Promise<string>` | 24-char excellent password |

### Other Utility Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `generatePassphrase` | `wordCount: number = 4`, `includeNumber: boolean = true` | `string` | Memorable passphrase |
| `generateOTP` | `length: number = 6` | `string` | Secure numeric OTP |
| `generateRecoveryCode` | None | `string` | Secure recovery code |

#### Example:
```typescript
// Generate a passphrase for easy memorization
const passphrase = generatePassphrase(4, true);
// Output: "brave-cloud-dragon-eagle-4297"

// Generate an OTP for 2FA
const otp = generateOTP(6);
// Output: "429173"

// Generate a recovery code
const recoveryCode = generateRecoveryCode();
// Output: "J8K3-N2P1-QR9T-Y4WX"
```

## Examples

### Complete Social Media Password Setup

```typescript
import {
  generateExcellentPasswordWithCharCount,
  analyzePassword,
  analyzeVaultHealth
} from "./pwd.utils";

async function setupSocialMediaAccounts() {
  const accounts = [
    "Facebook",
    "Twitter", 
    "Instagram",
    "LinkedIn",
    "GitHub"
  ];
  
  const passwords = [];
  
  // Generate optimized passwords for each account
  for (const account of accounts) {
    // Use 12-16 chars for social media
    const length = Math.floor(Math.random() * 5) + 12; // 12-16 chars
    const password = await generateExcellentPasswordWithCharCount(length);
    
    passwords.push({
      account,
      password,
      analysis: analyzePassword(password)
    });
    
    console.log(`${account}: ${password}`);
    console.log(`  Score: ${passwords[passwords.length-1].analysis.score}/100`);
  }
  
  return passwords;
}

// Usage
setupSocialMediaAccounts().then(passwords => {
  const vaultScore = analyzeVaultHealth(passwords.map(p => ({ 
    password: p.password, 
    isDeleted: false 
  })));
  
  console.log(`\nVault Health: ${vaultScore.score}/100`);
});
```

### Password Strength Meter Component

```typescript
import { useState } from "react";
import { analyzePassword, getPasswordStrength } from "./pwd.utils";

function PasswordStrengthMeter({ password }: { password: string }) {
  const analysis = analyzePassword(password);
  
  const getColor = (strength: string) => {
    switch (strength) {
      case "very-weak": return "bg-red-500";
      case "weak": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "strong": return "bg-green-400";
      case "very-strong": return "bg-green-500";
      case "excellent": return "bg-green-600";
      default: return "bg-gray-300";
    }
  };
  
  return (
    <div className="password-strength-meter">
      <div className="flex items-center gap-2 mb-2">
        <div className={`h-2 flex-1 rounded-full ${getColor(analysis.strength)}`} />
        <span className="text-sm font-medium">
          {analysis.score}/100 • {analysis.strength.toUpperCase()}
        </span>
      </div>
      
      {analysis.weaknesses.length > 0 && (
        <div className="text-sm text-gray-600">
          {analysis.weaknesses[0]}
        </div>
      )}
    </div>
  );
}
```

### Vault Health Dashboard

```typescript
import { 
  analyzeVaultHealth,
  findWeakPasswords,
  findReusedPasswords
} from "./pwd.utils";

function VaultDashboard({ items }: { items: IPasswordItem[] }) {
  const analysis = analyzeVaultHealth(items);
  const weakItems = findWeakPasswords(items);
  const reusedItems = findReusedPasswords(items);
  
  return (
    <div className="vault-dashboard">
      {/* Score Card */}
      <div className="score-card">
        <div className="score-circle">
          <span className="score-number">{analysis.score}</span>
          <span className="score-label">/100</span>
        </div>
        <div className="score-description">
          {analysis.score >= 95 ? "Perfect Security" : 
           analysis.score >= 85 ? "Excellent Security" :
           analysis.score >= 75 ? "Good Security" : "Needs Improvement"}
        </div>
      </div>
      
      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat">
          <div className="stat-value">{analysis.totalItems}</div>
          <div className="stat-label">Total Items</div>
        </div>
        <div className="stat">
          <div className="stat-value">{analysis.weakCount}</div>
          <div className="stat-label">Weak Passwords</div>
        </div>
        <div className="stat">
          <div className="stat-value">{analysis.reusedCount}</div>
          <div className="stat-label">Reused</div>
        </div>
        <div className="stat">
          <div className="stat-value">{analysis.uniquenessPercentage}%</div>
          <div className="stat-label">Unique</div>
        </div>
      </div>
      
      {/* Suggestions */}
      <div className="suggestions">
        <h3>Recommendations</h3>
        {analysis.suggestions.map((suggestion, index) => (
          <div key={index} className="suggestion-item">
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Bulk Password Generation

```typescript
async function bulkGeneratePasswords(count: number, strength: PasswordStrength) {
  const passwords = [];
  
  // Generate passwords in parallel for better performance
  const promises = Array(count).fill(null).map(() => 
    generatePassword(strength)
  );
  
  // Wait for all passwords to generate
  const results = await Promise.all(promises);
  
  // Analyze each password
  results.forEach((password, index) => {
    const analysis = analyzePassword(password);
    passwords.push({
      id: index + 1,
      password,
      score: analysis.score,
      strength: analysis.strength
    });
  });
  
  return passwords;
}

// Usage
bulkGeneratePasswords(10, "excellent").then(passwords => {
  console.table(passwords.map(p => ({
    ID: p.id,
    Password: p.password,
    Score: p.score,
    Strength: p.strength
  })));
});
```

## Best Practices

### 1. **Password Generation Strategy**

```typescript
// For social media (12-16 chars)
const socialMediaPassword = await generateExcellentPasswordWithCharCount(14);

// For banking/email (16-24 chars)
const criticalPassword = await generatePassword("excellent");

// For internal tools (12+ chars)
const internalPassword = await generatePassword({
  length: 12,
  strength: "strong"
});
```

### 2. **Regular Vault Health Checks**

```typescript
// Weekly vault health check
async function weeklyVaultCheck() {
  const items = await loadVaultItems();
  const health = analyzeVaultHealth(items);
  
  if (health.score < 75) {
    // Send notification
    notifyUser("Vault needs attention", health.suggestions);
  }
  
  // Generate report
  return {
    date: new Date(),
    score: health.score,
    weakPasswords: health.weakCount,
    reusedPasswords: health.reusedCount,
    suggestions: health.suggestions
  };
}
```

### 3. **Password Policy Enforcement**

```typescript
function validatePasswordPolicy(password: string): {
  isValid: boolean;
  message: string;
  score: number;
} {
  const analysis = analyzePassword(password);
  
  // Minimum requirements
  if (analysis.score < 60) {
    return {
      isValid: false,
      message: `Password too weak (score: ${analysis.score}). ${analysis.suggestions[0]}`,
      score: analysis.score
    };
  }
  
  // Check for severe patterns
  if (analysis.details.patternScore < 70) {
    return {
      isValid: false,
      message: "Password contains problematic patterns",
      score: analysis.score
    };
  }
  
  return {
    isValid: true,
    message: "Password meets security requirements",
    score: analysis.score
  };
}
```

### 4. **Progressive Strength Improvement**

```typescript
async function improvePassword(oldPassword: string): Promise<string> {
  const analysis = analyzePassword(oldPassword);
  
  if (analysis.score >= 95) {
    return oldPassword; // Already excellent
  }
  
  // Generate new password with better strength
  let newStrength: PasswordStrength;
  
  if (analysis.score < 50) {
    newStrength = "strong";
  } else if (analysis.score < 70) {
    newStrength = "very-strong";
  } else {
    newStrength = "excellent";
  }
  
  return generatePassword(newStrength);
}
```

## Performance Considerations

### Generation Time
- **Average**: 5-50ms per password
- **Excellent passwords**: May take up to 100ms due to pattern avoidance
- **Bulk generation**: Use `Promise.all()` for parallel generation

### Memory Usage
- **Single password**: Minimal memory footprint
- **Vault analysis**: O(n) complexity, efficient even for large vaults
- **Pattern detection**: Optimized for speed, uses efficient algorithms

### Browser vs Node.js
- **Browser**: Uses `window.crypto.getRandomValues()`
- **Node.js**: Uses `crypto.randomBytes()`
- **Fallback**: `Math.random()` with warning (not secure for production)

## Error Handling

```typescript
try {
  const password = await generatePassword({
    length: 4,  // Too short for character types
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: true
  });
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes("Password length must be at least")) {
      console.error("Insufficient length:", error.message);
    } else if (error.message.includes("At least one character type must be included")) {
      console.error("No character types selected");
    } else {
      console.error("Unknown error:", error);
    }
  }
}
```

## Testing

```typescript
// Test password generation
test('generates password with specified length', async () => {
  const password = await generatePassword({ length: 12 });
  expect(password.length).toBe(12);
});

// Test strength classification
test('classifies password strength correctly', () => {
  const strength = getPasswordStrength("P@ssw0rd123");
  expect(strength).toBe("weak");
});

// Test vault health calculation
test('calculates vault health score', () => {
  const testItems = [
    { password: await generatePassword("excellent"), isDeleted: false },
    { password: await generatePassword("excellent"), isDeleted: false }
  ];
  const score = calculateVaultHealthScore(testItems);
  expect(score).toBeGreaterThanOrEqual(0);
  expect(score).toBeLessThanOrEqual(100);
  expect(score).toBeGreaterThan(90); // Excellent passwords should score high
});
```

## Security Notes

### 1. **Cryptographically Secure Randomness**
- Browser: `window.crypto.getRandomValues()`
- Node.js: `crypto.randomBytes()`
- No external dependencies for randomness

### 2. **Pattern Avoidance**
- Actively avoids leet speak patterns
- Prevents personal information patterns
- Filters keyboard walks and sequences

### 3. **Scoring Transparency**
- All scoring algorithms are documented
- Users can understand why scores change
- Realistic thresholds for real-world use

### 4. **Achievable Perfection**
- Users can reach 100% vault score
- Encourages good password habits
- Rewards security-conscious behavior

## Migration Guide

### From Older Versions

```typescript
// Old synchronous version
const oldPassword = generatePassword("strong");

// New async version
const newPassword = await generatePassword("strong");

// With error handling
try {
  const password = await generatePassword(options);
} catch (error) {
  console.error("Generation failed:", error);
}
```

## Contributing

When extending this module:

1. **Maintain backward compatibility**
2. **Add comprehensive tests**
3. **Update documentation**
4. **Follow security best practices**
5. **Performance test with large datasets**

## License & Credits

This module implements industry-standard password security practices based on:
- NIST Special Publication 800-63B
- OWASP Authentication Cheat Sheet
- Common password pattern research
- Real-world social media password policies

For production use, ensure compliance with relevant security standards and regulations in your jurisdiction.

---

## Quick Reference Cheat Sheet

### Generation Functions
```typescript
await generatePassword("excellent")              // 24-char excellent
await generateExcellentPasswordWithCharCount(14) // 14-char excellent  
await generateStrongPassword()                   // 16-char strong
generatePassphrase(4, true)                     // Word-based
```

### Analysis Functions
```typescript
analyzePassword(password)                       // Detailed analysis
calculatePasswordScore(password)                // Quick score
getPasswordStrength(password)                   // Strength label
analyzePasswordPatterns(password)              // Pattern analysis
```

### Vault Functions
```typescript
analyzeVaultHealth(items)                       // Complete vault analysis
calculateVaultHealthScore(items)                // Just the score
findWeakPasswords(items)                        // Weak passwords
findReusedPasswords(items)                      // Reused passwords
```

### Pattern Detection
```typescript
hasKeyboardWalk(password)                       // Keyboard patterns
hasLeetPattern(password)                        // Leet speak
hasPersonalInfoPattern(password)                // Personal info
hasSequentialChars(password, 3)                 // Sequences
```

This documentation provides comprehensive guidance for using the password utilities module in your password manager application.