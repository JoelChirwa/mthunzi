# 🚀 GitHub Actions Setup - Step by Step

## 5-Minute Setup Process

### ⏱️ Time Estimate: 5 minutes
- Step 1: Get FTP credentials → 1 min
- Step 2: Add GitHub Secrets → 2 min
- Step 3: Commit workflow → 1 min
- Step 4: Test deployment → 1 min

---

## 📋 What You Need

Before starting, have ready:
- Your GitHub repository access
- cPanel FTP credentials (see Step 1)

---

## Step 1: Get Your FTP Credentials from cPanel

### In cPanel Dashboard:

1. **Login to cPanel** → `cpanel.mthunzitrust.org`

2. Go to **FTP Accounts** (under Files section)

3. Create a new FTP account OR use existing one:
   - **FTP Account Username:** Note this down ↓
   - **FTP Account Password:** Note this down ↓
   - **Domain:** mthunzitrust.org
   - **Home Directory:** public_html/frontend (or public_html)

4. You should see something like:
   ```
   FTP Host: mthunzitrust.org (or ftp.mthunzitrust.org)
   FTP Username: myaccount (or myaccount@mthunzitrust.org)
   FTP Password: MyPassword123
   ```

✅ **Note these 3 values** - you'll need them in Step 2

---

## Step 2: Add GitHub Secrets

### In GitHub:

1. **Open your repository** → `github.com/yourusername/mthunzi-trust`

2. Click **Settings** (top right)

3. In left sidebar, click **Secrets and variables > Actions**

4. Click **"New repository secret"** button (green button, top right)

5. **Add Secret #1:**
   - **Name:** `FTP_HOST`
   - **Secret:** `mthunzitrust.org` (or your FTP hostname)
   - Click **Add secret**

6. **Add Secret #2:**
   - Name: `FTP_USER`
   - Secret: Your FTP username (e.g., `user@mthunzitrust.org`)
   - Click **Add secret**

7. **Add Secret #3:**
   - Name: `FTP_PASSWORD`
   - Secret: Your FTP password
   - Click **Add secret**

✅ **All 3 secrets added!** They should show:
```
✓ FTP_HOST
✓ FTP_PASSWORD
✓ FTP_USER
```

---

## Step 3: Commit the Workflow File

The workflow file is already created at `.github/workflows/deploy-frontend.yml`

### Push it to GitHub:

```bash
cd mthunzi-trust

# If you haven't already:
git add .github/
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

✅ **Workflow is now active!**

---

## Step 4: Test the Deployment

### Option A: Automatic (Recommended)
Make a small change and push:
```bash
# Make a small change
echo "# Updated" >> frontend/README.md

# Push to GitHub
git add frontend/README.md
git commit -m "Test deployment"
git push origin main
```

### Option B: Manual Trigger
1. Go to **GitHub repo**
2. Click **Actions** tab
3. Click **"Deploy Frontend to cPanel"** (left sidebar)
4. Click **"Run workflow"** button
5. Click **"Run workflow"** in popup

✅ **Deployment started!** Watch in the Actions tab

---

## 📊 Monitor Your Deployment

### In GitHub:

1. Click **Actions** tab on your repo

2. Find the latest run (top of list)

3. It shows:
   - 🟡 **Yellow** = Running
   - 🟢 **Green** = Success
   - 🔴 **Red** = Failed

4. Click the run to see details:
   - Checkout
   - Build
   - Deploy status

### Expected Timeline:
```
⏱️ 0s    - Start
⏱️ 10s   - Install dependencies
⏱️ 30s   - Build Next.js
⏱️ 120s  - Upload to FTP
⏱️ 150s  - Done!
```

✅ **Green checkmark = Success!**

---

## 🎉 You're Done!

From now on:

### To Deploy:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

### That's it! 
- GitHub Actions runs automatically
- Builds your app
- Uploads to cPanel
- Done in ~2 minutes

No manual uploads needed!

---

## 🔄 Next Time You Deploy

You don't need to do anything special. Just:

```bash
# Make changes locally
# ... edit files ...

# Push to GitHub
git add .
git commit -m "Update whatever"
git push origin main

# Workflow runs automatically
# Check GitHub Actions tab to watch it
```

---

## ⚠️ Troubleshooting

### Deployment fails with "FTP connection refused"

**Check:**
1. FTP credentials are correct in GitHub Secrets
2. FTP account is enabled in cPanel
3. Host is correct (ftp.mthunzitrust.org or mthunzitrust.org)

**Fix:**
1. Go to GitHub Settings > Secrets
2. Delete the secrets
3. Re-add them with correct values
4. Try again

### Deployment succeeds but website doesn't update

1. Go to cPanel
2. Node.js Selector → Click **Restart Application**
3. Wait 1-2 minutes
4. Refresh browser (Ctrl+Shift+R)

### Build fails during "Build Next.js" step

1. Click the failed run in GitHub Actions
2. Expand "Build Next.js" section
3. Look for error messages
4. Common issues:
   - Missing environment variables
   - TypeScript errors in code
   - Import errors

**Fix locally first:**
```bash
cd frontend
npm run build
```

If it fails locally, fix it before pushing.

---

## 📈 View Deployment History

**GitHub Actions tab shows:**
- ✅ All successful deployments
- ❌ Any failed deployments
- ⏱️ How long each took
- 📝 Commit message

Perfect for tracking who deployed what and when!

---

## 🎯 Key Points

✅ **Automatic:** Every push triggers deployment
✅ **Fast:** ~2-3 minutes per deployment
✅ **Safe:** Rollback by reverting commit
✅ **Tracked:** Full history in GitHub
✅ **Simple:** No manual uploads

---

## 🚀 Next Steps

1. ✅ Add FTP secrets to GitHub
2. ✅ Push workflow file
3. ✅ Test with `git push`
4. ✅ Watch GitHub Actions
5. ✅ Celebrate! 🎉

---

## 💡 Tips

- **Testing:** Make a test commit and push to see workflow in action
- **Rollback:** Revert the commit if something goes wrong
- **Status Badge:** Add to README.md to show deployment status
- **Notifications:** GitHub notifies you on success/failure

---

## 🎓 Understanding the Workflow

**What GitHub Actions does:**

```
1. Checks out your code
2. Installs Node.js
3. Installs npm dependencies
4. Builds Next.js (creates .next/ folder)
5. Uploads to cPanel via FTP
6. Done! 
```

All automated on GitHub's servers - no local build needed!

---

## ✅ Verification

After 5 minutes, you should have:

- [ ] 3 secrets added to GitHub (FTP_HOST, FTP_USER, FTP_PASSWORD)
- [ ] Workflow file pushed to GitHub
- [ ] .github/workflows/deploy-frontend.yml shows in repo
- [ ] Ready to push code and auto-deploy!

**You're all set! 🚀**

Next time you update code, just push and it deploys automatically!
