# Cortex AI — Full Stack Setup Guide

## Project Structure
```
cortexai/
├── client/          # React 19 + Vite frontend (deploys to Firebase)
├── server/          # Node.js + Express backend (deploys to Render/Railway)
├── sample_data/     # Sample CSV files for testing
└── firebase.json    # Firebase Hosting config
```

---

## 1. Backend Setup (server/)

### Prerequisites
- Node.js 18+
- A free MongoDB Atlas account: https://cloud.mongodb.com

### Steps
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and other secrets
npm install
npm run dev    # starts on http://localhost:5000
```

### .env values to fill in:
| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your Atlas connection string |
| `JWT_SECRET` | Any long random string |
| `CLIENT_ORIGIN` | `http://localhost:5173` (dev) or your Firebase URL (prod) |
| `DEMO_EMAIL` | `demo@cortexai.bio` |
| `DEMO_PASSWORD` | `CortexDemo2025!` |

> On first start, the demo account is auto-created.

### Backend Hosting (Free)
Use **Render.com** (free tier):
1. Connect GitHub repo
2. Set Root Directory = `server`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add all `.env` values as Environment Variables in Render dashboard

---

## 2. Frontend Setup (client/)

```bash
cd client
npm install
npm run dev    # starts on http://localhost:5173
```

For production, update `client/src/services/api.js` baseURL to your Render backend URL, then:
```bash
npm run build
firebase deploy --only hosting
```

---

## 3. Demo Login

| Field | Value |
|-------|-------|
| Email | `demo@cortexai.bio` |
| Password | `CortexDemo2025!` |

---

## 4. Using the CSV Upload

1. Login → Dashboard → "New Analysis" tab
2. Upload **Donor CSV** (must have all 33 columns)
3. Upload **Recipient CSV**
4. Click "Run Compatibility Analysis"

### Required CSV Columns (all 33):
```
age, creatinine, blood_type, hla, bmi, glucose, cholesterol,
blood_pressure_systolic, blood_pressure_diastolic, hemoglobin,
weight, height, heart_rate, potassium, sodium, calcium, phosphorus,
albumin, total_protein, ast, alt, alp, bilirubin, wbc, rbc,
platelets, hba1c, uric_acid, bun, crp, tsh, vitamin_d, iron
```

### blood_type valid values:
`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`

### hla format example:
`A*02:01,B*07:02,C*03:04`

### Sample files:
See `sample_data/donor_sample.csv` and `sample_data/recipient_sample.csv`

---

## 5. What gets calculated

| Metric | Formula |
|--------|---------|
| **CKD-EPI eGFR** | 2021 creatinine formula (no race) |
| **KDPI** | Simplified donor profile score (0–100%) |
| **ABO Compatibility** | Full blood type matrix |
| **HLA Mismatch** | Antigen count comparison |
| **Compatibility Score** | Combined index 0–100 |
| **Risk Level** | Low / Moderate / High / Critical |

---

## 6. Creating doctor accounts

For now create manually via MongoDB Atlas:
1. Go to your cluster → Browse Collections → `users`
2. Insert document:
```json
{
  "email": "doctor@hospital.kz",
  "password": "$2a$12...",  // use bcrypt hash!
  "name": "Dr. Aizat Bekova",
  "role": "doctor"
}
```
Or use a seed script. We can add an admin panel later.
