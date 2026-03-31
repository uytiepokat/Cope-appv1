# Cope — Deployment Guide
> Get your app live in ~10 minutes. No coding needed.

---

## Step 1 — Set up your database (Supabase)

1. Go to **supabase.com** and open your project
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the file `SUPABASE_SETUP.sql` from this folder, copy everything, paste it in, and click **Run**
5. You should see "Success. No rows returned" — that means it worked ✓

---

## Step 2 — Deploy to Vercel (free)

1. Go to **vercel.com** → Sign up with GitHub (free)
2. Click **Add New → Project**
3. Click **"Import Git Repository"** — or if you don't have GitHub, click **"Deploy from your computer"**

### If using drag & drop (easiest):
1. Zip this entire `cope-deploy` folder
2. Go to **vercel.com/new**
3. Drag and drop the zip file onto the page
4. In the **Environment Variables** section, add:
   - `VITE_SUPABASE_URL`: (Your Supabase project URL)
   - `VITE_SUPABASE_ANON_KEY`: (Your Supabase project Anon/Public key)
5. Vercel detects Vite automatically — just click **Deploy**
6. In ~60 seconds you'll get a live URL like `cope-abc123.vercel.app` ✓

### If using GitHub (recommended for updates):
1. Create a free account at **github.com**
2. Click **+** → **New repository** → name it `cope` → Create
3. Upload all files from this folder to the repo
4. Go to **vercel.com** → **Add New → Project** → connect your GitHub
5. Select your `cope` repo
6. In the **Environment Variables** section, add:
   - `VITE_SUPABASE_URL`: (Your Supabase project URL)
   - `VITE_SUPABASE_ANON_KEY`: (Your Supabase project Anon/Public key)
7. Click **Deploy**
8. Every time you push updates to GitHub, Vercel auto-redeploys ✓

---

## Step 3 — Done!

Your app is live. Share the URL with anyone.

Users can:
- Create their own account with email + password
- Log in from any device and see all their data
- Each user's data is private and encrypted

---

## Optional: Custom domain (GoDaddy)

1. In Vercel → Go to your project → **Settings** → **Domains**
2. Add your domain (e.g., `yourname.com`)
3. Vercel will give you a **CNAME** or **A Record**
4. Log into **GoDaddy** → Manage DNS → **Add Record**
5. Paste the values from Vercel into GoDaddy
6. Wait 5-10 minutes for it to update (SSL will be automatic) ✓

Costs ~$12/year for a domain.

---

## Troubleshooting

**"Invalid login credentials"** → The user typed the wrong password, or hasn't verified their email yet (check spam)

**Data not syncing** → Make sure you ran the SQL setup in Step 1

**App shows blank screen** → In Vercel → your project → Functions tab → check for error logs
