import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Simple mock in-memory database for OTPs
const otps = new Map<string, string>();

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'otp-backend',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/send-otp' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
              try {
                const { phone, name } = JSON.parse(body);
                const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Secure 6 digits
                otps.set(phone, otp);

                // Print directly to terminal for strict verification
                console.log('\n\n======================================================');
                console.log(`🔐 NEW OTP REQUEST FOR ${name.toUpperCase()} (${phone})`);
                console.log(`>> VERIFICATION CODE: ${otp} <<`);
                console.log('======================================================\n\n');

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, message: 'OTP generated and printed to terminal' }));
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false }));
              }
            });
            return;
          }
          if (req.url === '/api/verify-otp' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
              try {
                const { phone, otp } = JSON.parse(body);
                const validOtp = otps.get(phone);
                res.setHeader('Content-Type', 'application/json');
                if (validOtp && validOtp === otp) {
                  otps.delete(phone); // Burn after use
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true }));
                } else {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ success: false, message: 'Invalid OTP' }));
                }
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false }));
              }
            });
            return;
          }
          next();
        });
      }
    }
  ],
  server: {
    host: true,
    allowedHosts: true,
    cors: true
  }
})

