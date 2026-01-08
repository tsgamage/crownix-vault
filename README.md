# Crownix Vault — Source Code

Crownix Vault is a local-first password manager focused on privacy, security, and transparency.

This repository contains the **full source code** for the Crownix Vault desktop application.

---

## Purpose of This Repository

This repository exists to provide **full transparency** into how Crownix Vault works internally.

Users are encouraged to:

- Review the encryption and security design
- Audit password generation and analysis logic
- Build the application themselves
- Verify that no telemetry or hidden network activity exists

This repository is **not** intended for redistribution or derivative works.

---

## Security Philosophy

Crownix Vault follows a strict **local-first, zero-knowledge** model.

### Vault Encryption

- Vault data is encrypted using **AES-256-GCM**.
- Each vault uses a **unique random salt**.
- Encryption keys are derived from the master password using:

  - PBKDF2
  - SHA-256
  - 200,000 iterations

The master password is never stored or logged.

### Vault File Format

- Custom binary format
- Header contains metadata (magic value, version, salt, IV)
- Encrypted payload contains all vault data
- Entire file is validated before loading

### No Network Dependency

- Vault operations are fully offline.
- No passwords, keys, or metadata are sent over the network.
- Network access is used only for update checks (via official releases).

---

## Password Generation & Analysis

Crownix Vault includes a security-focused password engine designed for real-world use:

- Cryptographically secure random generation
- High-entropy passwords and passphrases
- Pattern avoidance (keyboard walks, repetition, sequences)
- Detection of weak, reused, or common passwords
- Entropy-based scoring and vault health metrics

All logic is implemented client-side and can be reviewed in this repository.

---

## Tech Stack

- **Core**: Tauri v2 (Rust)
- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS v4 + Shadcn
- **State Management**: Zustand
- **Database**: sql.js (in-memory)

---

## Building Locally

### Requirements

- Node.js (LTS recommended)
- pnpm
- Rust (stable)
- Tauri prerequisites

### Development

```bash
pnpm install
pnpm desktop
```

### Production Build

```bash
pnpm build
pnpm tauri build
```

---

## License

Crownix Vault is released under the Crownix Source-Available License (SAL-1.0).
This means:

- The source code is publicly available for transparency and security review
- You may build and run the software for personal, non-commercial use
- You may not redistribute, modify, fork, or create derivative works
- Commercial use, resale, or rebranding is not permitted
- Third-party distribution of binaries is not allowed

The software is provided “as is”, without any warranty.
Crownix is not responsible for data loss, corruption, or misuse.

See the [`LICENSE`](./LICENSE) file for full terms.

---

## Related Repositories

- **Releases**: [https://github.com/tsgamage/crownix-vault-releases](https://github.com/tsgamage/crownix-vault-releases)

---

## Feedback

Security issues, bugs, and suggestions can be reported via GitHub Issues.

Constructive feedback is welcome.

---

<div align="center">
  <sub>
    Crownix Vault · Source Code Repository
  </sub>
</div>
