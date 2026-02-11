'use client';

import { useState } from 'react';

export default function Page() {
  // --- STATE ---
  const [partyId, setPartyId] = useState('party_123');
  const [payload, setPayload] = useState('{\n  "amount": 100,\n  "currency": "AED"\n}');
  const [recordId, setRecordId] = useState('');
  
  const [encryptedRecord, setEncryptedRecord] = useState<any>(null);
  const [decryptedResult, setDecryptedResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Use the live API URL from Vercel env, fallback to localhost for dev
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // --- HANDLERS ---
  const handleEncryptAndSave = async () => {
    try {
      setIsLoading(true); setError(''); setEncryptedRecord(null); setDecryptedResult(null);
      
      // Validate JSON before sending
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(payload);
      } catch (e) {
        throw new Error("Invalid JSON format. Please check your syntax.");
      }
      
      const res = await fetch(`${API_URL}/tx/encrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partyId, payload: parsedPayload }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to encrypt');
      
      setEncryptedRecord(data);
      setRecordId(data.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetch = async () => {
    try {
      setIsLoading(true); setError(''); setEncryptedRecord(null); setDecryptedResult(null);
      if (!recordId) throw new Error('Please enter a Record ID');

      const res = await fetch(`${API_URL}/tx/${recordId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch');
      
      setEncryptedRecord(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrypt = async () => {
    try {
      setIsLoading(true); setError(''); setDecryptedResult(null);
      if (!recordId) throw new Error('Please enter a Record ID');

      const res = await fetch(`${API_URL}/tx/${recordId}/decrypt`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to decrypt');
      
      setDecryptedResult(data.originalPayload);
      
      // Optional: Fetch the encrypted record too for comparison
      if (!encryptedRecord) {
        const resFetch = await fetch(`${API_URL}/tx/${recordId}`);
        if (resFetch.ok) setEncryptedRecord(await resFetch.json());
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- STYLES (Responsive & Clean) ---
  const styles = {
    container: { minHeight: '100vh', background: '#f1f5f9', color: '#1e293b', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '20px' },
    wrapper: { maxWidth: '1100px', margin: '0 auto' },
    header: { textAlign: 'center' as const, marginBottom: '40px', paddingTop: '20px' },
    title: { fontSize: '2.5rem', fontWeight: 800, margin: '0 0 10px 0', background: 'linear-gradient(to right, #2563eb, #0891b2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { color: '#64748b', fontSize: '1.1rem', margin: 0 },
    
    // Grid Layout that wraps on mobile
    grid: { display: 'flex', flexWrap: 'wrap' as const, gap: '24px', alignItems: 'flex-start' },
    column: { flex: '1 1 400px', display: 'flex', flexDirection: 'column' as const, gap: '24px' },
    
    card: { background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' },
    sectionTitle: { fontSize: '1.25rem', fontWeight: 700, margin: '0 0 20px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' },
    
    label: { display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '8px' },
    input: { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', transition: 'border 0.2s', outline: 'none', marginBottom: '20px', boxSizing: 'border-box' as const },
    
    // Buttons
    btnPrimary: { width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', transition: 'opacity 0.2s' },
    btnGroup: { display: 'flex', gap: '12px' },
    btnSecondary: { flex: 1, padding: '12px', background: 'white', color: '#475569', border: '2px solid #e2e8f0', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
    btnSuccess: { flex: 1, padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
    
    // Results
    codeBox: { background: '#0f172a', color: '#a5b4fc', padding: '20px', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'monospace', overflowX: 'auto' as const, margin: 0, wordBreak: 'break-all' as const, whiteSpace: 'pre-wrap' as const },
    resultLabel: { fontSize: '0.75rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', display: 'block' },
    
    error: { background: '#fee2e2', color: '#ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #fecaca', fontWeight: 500 },
    emptyState: { textAlign: 'center' as const, padding: '40px 20px', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '12px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        
        <header style={styles.header}>
          <h1 style={styles.title}>Secure Vault</h1>
          <p style={styles.subtitle}>Envelope Encryption Demo (AES-256-GCM)</p>
        </header>

        {error && <div style={styles.error}>⚠️ {error}</div>}

        <div style={styles.grid}>
          
          {/* LEFT COLUMN: Input Forms */}
          <div style={styles.column}>
            
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}><span>📝</span> Create Transaction</h2>
              
              <label style={styles.label}>Party ID</label>
              <input 
                value={partyId} 
                onChange={(e) => setPartyId(e.target.value)} 
                style={styles.input} 
                placeholder="e.g. party_001"
              />

              <label style={styles.label}>JSON Payload</label>
              <textarea 
                value={payload} 
                onChange={(e) => setPayload(e.target.value)} 
                rows={6}
                style={{ ...styles.input, fontFamily: 'monospace' }}
              />

              <button 
                onClick={handleEncryptAndSave} 
                disabled={isLoading}
                style={{ ...styles.btnPrimary, opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? 'Processing...' : 'Encrypt & Save Record'}
              </button>
            </div>

            <div style={styles.card}>
              <h2 style={styles.sectionTitle}><span>🔍</span> Retrieve Record</h2>
              <label style={styles.label}>Record ID</label>
              <input 
                value={recordId} 
                onChange={(e) => setRecordId(e.target.value)} 
                placeholder="Paste Record ID here..." 
                style={styles.input} 
              />
              
              <div style={styles.btnGroup}>
                <button onClick={handleFetch} disabled={isLoading} style={styles.btnSecondary}>
                  Fetch
                </button>
                <button onClick={handleDecrypt} disabled={isLoading} style={styles.btnSuccess}>
                  Decrypt
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Database View */}
          <div style={styles.column}>
            <div style={{ ...styles.card, minHeight: '500px' }}>
              <h2 style={styles.sectionTitle}><span>💾</span> Database View</h2>
              
              {!encryptedRecord && !decryptedResult && (
                <div style={styles.emptyState}>
                  <p>No data loaded.</p>
                  <p style={{ fontSize: '0.9rem' }}>Submit a transaction to see the encrypted record stored in the database.</p>
                </div>
              )}

              {encryptedRecord && (
                <div style={{ marginBottom: '32px' }}>
                  <span style={styles.resultLabel}>🔒 Encrypted Record (Ciphertext)</span>
                  <pre style={styles.codeBox}>
                    {JSON.stringify(encryptedRecord, null, 2)}
                  </pre>
                </div>
              )}

              {decryptedResult && (
                <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
                  <span style={{ ...styles.resultLabel, color: '#10b981' }}>🔓 Decrypted Payload</span>
                  <pre style={{ ...styles.codeBox, background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                    {JSON.stringify(decryptedResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}