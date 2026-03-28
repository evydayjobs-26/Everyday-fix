import { useState, useEffect } from 'react';
import { Home as HomeIcon, CalendarDays, Coins, User, ChevronDown } from 'lucide-react';

interface Coordinates { latitude: number; longitude: number; }
interface HomeScreenProps { coordinates: Coordinates | null; }

export function HomeScreen({ coordinates }: HomeScreenProps) {
  const [addressLine1, setAddressLine1] = useState('Locating...');
  const [addressLine2, setAddressLine2] = useState('');
  const [showAddressMenu, setShowAddressMenu] = useState(false);

  useEffect(() => {
    if (coordinates) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.latitude}&lon=${coordinates.longitude}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.address) {
            // Use accurate location data instead of hardcoded fallbacks
            const primary = data.address.house_number || data.address.building || data.address.road || 'Current Location';
            const secondary = `${data.address.neighbourhood || data.address.suburb || ''}, ${data.address.city || data.address.town || ''}`;
            setAddressLine1(primary);
            setAddressLine2(secondary.replace(/^,\s*/, '')); // Clean up leading commas
          }
        })
        .catch(() => {
          setAddressLine1('Current Location');
          setAddressLine2('Location accurate to your coordinates');
        });
    }
  }, [coordinates]);

  return (
    <div style={{
      // User requested background: Top dark blue, transitioning quickly to light/mid blues dragging down 90% of the screen
      background: 'linear-gradient(to bottom, var(--color-primary) 0%, var(--color-accent) 15%, #CFE6F7 40%, #EBF5FB 100%)',
      minHeight: '100vh',
      width: '100%',
      paddingBottom: '100px',
      fontFamily: 'var(--font-family)',
      overflowX: 'hidden',
      position: 'relative'
    }}>

      {/* Header Bar */}
      <div style={{ position: 'relative', zIndex: 10, padding: '24px 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

        {/* Clickable Location Header */}
        <div
          style={{ flex: 1, color: 'white', cursor: 'pointer' }}
          onClick={() => setShowAddressMenu(true)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '22px', fontWeight: 800 }}>{addressLine1}</span>
            <ChevronDown size={20} strokeWidth={3} style={{ marginTop: '2px' }} />
          </div>
          <p style={{ fontSize: '15px', fontWeight: 600, opacity: 0.95, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '210px' }}>
            {addressLine2 || 'Fetching accuracy...'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button style={{ backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: '40px', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
            <Coins size={20} color="#FBBF24" fill="#FBBF24" />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
              <span style={{ fontSize: '11px', opacity: 0.9 }}>Earn</span>
              <span style={{ fontSize: '15px' }}>₹100</span>
            </div>
          </button>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={22} color="white" />
          </div>
        </div>
      </div>

      {/* Promo Banner - Blue Theme */}
      <div style={{ position: 'relative', zIndex: 10, margin: '0 20px', borderRadius: '24px', overflow: 'hidden', height: '190px', boxShadow: '0 12px 30px rgba(0, 51, 102, 0.2)' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop)',
          backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0
        }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(0,51,102,0.95) 0%, rgba(0,51,102,0.2) 100%)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2, padding: '28px 24px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', maxWidth: '65%' }}>
          <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 900, lineHeight: 1.1, marginBottom: '12px', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            Bathroom Looking Dull?
          </h2>
          <p style={{ color: 'white', fontSize: '14px', fontWeight: 600, opacity: 0.95, marginBottom: '16px', lineHeight: 1.3 }}>
            Professional cleaning at your doorstep
          </p>
          <button style={{ backgroundColor: 'white', color: 'var(--color-primary)', padding: '10px 24px', borderRadius: '8px', fontWeight: 800, fontSize: '14px', alignSelf: 'flex-start', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            BOOK NOW
          </button>
        </div>
      </div>

      {/* Main Content Sections */}
      <div style={{ position: 'relative', zIndex: 10, marginTop: '36px', padding: '0 20px' }}>

        {/* Instant House Help */}
        <div style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1A1A1A', marginBottom: '4px' }}>Instant House Help</h2>
          <p style={{ fontSize: '15px', color: '#555', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            At your doorstep in <strong style={{ color: 'var(--color-secondary)' }}>15 mins</strong> <span style={{ color: '#FBBF24' }}>⚡</span>
          </p>

          {/* Scrolling Horizontal Cards */}
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none', margin: '0 -20px', paddingLeft: '20px', paddingRight: '20px' }}>

            {[
              { time: '0.5 hr', price: '25', original: '125', save: '100.0' },
              { time: '1 hr', price: '49', original: '250', save: '201.0' },
              { time: '1.5 hr', price: '99', original: '299', save: '200.0' }
            ].map((pkg, idx) => (
              <div key={idx} style={{
                minWidth: '160px', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.8)', borderRadius: '24px', padding: '20px', flexShrink: 0,
                backgroundImage: 'repeating-linear-gradient(45deg, rgba(0, 178, 169, 0.04) 0, rgba(0, 178, 169, 0.04) 2px, transparent 2px, transparent 12px)',
                boxShadow: '0 8px 24px rgba(0, 51, 102, 0.04)'
              }}>
                <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#1A1A1A', marginBottom: '12px' }}>{pkg.time}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: '#1A1A1A' }}>₹{pkg.price}</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#9CA3AF', textDecoration: 'line-through' }}>₹{pkg.original}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-secondary)' }}>Save ₹{pkg.save}</span>
                  <div style={{ flex: 1, borderBottom: '2px dashed rgba(0,0,0,0.1)' }} />
                </div>
                <button style={{ width: '100%', padding: '14px', border: '2px solid #E5E7EB', borderRadius: '14px', fontSize: '16px', fontWeight: 800, color: 'var(--color-primary)', backgroundColor: 'white' }}>
                  BOOK
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Book for Later */}
        <div style={{ paddingBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1A1A1A', marginBottom: '4px' }}>Book for Later</h2>
          <p style={{ fontSize: '15px', color: '#555', fontWeight: 600, marginBottom: '20px' }}>Select your slot & stay worry-free</p>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.8)', borderRadius: '24px', padding: '24px 20px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0, 51, 102, 0.04)' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1A1A', zIndex: 2, lineHeight: 1.3 }}>Schedule<br />Booking</h3>
              <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: '#BFE0F7', width: '90px', height: '90px', borderRadius: '50%', zIndex: 1 }} />
            </div>
            <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.8)', borderRadius: '24px', padding: '24px 20px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0, 51, 102, 0.04)' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1A1A', zIndex: 2, lineHeight: 1.3 }}>Recurring<br />Booking</h3>
              <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: '#BFE0F7', width: '90px', height: '90px', borderRadius: '50%', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--color-secondary)' }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Address Selection Modal / Drawer */}
      {showAddressMenu && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end', animation: 'fadeIn 0.2s' }}>
          <div style={{ backgroundColor: 'white', width: '100%', padding: '24px', borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s' }}>
            <div style={{ width: '40px', height: '4px', backgroundColor: '#E5E7EB', borderRadius: '4px', alignSelf: 'center', marginBottom: '24px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>Select an Address</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '16px', marginBottom: '16px', backgroundColor: '#F9FAFB' }}>
              <div style={{ padding: '8px', backgroundColor: '#EBF5FB', borderRadius: '50%' }}>
                <HomeIcon size={20} color="var(--color-primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: '15px' }}>Current Location</p>
                <p style={{ fontSize: '13px', color: '#6B7280' }}>{addressLine1}, {addressLine2}</p>
              </div>
            </div>
            <button
              onClick={() => {
                alert("Add new address flow will open here.");
                setShowAddressMenu(false);
              }}
              style={{ padding: '16px', border: '2px dashed #CBD5E1', borderRadius: '16px', backgroundColor: 'transparent', color: 'var(--color-primary)', fontWeight: 700, fontSize: '16px', cursor: 'pointer', marginBottom: '16px' }}>
              + Add a new address
            </button>
            <button
              onClick={() => setShowAddressMenu(false)}
              style={{ width: '100%', padding: '16px', backgroundColor: 'var(--text-primary)', color: 'white', borderRadius: '16px', fontWeight: 800, fontSize: '16px', border: 'none' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderRadius: '32px 32px 0 0', boxShadow: '0 -8px 30px rgba(0,0,0,0.06)', zIndex: 50 }}>
        <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#EBF5FB', color: 'var(--color-primary)', padding: '14px', borderRadius: '100px', fontWeight: 800, fontSize: '16px', border: 'none' }}>
          <HomeIcon size={22} strokeWidth={2.5} />
          <span>Home</span>
        </button>
        <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#6B7280', padding: '14px', background: 'transparent', fontWeight: 700, fontSize: '16px', border: 'none' }}>
          <CalendarDays size={22} strokeWidth={2.5} />
          <span>Bookings</span>
        </button>
      </div>

    </div>
  );
}
