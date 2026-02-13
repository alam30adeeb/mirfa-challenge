import { theme } from '../styles/theme';

interface Props {
  partyId: string;
  setPartyId: (val: string) => void;
  payload: string;
  setPayload: (val: string) => void;
  isLoading: boolean;
  onEncrypt: () => void;
}

export default function TransactionForm({ partyId, setPartyId, payload, setPayload, isLoading, onEncrypt }: Props) {
  return (
    <div style={theme.card}>
      <h2 style={theme.sectionTitle}>📝 Create Transaction</h2>
      
      <label style={theme.label}>Party ID</label>
      <input 
        value={partyId} 
        onChange={(e) => setPartyId(e.target.value)} 
        style={theme.input} 
        placeholder="e.g. party_001"
      />

      <label style={theme.label}>JSON Payload</label>
      <textarea 
        value={payload} 
        onChange={(e) => setPayload(e.target.value)} 
        rows={6}
        style={{ ...theme.input, ...theme.codeInput }} 
      />

      <button 
        onClick={onEncrypt} 
        disabled={isLoading}
        style={{ ...theme.btnPrimary, opacity: isLoading ? 0.7 : 1 }}
      >
        {isLoading ? 'Processing...' : 'Encrypt & Save Record'}
      </button>
    </div>
  );
}