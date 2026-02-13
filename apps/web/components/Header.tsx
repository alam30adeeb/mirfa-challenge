import { theme } from '../styles/theme';

export default function Header() {
  return (
    <header style={theme.header}>
      <h1 style={theme.title}>Secure Vault</h1>
      <p style={theme.subtitle}>Envelope Encryption Demo (AES-256-GCM)</p>
    </header>
  );
}