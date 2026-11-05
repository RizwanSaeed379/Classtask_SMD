// helpers for the phone number the user types, it has to include the country code

// removes spaces, dashes and brackets: "+92 (315) 506-9889" -> "+923155069889"
export function cleanPhone(text) {
  return text.replace(/[\s()-]/g, '');
}

// returns an error message, or '' when the number is fine
export function checkPhone(text) {
  const phone = cleanPhone(text);
  if (phone === '') return 'Enter your phone number';
  if (!phone.startsWith('+')) return 'Start with the country code, for example +92 300 1234567';
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) return 'That does not look like a valid phone number';
  return '';
}

// +92*******9889, shown while the code is being entered
export function maskPhone(text) {
  const phone = cleanPhone(text);
  return phone.slice(0, 3) + '*'.repeat(Math.max(phone.length - 7, 0)) + phone.slice(-4);
}
