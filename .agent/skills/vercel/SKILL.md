---
name: vercel
description: Commands and strategies for managing Vercel deployments, environment variables, and troubleshooting.
---

# Vercel Management Skill

This skill provides a set of patterns and commands for interacting with Vercel via the CLI and and managing production deployments.

## Core Commands

### Deployment

- **Link Project**: `vercel link` (connects local folder to a Vercel project)
- **Preview Deploy**: `vercel` (deploys to a unique preview URL)
- **Production Deploy**: `vercel --prod` (promotes current build to production)

### Environment Variables

- **Add Variable**: `vercel env add <NAME> [ENVIRONMENT] [VALUE]`
- **List Variables**: `vercel env ls`
- **Remove Variable**: `vercel env rm <NAME> [ENVIRONMENT]`
- **Pull Variables**: `vercel env pull [.env.local]` (fetches remote variables to local file)

### Troubleshooting

- **Logs**: `vercel logs <DEPLOYMENT_URL>`
- **Inspect**: `vercel inspect <DEPLOYMENT_URL>`

## Common Issues & Fixes

### 404 Not Found (Blank Screen)

**Symptom**: Page loads but console shows 404 for `/src/main.tsx` or similar.
**Cause**: The production environment is serving the source `index.html` instead of the bundled version from `dist`.
**Fix**:

1. Check "Root Directory" in Vercel settings (should be the folder containing `package.json`).
2. Ensure `vercel.json` has correct rewrites if using a SPA.
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```
3. Verify Build Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Environment Variables Undefined

**Symptom**: `supabase` client crashes or logs "missing env vars".
**Cause**: Variables added to Vercel but not applied to the current deployment.
**Fix**: Trigger a new deployment using `vercel --prod` after adding variables.

## Best Practices

- Always use the `--prod` flag when finalizing a change.
- Select all environments (Production, Preview, Development) when adding secret keys like Supabase or API tokens.
- Keep `vercel.json` in the root of the project folder.
