import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    }
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'window',
  },
})







PORT=4000
NODE_ENV=development
MONGO_URI=mongodb+srv://dishcovery:dishcovery123@cluster0.tobtvn5.mongodb.net/?appName=Cluster0
JWT_ACCESS_SECRET="4089e600b90577AcTk1842d457b1e3575"
JWT_REFRESH_SECRET="1b98da0a5d8RfTk48f3d605b342f040b7"
REDIS_PORT=6379
ADMIN_ID='6915b8d204593ec57675de2f'

 
REDIS_REFRESH_EXP=604800
SMTP_HOST='smtp.gmail.com'
MAX_AGE_REFRESH=604800000
OTP_EXP=300
MAX_FILE_COMBINEDROTATETRANSPORT='7d'
MAX_FILE_ERRORROTATETRANSPORT='30d'


AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=
VITE_MAPBOX_TOKEN=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
OPENROUTER_API_KEY=
GOOGLE_CLIENT_ID=