const BASE_URL = 'http://192.168.1.64:3000';

export async function sendOTP(phone) {
  const response = await fetch(`${BASE_URL}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  return response.json();
}

export async function verifyOTP(phone, code) {
  const response = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code })
  });
  return response.json();
}

export async function getCustomers(shopId) {
  const response = await fetch(
    `${BASE_URL}/api/customers?shopId=${shopId}`
  );
  return response.json();
}

export async function addCustomer(shopId, name, phone, address) {
  const response = await fetch(`${BASE_URL}/api/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shopId, name, phone, address })
  });
  return response.json();
}

export async function addTransaction(shopId, customerId, type, amount, note) {
  const response = await fetch(`${BASE_URL}/api/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shopId, customerId, type, amount: parseFloat(amount), note })
  });
  return response.json();
}

export async function getReport(shopId) {
  const response = await fetch(
    `${BASE_URL}/api/reports/summary?shopId=${shopId}`
  );
  return response.json();
}