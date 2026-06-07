# ✅ GitHub Actions Setup Checklist

## Quick Reference - Complete in 5 Minutes

---

## Phase 1: Prepare FTP Credentials (1 min)

- [ ] Login to cPanel
- [ ] Find FTP Accounts section
- [ ] Create or note FTP credentials:
  - [ ] **FTP_HOST:** `________________` (e.g., mthunzitrust.org)
  - [ ] **FTP_USER:** `________________` (e.g., user@mthunzitrust.org)
  - [ ] **FTP_PASSWORD:** `________________`

---

## Phase 2: Add GitHub Secrets (2 min)

- [ ] Go to GitHub repo → **Settings**
- [ ] Click **Secrets and variables > Actions**
- [ ] Click **"New repository secret"** (green button)

- [ ] **Secret #1: FTP_HOST**
  - Name: `FTP_HOST`
  - Value: ________________
  - Click **Add secret**

- [ ] **Secret #2: FTP_USER**
  - Name: `FTP_USER`
  - Value: ________________
  - Click **Add secret**

- [ ] **Secret #3: FTP_PASSWORD**
  - Name: `FTP_PASSWORD`
  - Value: ________________
  - Click **Add secret**

- [ ] Verify all 3 secrets appear:
  - ✓ FTP_HOST
  - ✓ FTP_PASSWORD
  - ✓ FTP_USER

---

## Phase 3: Commit Workflow (1 min)

```bash
cd mthunzi-trust

# Stage the workflow file
git add .github/

# Commit
git commit -m "Add GitHub Actions CI/CD deployment"

# Push
git push origin main
```

- [ ] Workflow file pushed to GitHub
- [ ] No git errors

---

## Phase 4: Test Deployment (1 min)

**Option A: Make a test commit**
```bash
echo "# Test" >> frontend/README.md
git add .
git commit -m "Test GitHub Actions"
git push origin main
```

**Option B: Manual trigger in GitHub**
1. Go to repo → **Actions** tab
2. Click **"Deploy Frontend to cPanel"** 
3. Click **"Run workflow"** button

- [ ] One of the above done

---

## Phase 5: Monitor (1 min)

- [ ] Go to GitHub repo → **Actions** tab
- [ ] Find the latest deployment run
- [ ] Watch the status:
  - 🟡 Yellow = Running
  - 🟢 Green = Success ✅
  - 🔴 Red = Failed ❌

- [ ] Wait for green checkmark (should take 2-3 minutes)

---

## Phase 6: Verify Site Works

- [ ] Visit `https://mthunzitrust.org/` in browser
- [ ] Page loads (not 503 error)
- [ ] Content displays correctly
- [ ] No errors in browser console (F12)

---

## ✅ Setup Complete!

When all boxes are checked:

**You now have automatic deployments!** 🎉

---

## 🔄 From Now On - Deployment Is This Easy:

```bash
# Make changes
# ... edit files ...

# Commit and push
git add .
git commit -m "Your changes"
git push origin main

# Done! 
# GitHub Actions handles the rest automatically
# Check GitHub Actions tab to watch (optional)
```

---

## 🆘 If Something Goes Wrong

### Deploy fails?
1. Check GitHub Actions tab for error message
2. See troubleshooting in [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md)

### Secrets invalid?
1. Go back to Phase 2
2. Delete the bad secret
3. Re-add with correct value
4. Retry deployment

### FTP connection refused?
1. Verify FTP credentials in cPanel
2. Verify FTP account is enabled
3. Update secrets if credentials changed

### Website doesn't update?
1. Go to cPanel → Node.js Selector
2. Click **Restart Application**
3. Wait 1-2 minutes
4. Refresh browser (Ctrl+Shift+R)

---

## 📊 Success Indicators

✅ All boxes above are checked
✅ GitHub Actions shows green checkmark
✅ Website loads at https://mthunzitrust.org/
✅ No 503 errors
✅ Content displays correctly

---

## 🎓 What Just Happened

You set up **Continuous Deployment (CD)** - meaning:
- Every code push = automatic build and upload
- No manual FTP uploads
- No SSH needed
- Automatic cPanel updates
- Full history in GitHub

**Professional deployment workflow in 5 minutes!** ⭐

---

## 📖 Reference Files

- **Setup guide:** [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md)
- **Workflow file:** [.github/workflows/deploy-frontend.yml](.github/workflows/deploy-frontend.yml)
- **Other methods:** [DEPLOYMENT_METHODS.md](DEPLOYMENT_METHODS.md)

---

## 💡 Pro Tips

1. **Test locally before pushing:**
   ```bash
   cd frontend
   npm run build
   npm start
   ```

2. **Use meaningful commit messages:**
   ```bash
   git commit -m "Fix homepage layout"
   git commit -m "Add new blog feature"
   ```

3. **Watch deployments:**
   - GitHub Actions tab shows all history
   - Green = success, Red = failed
   - Click to see detailed logs

4. **Rollback if needed:**
   - Git revert or reset to previous commit
   - Push again
   - Automatic re-deployment

---

## ✨ You're All Set!

**Setup complete.** You now have enterprise-grade deployment!

Next deployment? Just `git push` and relax. 🚀
