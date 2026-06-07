# 🚀 Alternative: Deploy via Git (Simple Approach)

If you can't use GitHub Actions, this is the easiest method.

## ✅ How It Works

1. Clone your GitHub repo to cPanel once
2. Every time you push to GitHub, pull the latest code in cPanel
3. cPanel automatically rebuilds and restarts

---

## 🔧 Setup (One-Time via cPanel File Manager)

### Option A: If cPanel has Git Integration

1. Go to **cPanel Dashboard**
2. Look for **"Git Version Control"** or **"Git"**
3. Click **"Create"** and enter:
   - **Repository URL:** `https://github.com/yourusername/mthunzi-trust.git`
   - **Clone to path:** `/home/yourusername/public_html/frontend`
4. Click **Create Repository**

✅ **Done!** Your repo is now cloned to cPanel

---

### Option B: Manual Setup via cPanel SSH (if available)

```bash
cd /home/yourusername/public_html
rm -rf frontend
git clone https://github.com/yourusername/mthunzi-trust.git frontend
cd frontend
npm install --production
npm run build
```

---

## 📝 Daily Workflow

After setup, every time you want to deploy:

### 1. Make changes locally:
```bash
git add .
git commit -m "Update homepage"
git push origin main
```

### 2. Update on cPanel (One of these):

**A) If cPanel has Git UI:**
- Go to **Git Version Control**
- Click your repository
- Click **Pull** button

**B) If you have SSH access:**
```bash
cd /home/yourusername/public_html/frontend
git pull origin main
npm install --production
npm run build
```

**C) If neither works:**
- Just re-upload the `.next/` folder after building locally

---

## ⚠️ Limitations

- Requires Git integration in cPanel (not always available)
- Need to manually rebuild if dependencies change
- Manual pulling on each deploy

---

## Recommendation

**Use GitHub Actions instead** (see [GITHUB_ACTIONS_DEPLOY.md](GITHUB_ACTIONS_DEPLOY.md)) because:
- ✅ Fully automatic
- ✅ One-click rollback
- ✅ No manual steps
- ✅ Always consistent
- ✅ Full deployment history

But if you can't use GitHub Actions, the Git method is your next best option.
