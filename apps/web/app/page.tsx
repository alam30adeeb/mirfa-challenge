'use client';

import { useState } from 'react';
import { theme } from '../styles/theme';
import Header from '../components/Header';
import TransactionForm from '../components/TransactionForm';
import RecordRetrieval from '../components/RecordRetrieval';
import DatabaseView from '../components/DatabaseView';

export default function Page() {
  // --- STATE ---
  const [partyId, setPartyId] = useState('party_123');
  const [payload, setPayload] = useState('{\n  "amount": 100,\n  "currency": "AED"\n}');
  const [recordId, setRecordId] = useState('');
  
  const [encryptedRecord, setEncryptedRecord] = useState<any>(null);
  const [decryptedResult, setDecryptedResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // --- HANDLERS ---
  const handleEncryptAndSave = async () => {
    try {
      setIsLoading(true); setError(''); setEncryptedRecord(null); setDecryptedResult(null);
      
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
      
      // Auto-fetch the encrypted record too if it's missing (for visual comparison)
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

  return (
    <div style={theme.container}>
      <div style={theme.wrapper}>
        
        <Header />

        {error && <div style={theme.error}>⚠️ {error}</div>}

        <div style={theme.grid}>
          
          {/* LEFT COLUMN: Controls */}
          <div style={theme.column}>
            <TransactionForm 
              partyId={partyId} 
              setPartyId={setPartyId}
              payload={payload} 
              setPayload={setPayload}
              isLoading={isLoading} 
              onEncrypt={handleEncryptAndSave}
            />

            <RecordRetrieval 
              recordId={recordId} 
              setRecordId={setRecordId}
              isLoading={isLoading} 
              onFetch={handleFetch} 
              onDecrypt={handleDecrypt}
            />
          </div>

          {/* RIGHT COLUMN: Display */}
          <div style={theme.column}>
            <DatabaseView 
              encryptedRecord={encryptedRecord} 
              decryptedResult={decryptedResult} 
            />
          </div>

        </div>
      </div>
    </div>
  );
}