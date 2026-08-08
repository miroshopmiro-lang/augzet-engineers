/**
 * Post-build fixup for the Sanity Studio served at /admin/.
 *
 * `sanity build` writes ../admin/index.html with ROOT-ABSOLUTE asset paths
 * ("/static/sanity-*.js") regardless of the `vite.base` override in
 * sanity.config.js. The studio is served from /admin/, so those paths resolve
 * to /static/... which does not exist on the deploy. Cloudflare Pages answers
 * with its HTML fallback, the module script receives text/html instead of
 * JavaScript, and the studio renders as a blank page in the Sanity background
 * colour. This is exactly the bug reported on 2026-08-08.
 *
 * The emitted JS chunks are fine: they contain no hardcoded "/static/" and
 * resolve siblings relative to their own URL, so once index.html points at
 * /admin/static/ the whole studio loads.
 *
 * The previous version of this script worked around the same problem by
 * copying admin/static (6.6 MB) to a second copy at the repo root. That copy
 * was removed from the deploy by the 2026-08-07 audit as dead weight, which is
 * what broke the studio. Rewriting the paths is the fix; duplicating the
 * bundle is not.
 */

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../admin/index.html');

if (!fs.existsSync(indexPath)) {
  console.error('[fix-admin-paths] admin/index.html not found — did `sanity build` run?');
  process.exit(1);
}

const original = fs.readFileSync(indexPath, 'utf8');
const patched = original.split('"/static/').join('"/admin/static/');
const rewritten = (original.match(/"\/static\//g) || []).length;

if (rewritten === 0) {
  const already = (original.match(/"\/admin\/static\//g) || []).length;
  console.log(
    already > 0
      ? `[fix-admin-paths] already correct — ${already} asset paths point at /admin/static/`
      : '[fix-admin-paths] WARNING: found no /static/ or /admin/static/ asset paths. Check the build output.'
  );
} else {
  fs.writeFileSync(indexPath, patched, 'utf8');
  console.log(`[fix-admin-paths] rewrote ${rewritten} asset paths: /static/ -> /admin/static/`);
}

// The studio is useless without the origin allowlisted, and that is a manual
// step in manage.sanity.io that has bitten this project once already.
console.log(
  '[fix-admin-paths] reminder: every origin serving this studio must be added as a CORS\n' +
  '                  origin (with credentials) at https://manage.sanity.io -> API -> CORS origins.\n' +
  '                  Allowlisted: https://augzet-engineers.pages.dev\n' +
  '                  NOT allowlisted yet: https://augzet.com'
);
