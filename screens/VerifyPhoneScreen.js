import { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';

import Header from '../components/Header';
import Banner from '../components/Banner';
import AppButton from '../components/AppButton';
import { firebaseReady } from '../firebase';
import { requestCode, confirmCode, explainError } from '../otpService';
import { cleanPhone, checkPhone, maskPhone } from '../phoneHelpers';
import { COLORS, OTP_LENGTH, OTP_TEST_MODE, RESEND_SECONDS } from '../constants';

export default function VerifyPhoneScreen({ onVerified }) {
  // three steps: 'phone' -> 'code' -> 'done'
  const [step, setStep] = useState('phone');
  const [phoneText, setPhoneText] = useState('');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const phone = cleanPhone(phoneText);

  // counts the resend timer down once per second
  const counting = secondsLeft > 0;
  useEffect(() => {
    if (!counting) return;
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [counting]);

  async function sendCode() {
    if (busy) return;
    const problem = checkPhone(phoneText);
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    setBusy(true);
    try {
      setConfirmation(await requestCode(phone));
      setCode('');
      setSecondsLeft(RESEND_SECONDS);
      setStep('code');
    } catch (e) {
      setError(explainError(e));
    }
    setBusy(false);
  }

  async function checkCode() {
    if (busy) return;
    if (code.length < OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code`);
      return;
    }
    setError('');
    setBusy(true);
    try {
      await confirmCode(confirmation, code);
      setStep('done');
    } catch (e) {
      setError(explainError(e));
      setCode('');
    }
    setBusy(false);
  }

  function goBackToNumber() {
    setStep('phone');
    setCode('');
    setError('');
  }

  const testBanner = OTP_TEST_MODE ? (
    <Banner
      type="warning"
      title="Test mode"
      message="No real SMS is sent. Use a test number and the code set for it in the Firebase console."
    />
  ) : null;

  if (step === 'done') {
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Header title="You are verified" subtitle="Your phone number has been confirmed" />
        <Banner type="success" title="Phone number verified" message={`${phone} is now linked to your session.`} />
        <View style={{ marginTop: 16 }}>
          <AppButton title="Open CrunchTime" onPress={() => onVerified(phone)} />
        </View>
      </ScrollView>
    );
  }

  if (step === 'code') {
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Header
          title="Enter the code"
          subtitle={`We requested a ${OTP_LENGTH}-digit code for ${maskPhone(phone)}`}
          onBack={goBackToNumber}
        />
        {testBanner}

        <Text style={styles.label}>Verification code</Text>
        <TextInput
          style={[styles.input, styles.codeInput, error !== '' && styles.inputError]}
          placeholder={`${OTP_LENGTH}-digit code`}
          placeholderTextColor={COLORS.muted}
          keyboardType="number-pad"
          maxLength={OTP_LENGTH}
          autoFocus
          value={code}
          onChangeText={(t) => { setCode(t.replace(/\D/g, '')); setError(''); }}
          onSubmitEditing={checkCode}
        />
        {error !== '' && <Banner type="danger" title="Verification failed" message={error} />}

        <View style={{ marginTop: 16 }}>
          <AppButton title={busy ? 'Checking...' : 'Verify code'} onPress={checkCode} />
        </View>

        <Pressable onPress={sendCode} disabled={counting || busy} style={styles.resend}>
          <Text style={[styles.resendText, counting && { color: COLORS.muted }]}>
            {counting ? `Resend code in ${secondsLeft}s` : 'Send the code again'}
          </Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <Header title="Verify your phone" subtitle="We will ask Firebase to send you a 6-digit code" />
      {!firebaseReady && (
        <Banner
          type="danger"
          title="Firebase is not set up"
          message="Copy .env.example to .env, fill in your Firebase keys and restart the app."
        />
      )}
      {testBanner}

      <Text style={styles.label}>Phone number</Text>
      <TextInput
        style={[styles.input, error !== '' && styles.inputError]}
        placeholder="Phone number with country code"
        placeholderTextColor={COLORS.muted}
        keyboardType="phone-pad"
        maxLength={20}
        value={phoneText}
        onChangeText={(t) => { setPhoneText(t); setError(''); }}
        onSubmitEditing={sendCode}
      />
      {error !== '' && <Text style={styles.error}>{error}</Text>}

      <View style={{ marginTop: 20 }}>
        <AppButton title={busy ? 'Sending...' : 'Send code'} onPress={sendCode} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    marginHorizontal: 16,
    color: COLORS.text,
  },
  codeInput: {
    fontSize: 22,
    letterSpacing: 6,
    textAlign: 'center',
    marginBottom: 10,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  error: {
    color: COLORS.danger,
    fontSize: 12,
    marginHorizontal: 16,
    marginTop: 4,
  },
  resend: {
    alignItems: 'center',
    marginTop: 8,
  },
  resendText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});
