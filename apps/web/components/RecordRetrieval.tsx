import { theme } from '../styles/theme';

interface Props {
  recordId: string;
  setRecordId: (val: string) => void;
  isLoading: boolean;
  onFetch: () => void;
  onDecrypt: () => void;
}

export default function RecordRetrieval({ recordId, setRecordId, isLoading, onFetch, onDecrypt }: Props) {
  return (
    <div style={theme.card}>
      <h2 style={theme.sectionTitle}>🔍 Retrieve Record</h2>
      <label style={theme.label}>Record ID</label>
      <input 
        value={recordId} 
        onChange={(e) => setRecordId(e.target.value)} 
        placeholder="Paste Record ID here..." 
        style={theme.input} 
      />
      
      <div style={theme.btnGroup}>
        <button onClick={onFetch} disabled={isLoading} style={theme.btnSecondary}>
          Fetch
        </button>
        <button onClick={onDecrypt} disabled={isLoading} style={theme.btnSuccess}>
          Decrypt
        </button>
      </div>
    </div>
  );
}