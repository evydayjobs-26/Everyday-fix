import { useEffect, useState } from 'react';
import { useLocation } from '../hooks/useLocation';
import { MapPin, Map as MapIcon, Loader2 } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: (coords: { latitude: number; longitude: number } | null) => void;
}

type Step = 'splash' | 'auth_input' | 'auth_otp' | 'permission' | 'fetching';

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const { status, error, coordinates, requestLocation } = useLocation();
  const [step, setStep] = useState<Step>('splash');

  // Auth States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Built-in fixed OTP string for local robust testing bypassing all network proxy limits
  const MOCK_SECURE_OTP = '123456';

  // Initial Splash Sequence
  useEffect(() => {
    if (step === 'splash') {
      const t = setTimeout(() => setStep('auth_input'), 2500);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Handle Location state changes
  useEffect(() => {
    if (status === 'loading') {
      setStep('fetching');
    } else if (status === 'success') {
      const timeoutId = setTimeout(() => {
        onComplete(coordinates);
      }, 100);
      return () => clearTimeout(timeoutId);
    } else if (status === 'error') {
      setStep('permission');
    }
  }, [status, coordinates, onComplete]);

  // Front-end bound simulated secure OTP (100% bypasses localtunnel blocks)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 2 || phone.length < 10) {
      setAuthError('Please enter a valid name and 10-digit mobile number.');
      return;
    }
    setAuthError('');
    setLoading(true);

    // Simulate real network delay before sending local alert
    setTimeout(() => {
      setLoading(false);
      window.alert(`✅ Everyday Fix Secure Verification\n\nYour OTP is: ${MOCK_SECURE_OTP}\nDo not share this code with anyone.`);
      setStep('auth_otp');
    }, 800);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setAuthError('Please enter a valid 6-digit OTP.');
      return;
    }
    setAuthError('');
    setLoading(true);

    // Simulate verification delay
    setTimeout(() => {
      setLoading(false);
      if (otp === MOCK_SECURE_OTP) {
        setStep('permission'); // Verification successful! Proceed to Location Flow
      } else {
        setAuthError('Error: Invalid secure code. Please try again.');
      }
    }, 800);
  };

  const handleAllowLocation = async () => {
    setStep('fetching');
    await requestLocation();
  };

  // Fetching screen (zooming pulse effect)
  if (step === 'fetching') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#CFE6F7', width: '100%', position: 'relative', overflow: 'hidden' }}>
        <MapIcon size={380} color="var(--color-primary)" strokeWidth={1} style={{ position: 'absolute', opacity: 0.05, transform: 'rotate(-5deg)', zIndex: 0 }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '32px', width: '80px', height: '80px', zIndex: 10 }}>
          <div className="pulse-ring"></div>
          <div className="pulse-ring" style={{ animationDelay: '0.4s' }}></div>
          <div style={{ backgroundColor: 'var(--color-primary)', borderRadius: '50%', padding: '20px', zIndex: 10, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0, 51, 102, 0.4)' }}>
            <MapPin size={32} color="white" />
          </div>
        </div>
        <p className="animate-fade-in" style={{ color: 'var(--color-primary)', fontSize: '20px', fontWeight: 700, zIndex: 10 }}>Fetching your location...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', padding: '24px', width: '100%', backgroundColor: '#CFE6F7', overflow: 'hidden', position: 'relative' }}>

      {/* Splash Screen - Upgraded typography shadow layers and custom sizing */}
      {step === 'splash' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <div style={{ width: '210px', height: '210px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderRadius: '48px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0, 51, 102, 0.15)', marginBottom: '32px', backgroundColor: 'transparent' }}>
            <img src="/logo.png" alt="Everyday Fix Professional Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 style={{
            color: 'var(--color-primary)',
            fontSize: '48px',
            fontWeight: 900,
            letterSpacing: '-1.5px',
            marginBottom: '6px',
            textShadow: '2px 2px 0px rgba(0, 178, 169, 0.4), 0 8px 16px rgba(0, 51, 102, 0.25)'
          }}>
            Everyday Fix
          </h1>
          <p style={{ color: 'var(--color-secondary)', fontSize: '20px', fontWeight: 800, opacity: 0.9 }}>
            in minutes.
          </p>
        </div>
      )}

      {/* Auth Screen Header - No logo, just text. Repositioned way up for breathing room. */}
      {(step === 'auth_input' || step === 'auth_otp') && (
        <div className="animate-fade-in" style={{ position: 'absolute', top: '5%', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, pointerEvents: 'none' }}>
          <h1 style={{
            fontSize: '44px',
            fontWeight: 900,
            color: 'var(--color-primary)',
            whiteSpace: 'nowrap',
            textShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            Everyday Fix
          </h1>
          <p style={{ color: 'var(--color-primary)', fontSize: '15px', fontWeight: 600, opacity: 0.8, marginTop: '4px' }}>
            Anything, anywhere, anytime.
          </p>
        </div>
      )}

      {/* Authentication Container - Floating safely in the middle */}
      {(step === 'auth_input' || step === 'auth_otp') && (
        <div className="animate-fade-in-up" style={{ zIndex: 10, width: '100%', maxWidth: '380px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '36px 28px', borderRadius: '24px', boxShadow: '0 16px 50px rgba(0, 51, 102, 0.15)', backdropFilter: 'blur(20px)', marginTop: '40px' }}>
          <h2 style={{ color: 'var(--color-primary)', fontSize: '28px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>{step === 'auth_input' ? 'Welcome!' : 'Enter OTP'}</h2>
          <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '24px', lineHeight: 1.4, fontWeight: 500 }}>
            {step === 'auth_input' ? 'Please login to continue.' : 'We have sent a verification code to your device.'}
          </p>

          {authError && <p style={{ color: '#D32F2F', fontSize: '14px', marginBottom: '16px', fontWeight: 600 }}>{authError}</p>}

          {step === 'auth_input' ? (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--color-primary)', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rahul Kumar" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid rgba(0,51,102,0.1)', fontSize: '16px', outline: 'none', backgroundColor: 'white', fontWeight: 500 }} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--color-primary)', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Mobile Number</label>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', border: '2px solid rgba(0,51,102,0.1)', borderRadius: '12px', padding: '0 16px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 600, color: '#6B7280', paddingRight: '12px', borderRight: '1px solid #eee' }}>+91</span>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="9876543210" maxLength={10} style={{ width: '100%', padding: '16px 12px', border: 'none', fontSize: '16px', outline: 'none', backgroundColor: 'transparent', fontWeight: 500 }} />
                </div>
              </div>
              <button type="submit" disabled={loading || name.length < 2 || phone.length < 10} style={{ width: '100%', padding: '16px', borderRadius: '14px', backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '16px', fontWeight: 700, marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: (loading || name.length < 2 || phone.length < 10) ? 0.7 : 1, transition: '0.2s', boxShadow: '0 8px 20px rgba(0, 51, 102, 0.15)', cursor: 'pointer', border: 'none' }}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Get OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--color-primary)', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Secure Verification Code</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="──────" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid var(--color-primary)', fontSize: '28px', letterSpacing: '12px', textAlign: 'center', fontWeight: 'bold', outline: 'none', backgroundColor: 'white' }} />
              </div>
              <button type="submit" disabled={loading || otp.length !== 6} style={{ width: '100%', padding: '16px', borderRadius: '14px', backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '16px', fontWeight: 700, marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: (loading || otp.length !== 6) ? 0.7 : 1, transition: '0.2s', boxShadow: '0 8px 20px rgba(0, 51, 102, 0.15)', cursor: 'pointer', border: 'none' }}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify & Proceed'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Permission Screen */}
      {step === 'permission' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ flex: 1 }} />
          <div className="animate-fade-in-up" style={{ textAlign: 'center', flex: 2 }}>
            <h1 style={{ color: 'var(--color-primary)', fontSize: '44px', fontWeight: 900, letterSpacing: '-1px', marginBottom: '4px', textShadow: '0 4px 12px rgba(0, 51, 102, 0.15)' }}>Everyday Fix</h1>
            <p style={{ color: 'var(--color-primary)', fontSize: '18px', fontWeight: 600, marginBottom: '40px', opacity: 0.85 }}>Fix anything, anytime,<br />anywhere in minutes.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '48px', width: '100%' }}>
            {error && <p className="animate-fade-in" style={{ color: '#D32F2F', fontSize: '15px', textAlign: 'center', fontWeight: 600 }}>{error || 'Location is required.'}</p>}
            <div className="animate-fade-in">
              <div style={{ padding: '0 16px', marginBottom: '12px' }}>
                <p style={{ color: 'var(--color-primary)', fontSize: '15px', lineHeight: 1.5, textAlign: 'center', fontWeight: 600 }}>We need your location to find nearby service providers</p>
              </div>
              <button onClick={handleAllowLocation} disabled={status === 'loading' || status === 'success'} style={{ width: '100%', padding: '18px', borderRadius: '16px', backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(0, 51, 102, 0.2)', cursor: 'pointer', border: 'none' }}>
                Allow Location Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
