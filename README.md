AUTOTECHNIX - MEARN Car Workshop starter

Folders:
- backend/: Express + Mongoose backend
- react-customer/: React customer app scaffold (basic pages)
- angular-admin/: minimal admin scaffold

Quick start (backend):
1. cd backend
2. cp .env.sample .env and fill values (MONGO_URI, JWT_SECRET)
3. npm install
4. npm run seed
5. npm run dev

React (customer):
1. cd react-customer
2. npm install
3. npm run dev (requires react-scripts)

Notes:
- Uploads stored in backend/uploads and served at /uploads
- WhatsApp integration uses Twilio utility: configure TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM in .env
- Endpoints expect Authorization: Bearer <token>
