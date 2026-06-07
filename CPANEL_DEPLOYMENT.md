# Mthunzi Trust - cPanel Deployment Guide

⚠️ **Note:** This guide assumes **no terminal/SSH access** in cPanel. All steps use the cPanel GUI only.

## 🚀 Quick Fix for 503 Error

The 503 error was caused by the server binding to `localhost` only. This has been fixed in `server.js` and `server.cjs` - they now listen on `0.0.0.0` (all interfaces).

## ✅ Deployment Steps for cPanel (Without Terminal Access)

### 1. **Upload Files to cPanel**

Use **File Manager** in cPanel:
- Upload all files to `public_html/` directory
- Required files:
  - `.next/` (build output)
  - `node_modules/` (dependencies)
  - `public/` (static assets)
  - `.env.production` (environment variables)
  - `server.js` (server entry point)
  - `package.json` (project manifest)
  - `package-lock.json` (dependencies lock)

### 2. **Deobfuscate .next (If Using next_safe)**

**Option A: If you have Web Terminal or command execution:**
- Upload `next_safe/` folder
- Upload `deobfuscate.js` script
- Run the script (may need to ask hosting support)

**Option B: If next_safe already deobfuscated:**
- Simply upload the `.next/` folder directly
- Skip deobfuscation

**⚠️ Important:** The `.next` folder MUST exist before starting Node.js. Without it, you'll get 503 errors.

### 3. **Configure & Start Node Server**

In **cPanel Dashboard**:

1. Go to **Software > Node.js Selector** (or **Select Node.js Version**)

2. Find your domain/addon domain in the list

3. If not listed, create a new Node.js app:
   - **Document Root:** `/home/yourusername/public_html`
   - **Application Mode:** `Production`
   - **Application Startup File:** `server.js`
   - **Node.js Version:** `18.x` or `20.x` (recommended 20+)
   - Click **Create**

4. Once created, click **Edit** to configure:
   - **Node.js Version:** Set to `20.x` (or latest available)
   - **Application Startup File:** `server.js`
   - **Environment variables:** Add these
     ```
     NODE_ENV=production
     NEXTAUTH_URL=https://mthunzitrust.org/api/nextauth
     NEXTAUTH_SECRET=657dcad071fb73d1a38725557bdb57ecf5cd0a46d6f8a79edc397b0910a602af
     NEXT_PUBLIC_BACKEND_URL=https://mthunzitrust.org
     ```
   - Click **Save**

5. Click **Restart Application**

### 4. **Verify Server Status**

Test in your browser:
```
https://mthunzitrust.org

Expected: Homepage loads (not 503 error)
```

Or test the health endpoint:
```
https://mthunzitrust.org/api/health

Expected: JSON response like {"status":"healthy",...}
```

## 🔧 Troubleshooting 503 Errors (No Terminal Access)

### Check 1: .next Directory Exists
- Go to **File Manager** in cPanel
- Navigate to `public_html/`
- Look for `.next` folder (it may be hidden)
- If missing: Upload the `.next/` folder or run deobfuscation via hosting support

### Check 2: Environment Variables in cPanel
- Go to **Software > Node.js Selector**
- Click **Edit** on your application
- Scroll to **Environment Variables** section
- Verify these are set:
  ```
  NODE_ENV=production
  NEXTAUTH_URL=https://mthunzitrust.org/api/nextauth
  NEXT_PUBLIC_BACKEND_URL=https://mthunzitrust.org
  ```
- If missing, add them and click **Save**
- Click **Restart Application**

### Check 3: Node.js Version
- Go to **Software > Node.js Selector**
- Click **Edit** on your application
- Ensure Node.js version is **18.x or higher** (recommended 20+)
- If outdated, upgrade and **Restart**

### Check 4: Backend Connectivity
- Test if backend is reachable from your browser:
  ```
  https://mthunzitrust.org/api/health
  ```
- If it returns an error, the backend may be down
- Contact your hosting provider to verify backend is running

### Check 5: View Error Logs
- Go to **cPanel Dashboard > Error Pages**
- Look for error logs related to Node.js app
- Or in **File Manager**, check for `error.log` in `public_html/`
- Common errors:
  - `Cannot find module` - Missing `node_modules/`
  - `EADDRINUSE` - Another app using the same port
  - `Cannot find .next` - Missing `.next/` folder

## 📋 Checklist Before Production

- [ ] `.next` folder uploaded to `public_html/`
- [ ] `.env.production` file exists in `public_html/`
- [ ] `node_modules/` folder uploaded (or auto-installed by cPanel)
- [ ] `server.js` exists in `public_html/`
- [ ] Node.js Selector configured with correct startup file
- [ ] Environment variables set in Node.js Selector:
  - [ ] `NODE_ENV=production`
  - [ ] `NEXTAUTH_URL=https://mthunzitrust.org/api/nextauth`
  - [ ] `NEXTAUTH_SECRET=[your secret]`
  - [ ] `NEXT_PUBLIC_BACKEND_URL=https://mthunzitrust.org`
- [ ] Node.js version is 18+ (recommended 20+)
- [ ] Backend is running and accessible
- [ ] CORS enabled on backend
- [ ] Server hostname is `0.0.0.0` ✅ (Already fixed)
- [ ] Application Restart clicked after configuration

## 🔗 API Connection Flow

```
Frontend (https://mthunzitrust.org)
        ↓
  NEXT_PUBLIC_BACKEND_URL
        ↓
Backend (https://mthunzitrust.org/api)
        ↓
MongoDB (remote or local)
```

**To verify backend is accessible:**
- Open your browser and visit: `https://mthunzitrust.org/api/health`
- You should see a JSON response with `"status": "healthy"`
- If you get an error, the backend may be down or inaccessible

## 💾 Rollback If Issues Occur

If the app shows 503:

1. **Stop Node.js App**
   - Go to **Software > Node.js Selector**
   - Click **Stop Application**

2. **Check logs** (see Troubleshooting section above)

3. **Verify files exist**
   - File Manager → Check `.next/`, `server.js`, `package.json`

4. **Restart application**
   - Go to **Software > Node.js Selector**
   - Click **Restart Application**

5. **Contact hosting support if issues persist**
   - Ask them to check Node.js process logs
   - Request terminal access for debugging (if possible)

---

**Last Updated:** 2026-06-07
**Fixed Issues:** Server hostname binding (localhost → 0.0.0.0)
