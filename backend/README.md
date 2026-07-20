# ROZVIK Backend

A small, plain-JavaScript backend for the ROZVIK storefront.
No database to install — data lives in JSON files inside `data/`.

## What it does

- Serves the website itself (`public/`).
- Serves the product catalog to the website.
- Accepts orders from checkout and saves them (with server-side price checks).
- Handles OTP login (mobile number or email).

## Run it

```bash
cd backend
npm install      # one time only
npm start        # starts the server
```

Then open: http://localhost:3000

(Use `npm run dev` to auto-restart when you edit the code.)

## API

| Method | Path                    | What it does                          |
|--------|-------------------------|----------------------------------------|
| GET    | `/api/health`           | Check the server is alive             |
| GET    | `/api/config`           | Money rules + WhatsApp number         |
| GET    | `/api/products`         | List all products                     |
| GET    | `/api/products/:id`     | One product by id                     |
| GET    | `/api/orders`           | List all saved orders (for the owner) |
| POST   | `/api/orders`           | Place an order                        |
| POST   | `/api/auth/request-otp` | Send a login code to phone/email      |
| POST   | `/api/auth/verify-otp`  | Check the code, log the customer in   |
| GET    | `/api/auth/me`          | Who does this session token belong to |

### Placing an order (example)

`POST /api/orders` with this JSON body:

```json
{
  "customer": {
    "name": "Asha",
    "phone": "9876543210",
    "address": "12 Park Lane, Delhi",
    "note": "Ring the bell twice"
  },
  "items": [
    { "productId": 1, "weight": "250g", "qty": 2 },
    { "productId": 6, "weight": "300g (8 pc)", "qty": 1 }
  ]
}
```

The server looks up real prices itself, checks the minimum order,
adds delivery, and saves the order with a number like `RZ1719820000000`.

## OTP login

Right now OTP codes are NOT actually sent as a real text/email —
`otp.js` just prints them to this server's terminal (and, only
while `config.js` has `otpDevMode: true`, hands the code back in
the API response so you can test the login flow without a real
SMS/email provider). Before going live: sign up for an SMS
provider (e.g. MSG91, Twilio) and an email provider (e.g. Resend),
fill in the two TODOs inside `otp.js`, then set `otpDevMode: false`.

## Files

```
backend/
├── server.js          ← starts the app, wires everything together
├── config.js           ← prices, delivery rules, WhatsApp number, port
├── db.js                ← reads/writes the JSON "database" files
├── otp.js                ← OTP generation/verification logic
├── routes/
│   ├── products.js        ← GET /api/products...
│   ├── orders.js           ← GET/POST /api/orders
│   └── auth.js               ← OTP login endpoints
├── data/
│   ├── products.json          ← the catalog (edit prices here)
│   ├── orders.json             ← saved orders (starts empty)
│   └── users.json               ← customers who've logged in
└── public/                       ← the actual website
    ├── index.html
    ├── css/style.css
    └── js/app.js
```

## Where the settings live

Business rules are in `config.js` and currently also in the website's
`CFG` block (`public/js/app.js`). The frontend can read them from
`GET /api/config` so you only change them in one place later.
