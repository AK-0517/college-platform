const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getColleges = async (params: Record<string, string>) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/colleges?${query}`);
  return res.json();
};

export const getCollege = async (id: string) => {
  const res = await fetch(`${BASE}/colleges/${id}`);
  return res.json();
};

export const compareColleges = async (ids: number[]) => {
  const res = await fetch(`${BASE}/colleges/compare?ids=${ids.join(',')}`);
  return res.json();
};

export const login = async (data: { email: string; password: string }) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const signup = async (data: { email: string; password: string; name: string }) => {
  const res = await fetch(`${BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getSaved = async (token: string) => {
  const res = await fetch(`${BASE}/saved`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const saveCollege = async (collegeId: number, token: string) => {
  const res = await fetch(`${BASE}/saved`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ college_id: collegeId }),
  });
  return res.json();
};

export const unsaveCollege = async (collegeId: number, token: string) => {
  const res = await fetch(`${BASE}/saved/${collegeId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};