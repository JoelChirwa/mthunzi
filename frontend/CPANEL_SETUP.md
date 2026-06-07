# 🚀 Mthunzi Trust - Quick cPanel Setup (No Terminal)

## 5-Step Setup for cPanel Without SSH Access

### Step 1: Upload Files via File Manager

1. Login to **cPanel Dashboard**
2. Go to **Files > File Manager**
3. Navigate to `public_html/` folder
4. Upload these folders/files:
   - `.next/` (from your local build)
   - `node_modules/` (if less than hosting limit, else skip and let cPanel install)
   - `public/`
   - `.env.production` file
   - `server.js`
   - `package.json`
   - `package-lock.json`

⚠️ **Critical:** Make sure `.next/` folder is uploaded. Without it, you'll get 503 error.

### Step 2: Open Node.js Selector

1. In cPanel, go to **Software > Select Node.js Version** (or **Node.js Selector**)
2. Find your domain in the list
3. If not there, click **Create Application** and set:
   - **Document Root:** `/home/yourusername/public_html`
   - Click **Create**

### Step 3: Configure Node.js App

1. Click **Edit** next to your application
2. Set these values:
   - **Node.js Version:** `20.x` (or latest available)
   - **Application Entry Point:** `server.js`
   - **Application Startup File:** `server.js`

### Step 4: Add Environment Variables

1. Scroll down to **Environment Variables** section
2. Click **Add Variable** and add each one:

```
Variable Name: NODE_ENV
Variable Value: production

Variable Name: NEXTAUTH_URL
Variable Value: https://mthunzitrust.org/api/nextauth

Variable Name: NEXTAUTH_SECRET
Variable Value: 657dcad071fb73d1a38725557bdb57ecf5cd0a46d6f8a79edc397b0910a602af

Variable Name: NEXT_PUBLIC_BACKEND_URL
Variable Value: https://mthunzitrust.org
```

3. Click **Save**

### Step 5: Restart Application

1. Click **Restart Application** button
2. Wait 30 seconds for restart to complete

✅ **Done!** Your site should now be live at `https://mthunzitrust.org`

---

## ⚠️ If You Still Get 503 Error

### Check List (In Order):

**1. Check .next folder exists:**
- File Manager → public_html → Look for `.next` folder (may be hidden)
- If missing: See "Fixing Missing .next" below

**2. Check Environment Variables:**
- Node.js Selector → Click Edit → Verify all 4 variables are set
- If missing: Add them again and click Save

**3. Check Node.js Version:**
- Node.js Selector → Edit → Should be `20.x` or higher
- If older: Update and restart

**4. Restart Application:**
- Click the **Restart Application** button in Node.js Selector
- Wait 30 seconds and reload your browser

**5. Check Backend Connection:**
- Open `https://mthunzitrust.org/api/health` in browser
- If error: Backend may be down

---

## 🔧 Fixing Missing .next Folder

If `.next/` doesn't exist, you have 2 options:

### Option A: If you have access to terminal later:
- Upload `next_safe/` folder
- Ask hosting support to run: `node deobfuscate.js`
- They should then delete `next_safe/` folder

### Option B: Build locally and upload:
1. From your computer, run:
   ```bash
   npm run build
   ```
2. Upload the `.next/` folder to cPanel
3. Continue with Node.js setup

---

## 🎯 Key Points

- ✅ Server is configured to listen on all interfaces (`0.0.0.0`)
- ✅ Environment variables are production-ready
- ✅ Backend URL is set correctly
- ⚠️ You MUST have `.next/` folder uploaded
- ⚠️ Backend must be running (`https://mthunzitrust.org/api` must be accessible)

---

## 📞 Still Having Issues?

Contact your hosting provider and ask:

1. "Can you verify Node.js app is running for my domain?"
2. "Can you check the Node.js error log for my application?"
3. "What is the port my Node.js app is running on?"
4. "Can you provide terminal access so I can debug?"

Then check [CPANEL_DEPLOYMENT.md](CPANEL_DEPLOYMENT.md) for detailed troubleshooting steps.
