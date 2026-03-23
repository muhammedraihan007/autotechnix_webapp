cd /workspaces/autotechnix_webapp

# Step 1 — write the .env
cat > backend/.env << 'EOF'
PORT=5000
MONGO_URI=mongodb+srv://autotechnix:mRf186VXnxhPLvGg@cluster0.xcyydqm.mongodb.net/autotechnix
JWT_SECRET=autotechnix_super_secret_jwt_key_2026_xK9mP2qR
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@autotechnix.com
ADMIN_PASSWORD=Admin@123
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=
EOF

echo "✅ .env done"

# Step 2 — install backend deps
cd backend && npm install

# Step 3 — seed database
npm run seed

# Step 4 — start backend
npm run dev &

echo "✅ Backend running!"

