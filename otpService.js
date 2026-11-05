import { signInWithPhoneNumber } from 'firebase/auth';

import { auth } from './firebase';
import { OTP_TEST_MODE } from './constants';

// Firebase test numbers: no SMS is sent and the code is the one set in the Firebase console.
// Turning app verification off lets this run in Expo Go (there is no reCAPTCHA page there).
if (auth && OTP_TEST_MODE) {
  auth.settings.appVerificationDisabledForTesting = true;
}

// stands in for the reCAPTCHA check, Firebase only accepts it for test numbers
const testVerifier = {
  type: 'recaptcha',
  verify: () => Promise.resolve('test-token'),
  _reset: () => {},
};

// asks Firebase to send a code, resolves with a "confirmation" used in the next step
export function requestCode(phoneNumber) {
  if (!auth) {
    const error = new Error('Firebase is not set up');
    error.code = 'app/not-configured';
    return Promise.reject(error);
  }
  return signInWithPhoneNumber(auth, phoneNumber, testVerifier);
}

// checks the code the user typed, signs the user in when it is correct
export function confirmCode(confirmation, code) {
  return confirmation.confirm(code);
}

const messages = {
  'app/not-configured': 'Firebase keys are missing. Copy .env.example to .env, fill it in and restart the app.',
  'auth/configuration-not-found':
    'Authentication is not set up in Firebase yet. Open Authentication, click Get started, then enable the Phone provider.',
  'auth/invalid-phone-number': 'Firebase does not accept this phone number.',
  'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
  'auth/quota-exceeded': 'The SMS limit was reached. Try again later.',
  'auth/operation-not-allowed':
    'Blocked by Firebase. Enable the Phone provider, and allow this country under Authentication > Settings > SMS region policy.',
  'auth/invalid-app-credential': 'This is not a test number. Add it under "Phone numbers for testing" in Firebase.',
  'auth/captcha-check-failed': 'This is not a test number. Add it under "Phone numbers for testing" in Firebase.',
  'auth/billing-not-enabled':
    'Firebase treated this as a real number (real SMS needs a paid plan). Add it under "Phone numbers for testing" in Firebase and save.',
  'auth/invalid-verification-code': 'That code is wrong. Check it and try again.',
  'auth/code-expired': 'That code has expired. Go back and request a new one.',
  'auth/network-request-failed': 'No internet connection. Check your network and try again.',
};

// turns a Firebase error into a sentence the user can understand
export function explainError(error) {
  return messages[error && error.code] || (error && error.message) || 'Something went wrong. Please try again.';
}
