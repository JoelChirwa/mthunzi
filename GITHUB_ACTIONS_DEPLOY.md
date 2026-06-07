# GitHub Actions - Automatic Deployment to cPanel

## 🚀 Setup (One-Time)

### 1. Add GitHub Secrets

Go to your GitHub repo → **Settings > Secrets and variables > Actions**

Add these 3 secrets:

| Secret | Value |
|--------|-------|
| `FTP_HOST` | Your cPanel hostname (e.g., `mthunzitrust.org` or IP) |
| `FTP_USER` | Your cPanel FTP username |
| `FTP_PASSWORD` | Your cPanel FTP password |

**To find FTP credentials in cPanel:**
- cPanel Dashboard → FTP Accounts
- Create or view existing FTP account
- Copy the hostname and credentials

### 2. Trigger First Deployment

The workflow runs automatically when you push to `main`, `master`, or `deployment` branch.

To test manually:
1. Go to GitHub repo
2. Click **Actions**
3. Select **"Deploy Frontend to cPanel"**
4. Click **"Run workflow"** button

---

## ✅ What It Does

1. **Checks out** your code from GitHub
2. **Installs** Node.js dependencies (production only)
3. **Builds** Next.js (`npm run build`)
4. **Uploads** `.next/`, `public/`, `node_modules/`, and config files to cPanel
5. **Syncs** files (deletes files removed from repo)
6. **Auto-restarts** app (usually happens automatically)

---

## 📝 Usage

### Deploy Latest Changes:
```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Workflow runs automatically → Check **GitHub Actions** tab for status → Site updates in ~2 minutes

### Rollback to Previous Version:
1. Go to GitHub **Actions** tab
2. Find previous successful deployment
3. Click **Re-run** button

---

## 🔧 Customization

### Deploy Only on Tags:
Replace in `.github/workflows/deploy-frontend.yml`:
```yaml
on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:
```

Then deploy with:
```bash
git tag v1.0.0
git push origin v1.0.0
```

### Deploy Multiple Branches:
```yaml
on:
  push:
    branches:
      - main
      - staging
      - production
```

---

## ⚠️ Troubleshooting

### Workflow fails with "FTP connection refused"
- Check FTP credentials in Secrets are correct
- Verify FTP account is enabled in cPanel
- Check firewall isn't blocking port 21 (FTP)

### Website still shows old version after deployment
- cPanel may take 1-2 minutes to restart app
- Try clicking **Restart Application** in Node.js Selector
- Hard refresh browser: `Ctrl+Shift+R`

### Files not syncing properly
- Check that `.gitignore` isn't excluding important files
- Verify `node_modules` is being installed in workflow
- Check cPanel permissions on `public_html/frontend`

---

## 📊 Monitoring Deployments

View deployment history:
1. Go to GitHub repo
2. Click **Actions** tab
3. View all deployment runs with status ✅ or ❌
4. Click run to see logs if failed

---

## 🎯 Benefits vs Manual Upload

| Aspect | Manual Upload | GitHub Actions |
|--------|---------------|-----------------|
| Upload Speed | 10-30 min | 2-3 min |
| Dependencies | Manual | Automatic |
| Build | Manual | Automatic |
| Consistency | Error-prone | Guaranteed |
| Tracking | Manual | Full history |
| Rollback | Complex | One click |
| Team coordination | Confusing | Clear |

---

## 💡 Next Steps

1. **Add FTP secrets** to GitHub
2. **Commit and push** `.github/workflows/deploy-frontend.yml`
3. **Watch** the workflow run in GitHub Actions
4. **Test** your site updates after first successful deployment

That's it! All future pushes will auto-deploy. 🎉
