/**
 * Asset Copy Script
 * -----------------
 *
 * This script copies third-party vendor and polyfill assets from node_modules
 * into flat folders (`/vendor` and `/polyfills`) that can be referenced via
 * simple <script> and <link> tags.
 *
 * WHY THIS FILE EXISTS (instead of inline npm scripts):
 * - Keeps package.json readable as the number of assets grows
 * - Avoids long, brittle shell command chains (especially on Windows)
 * - Makes asset intent explicit (what we depend on and why)
 * - Centralizes version-sensitive paths (e.g. DataTables, core-js)
 *
 * This mirrors the broader project philosophy:
 * - Clear separation of concerns
 * - Explicit dependencies
 * - Low magic, high clarity
 *
 * IMPORTANT:
 * - The output folders (`vendor/`, `polyfills/`) are gitignored
 * - These files are required for both local preview and SharePoint CEWP usage
 * - DataTables is intentionally pinned to v1.13.x for jQuery + IE11 compatibility
 */

const { execSync } = require('child_process');

/**
 * Copies a file to a destination folder, flattening the path.
 * Using a helper keeps the intent readable and avoids command duplication.
 */
function copy(src, dest) {
    execSync(`npx copyfiles --flat "${src}" "${dest}"`, {
        stdio: 'inherit'
    });
}

console.log('Copying vendor and polyfill assets...');

/**
 * jQuery
 * Required by legacy DataTables and SharePoint-era scripts.
 */
copy(
    'node_modules/jquery/dist/jquery.min.js',
    'vendor'
);

/**
 * DataTables (legacy jQuery plugin API)
 * Pinned to 1.13.x — DataTables 2.x removes $.fn.DataTable and breaks IE11.
 */
copy(
    'node_modules/datatables.net/js/jquery.dataTables.min.js',
    'vendor'
);

/**
 * DataTables default CSS theme
 * Kept as a vendor asset to match CEWP / script-tag usage.
 */
copy(
    'node_modules/datatables.net-dt/css/jquery.dataTables.min.css',
    'vendor'
);

/**
 * Linkify JavaScript plugin
 * Used to find links in plain-text and convert them to HTML <a> tags.
 */
copy(
    'node_modules/linkifyjs/dist/linkify.min.js',
    'vendor'
);

copy(
    'node_modules/linkify-html/dist/linkify-html.min.js',
    'vendor'
);


/**
 * core-js bundle
 * Provides IE11 polyfills (Promise, Array.find, Array.includes, etc.)
 * Loaded before vendor and app scripts.
 */
copy(
    'node_modules/core-js-bundle/minified.js',
    'polyfills'
);

console.log('Assets copied successfully.');
