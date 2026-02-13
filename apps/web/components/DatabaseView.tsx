import { theme } from '../styles/theme';
import type { TxSecureRecord } from '@repo/crypto';

interface Props {
  encryptedRecord: TxSecureRecord | null; // Use the real type!
  decryptedResult: any;
}

export default function DatabaseView({ encryptedRecord, decryptedResult }: Props) {
  return (
    <div style={theme.card}>
      <h2 style={theme.sectionTitle}>💾 Database View</h2>
      
      {!encryptedRecord && !decryptedResult && (
        <div style={theme.emptyState}>
          <p>No data loaded.</p>
          <p style={{ fontSize: '0.9rem' }}>Submit a transaction to see the secure record.</p>
        </div>
      )}

      {encryptedRecord && (
        <div style={{ marginBottom: '32px' }}>
          <span style={theme.resultLabel}>🔒 Encrypted Record (AES-256-GCM)</span>
          
          <div style={{ ...theme.codeBox, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Field: payload_ct */}
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '4px' }}>
                Payload Ciphertext (payload_ct)
              </div>
              <div style={{ color: '#e2e8f0', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                {encryptedRecord.payload_ct ? encryptedRecord.payload_ct.substring(0, 64) + '...' : 'undefined'}
              </div>
            </div>

            {/* Field: dek_wrapped */}
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '4px' }}>
                Wrapped Key (dek_wrapped)
              </div>
              <div style={{ color: '#f59e0b', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                {encryptedRecord.dek_wrapped ? encryptedRecord.dek_wrapped.substring(0, 64) + '...' : 'undefined'}
              </div>
            </div>

            {/* Field: payload_tag */}
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '4px' }}>
                Auth Tag (payload_tag)
              </div>
              <div style={{ color: '#ec4899', fontFamily: 'monospace' }}>
                {encryptedRecord.payload_tag}
              </div>
            </div>

            <details style={{ marginTop: '10px' }}>
              <summary style={{ cursor: 'pointer', color: '#64748b', fontSize: '0.8rem' }}>
                View Full JSON Record
              </summary>
              <pre style={{ marginTop: '10px', fontSize: '0.7rem', color: '#94a3b8' }}>
                {JSON.stringify(encryptedRecord, null, 2)}
              </pre>
            </details>
          </div>
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