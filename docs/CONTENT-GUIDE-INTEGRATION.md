# Content Guide Integration

This guide enforces compliance across all generated content assets with the official distribution rules.

## Distribution Protocol

### 1. LinkedIn / X Post Protocol
1. Publish the main post body from `content/social/linkedin-post.md` (includes GitHub repo link).
2. Immediately post the first comment containing the link to the published technical article.
3. Post a second comment providing the link to the [Hindsight GitHub repository](https://github.com/vectorize-io/hindsight).

### 2. Reddit Protocol
1. Select target subreddit (`r/llmdevs` or `r/aiagents`).
2. Use the template in `content/social/reddit-link-post-template.md`.
3. Provide direct link to published article.

### 3. Verification
Before publication, run the automated checker:
```bash
npm run content:check
```
Any violation of word count limits, forbidden words, or missing links will cause the script to exit with an error.
