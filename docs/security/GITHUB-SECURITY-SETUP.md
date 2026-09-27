# GitHub Repository Security & Branch Protection Setup

## 1. Branch Protection Rules (`main` branch)

Enable the following settings under **Settings → Branches → Branch protection rules**:
- **Require a pull request before merging**: Enforce at least 1 approving review.
- **Require status checks to pass before merging**:
  - `lint` (ESLint)
  - `typecheck` (`tsc --noEmit`)
  - `security-tests` (`npm run test`)
  - `build` (`npm run build`)
- **Require linear history**: Prevent merge commits.
- **Do not allow bypassing the above settings**: Apply to administrators.

---

## 2. GitHub Native Security Features

Under **Settings → Code security and analysis**:
- **Dependabot alerts**: Enabled.
- **Dependabot security updates**: Enabled.
- **Secret scanning**: Enabled.
- **Push protection for secrets**: Enabled (blocks pushes containing matching API key patterns).

---

## 3. GitHub Actions Least Privilege Configuration
All workflow files should explicitly restrict the default `GITHUB_TOKEN` permissions:
```yaml
permissions:
  contents: read
  pull-requests: read
  issues: write
  security-events: write
```
Fork pull requests must not have access to production secrets (`pull_request_target` should be avoided for untrusted code execution).
