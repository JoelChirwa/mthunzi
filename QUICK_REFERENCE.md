# 🎯 GitHub Actions - Quick Reference Card

Print this or keep it open while setting up!

---

## 5-Minute Setup Flow

```
1. Get FTP info from cPanel      ✓ ___
2. Add 3 secrets to GitHub       ✓ ___
3. Push workflow file            ✓ ___
4. Test with git push            ✓ ___
5. Watch it deploy! 🎉           ✓ ___
```

---

## FTP Credentials (From cPanel)

**Where to find:**
- cPanel Dashboard → Files → FTP Accounts

**What you need:**
```
FTP_HOST:     __________________________
FTP_USER:     __________________________  
FTP_PASSWORD: __________________________
```

---

## Add GitHub Secrets

**URL:** `github.com/yourusername/mthunzi-trust/settings/secrets/actions`

**Add 3 secrets:**

1. **FTP_HOST**
   - Name: `FTP_HOST`
   - Value: [paste from above]

2. **FTP_USER**
   - Name: `FTP_USER`
   - Value: [paste from above]

3. **FTP_PASSWORD**
   - Name: `FTP_PASSWORD`
   - Value: [paste from above]

---

## Commit Workflow

```bash
cd mthunzi-trust
git add .github/
git commit -m "Add GitHub Actions deployment"
git push origin main
```

---

## Deploy from Now On

```bash
# Your changes
git add .
git commit -m "Your message"
git push origin main

# That's it!
# Check GitHub Actions tab (optional)
```

---

## Watch Deployment

1. Go to repo → **Actions** tab
2. Find latest run
3. Wait for green ✅ (2-3 min)

---

## If It Breaks

| Problem | Solution |
|---------|----------|
| FTP failed | Check secrets in GitHub |
| Build failed | Run `npm run build` locally |
| Site not updating | Restart app in cPanel Node.js Selector |
| Secrets invalid | Re-check FTP credentials in cPanel |

---

## Status Lights

- 🟡 Yellow = Running (wait)
- 🟢 Green = Success (done!)
- 🔴 Red = Failed (debug)

---

## Files Changed

```
NEW: .github/workflows/deploy-frontend.yml
ALREADY UPDATED: server.js, server.cjs
```

---

## Success = ✅

- [ ] GitHub Actions shows green checkmark
- [ ] `https://mthunzitrust.org/` loads
- [ ] No 503 errors
- [ ] Content displays

---

## Questions?

See [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md) for detailed guide
