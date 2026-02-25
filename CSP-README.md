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
- `'self'`: Allow scripts from same origin (simple-jekyll-search.min.js, cookie-consent.js, search-init.js)
- `https://www.clarity.ms`, `https://scripts.clarity.ms`, `https://*.clarity.ms`: Microsoft Clarity analytics
- `https://*.disqus.com` and `https://*.disquscdn.com`: Disqus comments (if enabled)
- **No `'unsafe-inline'`**: All inline scripts have been refactored into external files for maximum XSS protection

```
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
```
- `'self'`: Allow stylesheets from same origin
- `'unsafe-inline'`: Required for inline styles in cookie consent and other components
- `https://fonts.googleapis.com`: Google Fonts stylesheet

```
img-src 'self' data: https://www.jfokus.se
```
Allow images from:
- `'self'`: Same origin (blog post images, avatars, logos)
- `data:`: Data URIs for inline images
- `https://www.jfokus.se`: JFocus conference speaker images

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

## Eliminating Inline Scripts (XSS Protection)

To maximize XSS protection, all inline JavaScript has been refactored into external files:

### Refactored Scripts

| Inline Script | External File | Location |
|---|---|---|
| Cookie consent handler | `assets/cookie-consent.js` | Loaded by `_includes/cookie-consent.html` |
| Search initialization | `assets/search-init.js` | Loaded by `_pages/search.md` |

### Benefits of External Scripts

- **Blocks inline script injections**: Attackers cannot inject inline `<script>` tags to execute malicious code
- **Maintains CSP without `'unsafe-inline'`**: All scripts follow proper CSP directives
- **Uses DOMContentLoaded event**: Scripts initialize safely after DOM is ready
- **High ROI security improvement**: Eliminates an entire class of XSS attacks

### Implementation Details

- Scripts use `document.addEventListener('DOMContentLoaded', ...)` to initialize after the page loads
- Event listeners are attached using `.addEventListener()` instead of inline `onclick` attributes
- All script-src directives now point to whitelisted external origins only

## Styling: Still Uses 'unsafe-inline'

Note: `style-src` still includes `'unsafe-inline'` for the cookie consent banner styling. CSS injection attacks are significantly less common than JavaScript injection, but this could be further hardened using external stylesheets or CSS-in-JS solutions.

## Testing CSP
1. Open browser Developer Tools (F12)
2. Navigate to Console tab
3. Look for CSP violation warnings
4. Test all site functionality (search, cookie consent, analytics)

## Monitoring
- Check browser console for CSP violations
- Consider using CSP reporting (`report-uri` or `report-to` directives) to collect violation reports

## Maintenance
When adding new external services, update `_includes/csp.html` accordingly. Avoid adding inline scripts; create external files instead.

## References
- [MDN Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [OWASP: Content Security Policy](https://owasp.org/www-community/attacks/xss/)
- [GitHub Pages CSP Limitations](https://github.blog/2013-04-24-heads-up-nosniff-header-support-coming-to-chrome-and-firefox/)
