# Presh Hairs Backend v2 — Full Setup Guide

Handles: **Customer Login · Cart · Delivery Addresses · Booking Forms**

---

## Project Structure

```
presh-hairs-backend/
├── server.js                  ← App entry point
├── package.json
├── .env.example               ← Copy → .env, fill in your values
├── .gitignore
├── middleware/
│   └── auth.js                ← Protects private routes with JWT
├── models/
│   ├── User.js                ← Customer accounts (passwords hashed)
│   ├── Cart.js                ← Shopping cart (linked to user)
│   ├── Address.js             ← Delivery addresses (linked to user)
│   └── Booking.js             ← Contact/booking form submissions
└── routes/
    ├── auth.js                ← Register, Login, Profile
    ├── cart.js                ← Add, View, Remove cart items
    ├── addresses.js           ← Save, Edit, Delete addresses
    └── bookings.js            ← Submit and manage bookings
```

---

## Step 1 — Install & Configure

```bash
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGO_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — a long random string (run `openssl rand -base64 32` to generate one)
- `FRONTEND_URL` — your GitHub Pages URL

```bash
npm run dev    # start with auto-reload
```

---

## Step 2 — Deploy on Render (free)

1. Push to a new GitHub repo
2. Go to render.com → New Web Service → connect repo
3. Build command: `npm install` · Start command: `npm start`
4. Add your 3 environment variables (MONGO_URI, JWT_SECRET, FRONTEND_URL)
5. Deploy — you get a URL like `https://presh-hairs-api.onrender.com`

---

## Full API Reference

### Auth

| Method | Endpoint | Auth? | What it does |
|--------|----------|-------|--------------|
| POST | /api/auth/register | No | Create new account |
| POST | /api/auth/login | No | Login, get token |
| GET | /api/auth/me | Yes | Get my profile |

**Register example:**
```json
POST /api/auth/register
{
  "fullName": "Amaka Obi",
  "email": "amaka@email.com",
  "phoneNumber": "+234 800 000 0000",
  "password": "securepassword123"
}
```

**Login example:**
```json
POST /api/auth/login
{
  "email": "amaka@email.com",
  "password": "securepassword123"
}
```
Response includes a `token` — save this in your frontend (localStorage) and send it with private requests.

---

### Cart (requires login token)

| Method | Endpoint | What it does |
|--------|----------|--------------|
| GET | /api/cart | Get my cart |
| POST | /api/cart | Add item to cart |
| DELETE | /api/cart/:itemId | Remove one item |
| DELETE | /api/cart | Clear entire cart |

**Add to cart example:**
```json
POST /api/cart
Authorization: Bearer <your_token>
{
  "productName": "Executive Straight Lace Front",
  "collection": "9 to 5 Professionals",
  "price": 55000,
  "quantity": 1,
  "notes": "18 inches, natural black"
}
```

---

### Addresses (requires login token)

| Method | Endpoint | What it does |
|--------|----------|--------------|
| GET | /api/addresses | Get all my addresses |
| POST | /api/addresses | Save a new address |
| PUT | /api/addresses/:id | Update an address |
| DELETE | /api/addresses/:id | Delete an address |

**Save address example:**
```json
POST /api/addresses
Authorization: Bearer <your_token>
{
  "label": "Home",
  "fullName": "Amaka Obi",
  "phoneNumber": "+234 800 000 0000",
  "streetAddress": "12 Rumuola Road",
  "city": "Port Harcourt",
  "state": "Rivers State",
  "isDefault": true
}
```

---

### Bookings (no login required)

| Method | Endpoint | What it does |
|--------|----------|--------------|
| POST | /api/bookings | Submit booking form |
| GET | /api/bookings | View all bookings (admin) |
| PATCH | /api/bookings/:id/status | Update status |

---

## How to Use the Token on Your Frontend

After login, save the token and send it with every private request:

```javascript
// After login — save token
localStorage.setItem('presh_token', result.token);

// On private requests — send token in header
const token = localStorage.getItem('presh_token');

const response = await fetch('https://your-api.onrender.com/api/cart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ productName: '...', collection: '...', price: 55000 }),
});
```

---

## Security Summary

| What | How it's protected |
|------|--------------------|
| Passwords | Hashed with bcrypt (never stored as plain text) |
| Login sessions | JWT token expires after 7 days |
| Private routes | Middleware checks token on every request |
| CORS | Only your GitHub Pages URL can call the API |
| .env secrets | Never committed to GitHub |
