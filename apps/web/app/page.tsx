'use client';

import { getErrorMessage } from '../utils/errors';
import { useState } from 'react';
import { theme } from '../styles/theme';
// Import the API service
import { encryptTransaction, fetchTransaction, decryptTransaction } from '../utils/api'; 
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

  // --- CLEAN HANDLERS ---
  const handleEncryptAndSave = async () => {
    try {
      setIsLoading(true); setError(''); setEncryptedRecord(null); setDecryptedResult(null);
      
      let parsedPayload;
      try { parsedPayload = JSON.parse(payload); } catch (e) { throw new Error("Invalid JSON format. Please check your syntax."); }
      
      const data = await encryptTransaction(partyId, parsedPayload);
      
      setEncryptedRecord(data);
      setRecordId(data.id);
    } catch (err) {
      // 🟢 LOOK HOW CLEAN THIS IS NOW!
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetch = async () => {
    try {
      setIsLoading(true); setError(''); setEncryptedRecord(null); setDecryptedResult(null);
      if (!recordId) throw new Error('Please enter a Record ID');

      const data = await fetchTransaction(recordId);
      
      setEncryptedRecord(data);
    } catch (err) {
      // 🟢 SAME CLEAN HANDLER
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrypt = async () => {
    try {
      setIsLoading(true); setError(''); setDecryptedResult(null);
      if (!recordId) throw new Error('Please enter a Record ID');

      const data = await decryptTransaction(recordId);
      
      setDecryptedResult(data.originalPayload);
      
      if (!encryptedRecord) {
        try {
          const recordData = await fetchTransaction(recordId);
          setEncryptedRecord(recordData);
        } catch (ignored) { /* Silent fail is ok here */ }
      }

    } catch (err) {
      // 🟢 SAME CLEAN HANDLER
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <div style={theme.container}>
      <div style={theme.wrapper}>
        <Header />
        {error && <div style={theme.error}>⚠️ {error}</div>}
        <div style={theme.grid}>
          <div style={theme.column}>
            <TransactionForm 
              partyId={partyId} setPartyId={setPartyId}
              payload={payload} setPayload={setPayload}
              isLoading={isLoading} onEncrypt={handleEncryptAndSave}
            />
            <RecordRetrieval 
              recordId={recordId} setRecordId={setRecordId}
              isLoading={isLoading} onFetch={handleFetch} onDecrypt={handleDecrypt}
            />
          </div>
          <div style={theme.column}>
            <DatabaseView encryptedRecord={encryptedRecord} decryptedResult={decryptedResult} />
          </div>
        </div>
      </div>
    </div>
  );
}