# 📦 Simple ZIP Upload Approach

## 🚀 The Easiest Method (No GitHub, No Git, No Terminal)

This approach lets you deploy by just uploading a ZIP file - perfect for quick updates!

---

## ✅ How It Works

1. Run a script locally that **builds and ZIPs** everything
2. Upload the ZIP to cPanel File Manager
3. Extract the ZIP
4. Restart the app

---

## 🔧 Setup (First Time Only)

### Linux/Mac:
```bash
cd mthunzi-trust
chmod +x frontend/quick-deploy.sh
./frontend/quick-deploy.sh
```

### Windows:
```bash
cd mthunzi-trust
frontend\quick-deploy.bat
```

The script will:
1. Install dependencies
2. Build Next.js
3. Create `mthunzi-frontend-TIMESTAMP.zip` file
4. Show you instructions

---

## 📝 Deployment Workflow

### Every time you want to deploy:

**Step 1: Build locally**
```bash
# Linux/Mac
./frontend/quick-deploy.sh

# Windows
frontend\quick-deploy.bat
```

**Step 2: Upload ZIP to cPanel**
- Open cPanel File Manager
- Navigate to `public_html/frontend`
- Click **Upload**
- Select the ZIP file from your `mthunzi-trust/frontend/` folder
- Wait for upload to complete

**Step 3: Extract**
- Right-click the ZIP → **Extract**
- When done, delete the ZIP file

**Step 4: Restart**
- Go to cPanel Node.js Selector
- Click **Restart Application**
- Wait 30 seconds
- Refresh your browser

✅ **Done!** New version is live

---

## 💡 Why This Approach?

✅ **Pros:**
- No GitHub Actions setup needed
- No Git knowledge needed
- Fast ~2-3 MB transfers (only build output)
- Works anywhere
- Simple 4-step process

❌ **Cons:**
- Manual each time
- No automatic history
- No one-click rollback

---

## 🎯 Recommended Order of Approaches

1. **Best:** GitHub Actions (automatic, one-click rollback)
2. **Good:** ZIP Upload (simple, no setup)
3. **OK:** Git Pull (automatic, but needs manual setup)

---

## 📊 File Sizes

The ZIP contains:
- `.next/` - ~50-100 MB
- `node_modules/` - ~200-300 MB
- `public/` - ~5-10 MB
- **Total:** ~300-400 MB

Once extracted, you'll have everything needed to run the app.

---

## ⚡ Pro Tips

- Keep the script handy for quick updates
- ZIP file is safe to delete after extracting
- If upload fails midway, just upload again (ZIP upload resumes)
- Test locally before uploading: `npm run build && npm start`

---

## 🔄 Switching Methods Later

If you want to switch to GitHub Actions later:
1. Just follow [GITHUB_ACTIONS_DEPLOY.md](GITHUB_ACTIONS_DEPLOY.md)
2. No need to change anything in cPanel
3. GitHub will deploy automatically from then on

---

## 📞 Troubleshooting

### ZIP upload too slow?
- Try uploading just the `.next/` folder instead (it's the largest)
- Update only changed files manually

### Extract button not appearing?
- Make sure it's a `.zip` file (not `.rar` or `.tar.gz`)
- Try right-click → **Extract** or use cPanel Extract tool

### Website shows old version after extract?
- Click **Restart Application** in Node.js Selector
- Wait 1-2 minutes
- Hard refresh: `Ctrl+Shift+R`

