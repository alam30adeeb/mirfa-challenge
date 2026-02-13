# 🔐 Secure Transaction Pipeline (AES-256-GCM)

A production-grade, full-stack application demonstrating **Envelope Encryption** with a dedicated cryptographic library, modular monorepo architecture, and persistent SQLite storage.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Security](https://img.shields.io/badge/Security-AES--256--GCM-green)
![Persistence](https://img.shields.io/badge/Database-SQLite-orange)

---

## 🏗️ Architecture

The project follows a **Modular Monorepo** structure using Turborepo. It enforces strict separation of concerns between the User Interface, the API Layer, and the Core Security Logic.

### **Core Components**

| Module | Path | Description |
| :--- | :--- | :--- |
| **@repo/crypto** | `packages/crypto` | **The Security Core.** A standalone library implementing Envelope Encryption. It handles DEK generation, Key Wrapping, and AES-256-GCM operations with strict validation. |
| **API Service** | `apps/api` | **The Controller.** A Fastify-based REST API. It uses the Repository Pattern to manage transaction lifecycles and strictly validates inputs before processing. |
| **Frontend** | `apps/web` | **The View.** A Next.js application that visualizes the encrypted data model (Ciphertext, Wrapped Keys, Auth Tags) for transparency. |
| **Persistence** | `sqlite` | **The Storage.** Uses `better-sqlite3` for high-performance, persistent local storage of encrypted records. |

---

## 🛡️ Security Implementation (Envelope Encryption)

This system implements **Authenticated Encryption** to ensure both confidentiality and integrity.

1.  **Data Encryption:**
    * **Algorithm:** AES-256-GCM.
    * **Key:** A unique 32-byte **Data Encryption Key (DEK)** is generated for *every* transaction.
    * **Nonce:** A random 12-byte IV is generated for every encryption.
    * **Integrity:** A 16-byte **Auth Tag** prevents ciphertext tampering.

2.  **Key Wrapping:**
    * The DEK itself is encrypted using a **Master Key** (stored securely in env vars).
    * This "Wrapped DEK" is stored alongside the encrypted data.

3.  **Validation Rules:**
    * The system rejects any payload with invalid hex strings.
    * It enforces 12-byte Nonce and 16-byte Tag lengths.
    * Decryption halts immediately if the Auth Tag does not match (detects tampering).

---

## 🚀 Getting Started

### **Prerequisites**
* Node.js (v18+)
* pnpm (v8+)

### **1. Installation**
```bash
# Install all dependencies across the monorepo
pnpm install

2. Environment Setup
Create a .env file in the apps/api directory:

Bash
# apps/api/.env
MASTER_KEY_HEX=your_32_byte_hex_key_here
PORT=3001
Tip: You can generate a secure key by running:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

3. Running Locally
Start both the Frontend and Backend in development mode:

Bash
pnpm dev
Frontend: http://localhost:3000

Backend: http://localhost:3001