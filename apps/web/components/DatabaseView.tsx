import { theme } from '../styles/theme';

interface Props {
  encryptedRecord: any;
  decryptedResult: any;
}

export default function DatabaseView({ encryptedRecord, decryptedResult }: Props) {
  return (
    <div style={{ ...theme.card, minHeight: '500px' }}>
      <h2 style={theme.sectionTitle}>💾 Database View</h2>
      
      {!encryptedRecord && !decryptedResult && (
        <div style={theme.emptyState}>
          <p>No data loaded.</p>
          <p style={{ fontSize: '0.9rem' }}>Submit a transaction to see the encrypted record stored in the database.</p>
        </div>
      )}

      {encryptedRecord && (
        <div style={{ marginBottom: '32px' }}>
          <span style={theme.resultLabel}>🔒 Encrypted Record (Ciphertext)</span>
          <pre style={theme.codeBox}>
            {JSON.stringify(encryptedRecord, null, 2)}
          </pre>
        </div>
      )}

      {decryptedResult && (
        <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
          <span style={{ ...theme.resultLabel, color: '#10b981' }}>🔓 Decrypted Payload</span>
          <pre style={{ ...theme.codeBox, background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
            {JSON.stringify(decryptedResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}