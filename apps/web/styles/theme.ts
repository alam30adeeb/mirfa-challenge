export const theme = {
  // --- LAYOUT ---
  container: { minHeight: '100vh', background: '#f1f5f9', color: '#1e293b', fontFamily: 'sans-serif', padding: '20px' },
  wrapper: { maxWidth: '1100px', margin: '0 auto' },
  grid: { display: 'flex', flexWrap: 'wrap' as const, gap: '24px', alignItems: 'flex-start' },
  column: { flex: '1 1 400px', display: 'flex', flexDirection: 'column' as const, gap: '24px' },
  
  // --- HEADER ---
  header: { textAlign: 'center' as const, marginBottom: '40px', paddingTop: '20px' },
  title: { fontSize: '2.5rem', fontWeight: 800, margin: '0 0 10px 0', background: 'linear-gradient(to right, #2563eb, #0891b2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { color: '#64748b', fontSize: '1.1rem', margin: 0 },

  // --- CARDS (Used by Form, Retrieval, View) ---
  card: { background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' },
  sectionTitle: { fontSize: '1.25rem', fontWeight: 700, margin: '0 0 20px 0', color: '#0f172a' },
  
  // --- INPUTS & LABELS ---
  label: { display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '8px' },
  input: { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', marginBottom: '20px', boxSizing: 'border-box' as const },
  codeInput: { fontFamily: 'monospace' }, // Add this to textarea

  // --- BUTTONS ---
  btnPrimary: { width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', opacity: 1 },
  btnGroup: { display: 'flex', gap: '12px' },
  btnSecondary: { flex: 1, padding: '12px', background: 'white', color: '#475569', border: '2px solid #e2e8f0', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
  btnSuccess: { flex: 1, padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },

  // --- RESULTS / CODE BLOCKS ---
  codeBox: { background: '#0f172a', color: '#a5b4fc', padding: '20px', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'monospace', overflowX: 'auto' as const, margin: 0, wordBreak: 'break-all' as const, whiteSpace: 'pre-wrap' as const },
  resultLabel: { fontSize: '0.75rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', display: 'block' },
  
  // --- STATES ---
  error: { background: '#fee2e2', color: '#ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #fecaca', fontWeight: 500 },
  emptyState: { textAlign: 'center' as const, padding: '40px 20px', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '12px' }
};