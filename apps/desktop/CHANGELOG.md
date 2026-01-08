# Changelog

All notable changes to **Crownix Vault** are documented in this file.

This project follows a human-readable changelog format inspired by
[Keep a Changelog](https://keepachangelog.com/), but adapted for a
source-available, single-maintainer project.

---

## [1.1.0](https://github.com/tsgamage/crownix-vault-releases/releases/tag/v1.1.0) – 2026-01-08

### Added

- Automatic update support using Tauri’s updater plugin.
- Global save action with visual indication when the vault is being saved.
- Keyboard shortcut support for core actions (including global save).
- Ability to change the master password from settings.
- Dedicated keyboard shortcuts modal (read-only for now).
- Backup export flow improvements, including recovery when dialogs are dismissed.
- Copy-to-clipboard button during password creation.
- Application settings persistence (separate from vault data).

### Improved

- Save workflow redesigned to use an explicit **Save** action instead of reload-based persistence.
- Vault loading logic refined to prevent UI flickering during startup and locked states.
- SQL.js configured for offline-only usage.
- Password details view fixed where URLs were not opening when clicked.
- Input handling improved by disabling browser autocomplete where inappropriate.
- Overall UI polish and interaction consistency.

### Fixed

- Application freeze on Windows when switching focus or clicking outside during file/folder selection.
- Title overflow issues across multiple views.
- Several validation edge cases using Zod schemas.

### Changed

- Project transitioned to **source-available** for transparency.
- Internal data flow refactored to better align frontend state with vault persistence.

### Cancelled / Deferred

- Password list virtualization (performance trade-offs did not justify complexity).
- Full SQLite migration (in-memory database approach did not meet reliability expectations).

---

## [1.0.0](https://github.com/tsgamage/crownix-vault-releases/releases/tag/v1.0.0) – 2026-01-02

### Initial Release

- Encrypted local vault file with custom binary format.
- AES-256-GCM encryption with PBKDF2 (SHA-256, 200,000 iterations).
- Zero-knowledge architecture (no stored passwords or keys).
- Password generator with entropy-based scoring and pattern avoidance.
- Vault health dashboard for reused, weak, and common passwords.
- Auto-lock on inactivity and clipboard auto-clear protection.
- Windows desktop support via Tauri v2.
- Portable vault file fully owned by the user.

---

## Notes

- Version numbers follow semantic versioning where possible.
- Dates may be adjusted as releases are finalized.
- Roadmap items may change based on stability, security, and user feedback.
