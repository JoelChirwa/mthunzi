# 🔧 Diagnose Current cPanel Setup

Based on your screenshots, let me help you verify everything is working.

---

## ✅ What Looks Good

From your cPanel screenshots:
- ✅ Node.js version: `20.20.2` (perfect)
- ✅ Application mode: `Production` (correct)
- ✅ Startup file: `server.js` (correct)
- ✅ `.next` folder exists (critical!)
- ✅ Files uploaded to `public_html/frontend`

---

## ❓ Possible Issues & Fixes

### Issue 1: Application Root Path

**Current setting:** `public_html/frontend`

**Check if this is correct:**
- In cPanel, the path `public_html/frontend` means:
  - Files are in: `/home/yourusername/public_html/frontend/`
  - App loads from: `https://mthunzitrust.org/`

**If your domain is NOT at root:**
- Check if you need subdomain or different path
- Ask: "Is the app loading from https://mthunzitrust.org or somewhere else?"

---

### Issue 2: Environment Variables

**Check in cPanel Node.js Selector → Edit:**

Required variables:
```
NODE_ENV = production
NEXTAUTH_URL = https://mthunzitrust.org/api/nextauth
NEXTAUTH_SECRET = 657dcad071fb73d1a38725557bdb57ecf5cd0a46d6f8a79edc397b0910a602af
NEXT_PUBLIC_API_URL = https://mthunzitrust.org/api
NEXT_PUBLIC_BACKEND_URL = https://mthunzitrust.org
NEXT_PUBLIC_SITE_URL = https://mthunzitrust.org
NEXT_PUBLIC_APP_URL = https://mthunzitrust.org
```

**If any are missing:**
- Add them in Node.js Selector → Edit → Environment Variables
- Click Save
- Click Restart Application

---

### Issue 3: Backend Connection

**Test backend from browser:**
```
Visit: https://mthunzitrust.org/api/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-06-07T...",
  "environment": "production"
}
```

**If you get error:**
- Backend is not running or not accessible
- Contact hosting support to verify backend is live

---

### Issue 4: .next Folder Contents

**Check File Manager → public_html/frontend/.next/**

Should contain folders like:
```
.next/
├── server/
├── static/
├── cache/
└── build/
```

**If it's empty or only has `.safe` files:**
- Run `node deobfuscate.js` in cPanel (needs terminal access)
- OR upload a fresh `.next/` folder
- OR use one of the deployment methods

---

## 🧪 Verification Checklist

Put a ✅ next to each item:

**In cPanel Node.js Selector:**
- [ ] Node.js version is 20.x or higher
- [ ] Application startup file is `server.js`
- [ ] Application root is `public_html/frontend` (or correct path)
- [ ] All environment variables are set
- [ ] Application status shows "Running" (green)

**Files in cPanel (public_html/frontend):**
- [ ] `.next` folder exists
- [ ] `.next` folder has `server/`, `static/`, etc.
- [ ] `server.js` file exists
- [ ] `package.json` file exists
- [ ] `node_modules` folder exists (may be hidden)
- [ ] `.env.production` file exists

**Backend Connectivity:**
- [ ] Backend is running
- [ ] `https://mthunzitrust.org/api/health` returns valid JSON
- [ ] Frontend can reach backend

**Browser Test:**
- [ ] `https://mthunzitrust.org/` loads (not 503)
- [ ] Page shows content (not error)
- [ ] Check browser console for JavaScript errors (F12 → Console)

---

## 🚀 If Everything Checks Out But Still Getting 503

**Step 1: Restart Application**
- Go to Node.js Selector
- Click **Restart Application**
- Wait 1-2 minutes
- Refresh browser

**Step 2: Check Process**
- If cPanel shows terminal, run: `ps aux | grep node`
- Should show Node.js process running

**Step 3: Check Logs**
- cPanel Dashboard → Error Pages → Check error log
- Look for error messages related to Node.js

**Step 4: Try a Different Port**
- Some cPanel setups auto-assign ports
- Verify the port shown in Node.js Selector
- Make sure that port isn't blocked

**Step 5: Contact Hosting Support**
- Ask them to check Node.js app logs
- Ask if port 3000+ is available
- Ask if they can verify the process is running

---

## 📝 Questions to Ask Yourself

1. **Is the backend running?**
   - Visit: `https://mthunzitrust.org/api/health`
   - If error → backend is down

2. **Did files upload correctly?**
   - Check .next folder has content
   - Check server.js exists

3. **Are environment variables set?**
   - All 6+ variables configured in cPanel
   - Click Save and Restart after adding

4. **Is Node.js process running?**
   - Ask hosting provider to check
   - May need terminal access to verify

5. **Is there a port conflict?**
   - Another app using port 3000
   - cPanel can auto-assign different port

---

## 🎯 Quick Fixes (Try These First)

### Fix 1: Restart (Most Common)
```
Node.js Selector → Restart Application
Wait 30 seconds → Refresh browser
```

### Fix 2: Add Missing Variables
```
Node.js Selector → Edit → Add all environment variables
Click Save → Restart Application
```

### Fix 3: Verify .next Exists
```
File Manager → Check if public_html/frontend/.next exists
If not: upload it or run deobfuscate.js
```

### Fix 4: Check Backend
```
Browser: https://mthunzitrust.org/api/health
If error: backend is down
```

### Fix 5: Hard Refresh
```
Browser: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
This clears cache and reloads
```

---

## 💡 Next Steps

### If Everything Works:
→ Go to [DEPLOYMENT_METHODS.md](DEPLOYMENT_METHODS.md) to set up easier deployments

### If Something's Wrong:
1. Follow the checklist above
2. Apply the Quick Fixes
3. Tell me what you find and I'll help debug

### If You Want Better Deployment:
1. Try [ZIP_DEPLOYMENT.md](ZIP_DEPLOYMENT.md) for simple uploads
2. Or [GITHUB_ACTIONS_DEPLOY.md](GITHUB_ACTIONS_DEPLOY.md) for automatic

---

## 🆘 Still Stuck?

Reply with:
1. What URL shows 503? (exact URL)
2. What does `https://mthunzitrust.org/api/health` return?
3. Check cPanel error log - any error messages?
4. Is `.next` folder present in File Manager?

Then I can help debug further!
