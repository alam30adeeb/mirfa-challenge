# Secure Transaction Pipeline

A full-stack implementation of an Envelope Encryption system using AES-256-GCM, designed with a modular monorepo architecture.

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Security](https://img.shields.io/badge/Security-AES--256--GCM-green)
![Architecture](https://img.shields.io/badge/Architecture-Monorepo-orange)

## 🔗 Live Demo

* **Frontend:** [https://mirfa-challenge-web.vercel.app/]
* **API:** [https://mirfa-challenge-api.vercel.app/]

> **Infrastructure Note:** The deployed version uses an **In-Memory Store** to ensure stability on Vercel's serverless environment (which has ephemeral file systems).

## 🏗 Architecture

The project uses **Turborepo** to enforce strict separation of concerns.

| Component | Path | Description |
| :--- | :--- | :--- |
| **Crypto Library** | `packages/crypto` | Standalone library handling AES-256-GCM encryption, key wrapping, and DEK generation. |
| **API** | `apps/api` | Fastify-based REST API implementing the Repository Pattern. |
| **Frontend** | `apps/web` | Next.js application for transaction creation and encrypted data visualization. |

## 🛡 Security Specification

The system implements **Envelope Encryption** with the following standards:

* **Algorithm:** AES-256-GCM (Authenticated Encryption).
* **Key Management:**
    * **DEK:** Random 32-byte key generated per transaction.
    * **KEK (Master):** 32-byte key loaded from environment variables used to wrap the DEK.
* **Validation:** Strict enforcement of 12-byte nonces, 16-byte auth tags, and hex string formats.

## 🚀 Setup & Execution

**1. Installation**
pnpm install


**2. Configuration**
Create a `.env` file in `apps/api`:
MASTER_KEY_HEX=<32-byte-hex-string>
PORT=3001


**3. Running Locally**
Start both frontend and backend services:
pnpm dev

* **Frontend:** http://localhost:3000
* **API:** http://localhost:3001

## 🧪 Testing

Run the test suite for the cryptographic library:

pnpm --filter @repo/crypto run test


## 📂 Project Structure

├── apps
│   ├── api          # Fastify, Controllers, Service Layer
│   └── web          # Next.js, UI Components
├── packages
│   ├── crypto       # Shared Encryption Logic
│   └── config       # Shared TS/ESLint Configs
└── README.md