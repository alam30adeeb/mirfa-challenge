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

  const API_URL = 'http://localhost:3001';

  // --- HANDLERS ---
  const handleEncryptAndSave = async () => {
    try {
      setIsLoading(true); setError(''); setEncryptedRecord(null); setDecryptedResult(null);
      const parsedPayload = JSON.parse(payload); 
      
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
      setError(err.message || "Invalid JSON in payload");
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
      // Also fetch the encrypted record so we can see them side-by-side
      const resFetch = await fetch(`${API_URL}/tx/${recordId}`);
      const fetchResult = await resFetch.json();
      if (resFetch.ok) setEncryptedRecord(fetchResult);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- STYLES ---
  const styles = {
    card: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', marginBottom: '24px' },
    input: { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', fontFamily: 'inherit', marginTop: '6px', marginBottom: '16px', boxSizing: 'border-box' as const },
    label: { fontSize: '14px', fontWeight: 600, color: '#475569' },
    buttonPrimary: { width: '100%', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' },
    buttonSecondary: { flex: 1, padding: '10px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' },
    buttonSuccess: { flex: 1, padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' },
    codeBlockDark: { background: '#1e293b', color: '#a7f3d0', padding: '16px', borderRadius: '8px', fontSize: '13px', overflowX: 'auto' as const, fontFamily: 'monospace', margin: '0' },
    codeBlockLight: { background: '#f8fafc', color: '#334155', padding: '16px', borderRadius: '8px', fontSize: '13px', overflowX: 'auto' as const, fontFamily: 'monospace', border: '1px solid #e2e8f0', margin: '0' },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>Secure Transactions Vault</h1>
          <p style={{ color: '#64748b', margin: 0 }}>End-to-End Envelope Encryption Demo (AES-256-GCM)</p>
        </header>

        {error && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px 16px', borderRadius: '8px', border: '1px solid #fca5a5', marginBottom: '24px', fontWeight: 500 }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          
          {/* LEFT COLUMN: Controls */}
          <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column' }}>
            
            {/* Step 1 Card */}
            <div style={styles.card}>
              <h2 style={{ fontSize: '18px', margin: '0 0 16px 0' }}>1. Create Transaction</h2>
              
              <label style={styles.label}>Party ID</label>
              <input value={partyId} onChange={(e) => setPartyId(e.target.value)} style={styles.input} />

              <label style={styles.label}>JSON Payload</label>
              <textarea value={payload} onChange={(e) => setPayload(e.target.value)} rows={5} style={{ ...styles.input, fontFamily: 'monospace', resize: 'vertical' }} />

              <button onClick={handleEncryptAndSave} disabled={isLoading} style={{ ...styles.buttonPrimary, opacity: isLoading ? 0.7 : 1 }}>
                {isLoading ? 'Processing...' : 'Encrypt & Save Record'}
              </button>
            </div>

            {/* Step 2 Card */}
            <div style={styles.card}>
              <h2 style={{ fontSize: '18px', margin: '0 0 16px 0' }}>2. Retrieve & Decrypt</h2>
              
              <label style={styles.label}>Record ID</label>
              <input value={recordId} onChange={(e) => setRecordId(e.target.value)} placeholder="Auto-filled on save..." style={styles.input} />
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleFetch} disabled={isLoading} style={styles.buttonSecondary}>
                  Fetch Only
                </button>
                <button onClick={handleDecrypt} disabled={isLoading} style={styles.buttonSuccess}>
                  Decrypt Payload
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Database & Results */}
          <div style={{ flex: '1 1 450px' }}>
            <div style={{ ...styles.card, minHeight: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '18px', margin: '0' }}>Database View</h2>
              
              {!encryptedRecord && !decryptedResult && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '8px' }}>
                  Submit a transaction to view secure records.
                </div>
              )}

              {encryptedRecord && (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🔒 Stored Encrypted Ciphertext
                  </div>
                  <pre style={styles.codeBlockDark}>
                    {JSON.stringify(encryptedRecord, null, 2)}
                  </pre>
                </div>
              )}

              {decryptedResult && (
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#10b981', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🔓 Decrypted Original Payload
                  </div>
                  <pre style={styles.codeBlockLight}>
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