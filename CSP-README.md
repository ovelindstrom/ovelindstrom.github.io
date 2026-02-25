# Content Security Policy (CSP) Implementation

## Overview
This site implements Content Security Policy (CSP) to protect against XSS attacks, data injection, and other common web vulnerabilities.

## Implementation
The CSP is implemented via a `<meta>` tag in `_includes/csp.html` and included in the default layout. GitHub Pages doesn't support custom HTTP headers, so the meta tag approach is used.

## Policy Details

### Current CSP Configuration

```
default-src 'self'
```
Only allow resources from the same origin by default.

```
script-src 'self' 'unsafe-inline' https://www.clarity.ms https://scripts.clarity.ms https://*.clarity.ms https://*.disqus.com https://*.disquscdn.com
```
- `'self'`: Allow scripts from same origin (simple-jekyll-search.min.js)
- `'unsafe-inline'`: Required for inline scripts (cookie consent, search functionality, analytics initialization)
- `https://www.clarity.ms`, `https://scripts.clarity.ms`, `https://*.clarity.ms`: Microsoft Clarity analytics
- `https://*.disqus.com` and `https://*.disquscdn.com`: Disqus comments (if enabled)

```
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
```
- `'self'`: Allow stylesheets from same origin
- `'unsafe-inline'`: Required for inline styles in cookie consent and other components
- `https://fonts.googleapis.com`: Google Fonts stylesheet

```
img-src 'self' data: https: http:
```
Allow images from same origin, data URIs, and external HTTPS/HTTP sources (for blog post images, avatars, etc.)

```
font-src 'self' data: https://fonts.gstatic.com
```
Allow fonts from same origin, data URIs, and Google Fonts CDN.

```
connect-src 'self' https://www.clarity.ms https://*.clarity.ms https://*.disqus.com
```
Allow AJAX/fetch requests to same origin, Clarity analytics, and Disqus.

```
frame-src https://*.disqus.com
```
Allow embedding of Disqus comment iframes.

```
object-src 'none'
```
Disallow plugins like Flash and Java applets.

```
base-uri 'self'
```
Restrict `<base>` tag to same origin.

```
form-action 'self'
```
Forms can only submit to same origin.

```
upgrade-insecure-requests
```
Automatically upgrade HTTP requests to HTTPS.

**Note:** The `frame-ancestors` directive is not supported in `<meta>` CSP tags, only in HTTP headers. For meta-based CSP, this directive is ignored.

## Improving Security

The current policy uses `'unsafe-inline'` for both scripts and styles. To improve security, consider:

### Option 1: Remove Inline Scripts
Move all inline JavaScript to external files with proper event listeners.

### Option 2: Use Nonces or Hashes
Generate unique nonces for each page request or use SHA hashes of inline script content:
```html
<meta http-equiv="Content-Security-Policy" content="script-src 'self' 'nonce-{random}' https://www.clarity.ms">
<script nonce="{random}">...</script>
```

Note: Nonces require server-side generation, which is limited on GitHub Pages.

### Option 3: Use Hash-based CSP
Calculate SHA-256 hashes of inline scripts:
```bash
echo -n "your-script-content" | openssl dgst -sha256 -binary | openssl base64
```

Then reference in CSP:
```
script-src 'self' 'sha256-{hash}' https://www.clarity.ms
```

## Testing CSP
1. Open browser Developer Tools (F12)
2. Navigate to Console tab
3. Look for CSP violation warnings
4. Test all site functionality (search, cookie consent, analytics)

## Monitoring
- Check browser console for CSP violations
- Consider using CSP reporting (`report-uri` or `report-to` directives) to collect violation reports

## Maintenance
When adding new external services or inline scripts, update `_includes/csp.html` accordingly.

## References
- [MDN Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [GitHub Pages CSP Limitations](https://github.blog/2013-04-24-heads-up-nosniff-header-support-coming-to-chrome-and-firefox/)
