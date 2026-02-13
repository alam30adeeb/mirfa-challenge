import { ApiError } from './errors';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const handleResponse = async (res: Response) => {
  const data = await res.json();
  
  // If the server says "No", throw our custom nice error
  if (!res.ok) {
    throw new ApiError(data.error || 'API request failed', res.status);
  }
  
  return data;
};

// ... (The rest of your encrypt/fetch/decrypt functions stay exactly the same!)
export const encryptTransaction = async (partyId: string, payload: any) => {
  const res = await fetch(`${API_URL}/tx/encrypt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ partyId, payload }),
  });
  return handleResponse(res);
};

export const fetchTransaction = async (id: string) => {
  const res = await fetch(`${API_URL}/tx/${id}`);
  return handleResponse(res);
};

export const decryptTransaction = async (id: string) => {
  const res = await fetch(`${API_URL}/tx/${id}/decrypt`, {
    method: 'POST',
  });
  return handleResponse(res);
};