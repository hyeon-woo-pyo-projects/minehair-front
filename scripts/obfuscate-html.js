// scripts/obfuscate-html.js
const fs = require('fs');
const path = require('path');
const minify = require('html-minifier-terser').minify;

const htmlPath = path.join(__dirname, '../build/index.html');
const originalHtml = fs.readFileSync(htmlPath, 'utf8');

minify(originalHtml, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true,
    }).then(minifiedHtml => {
        fs.writeFileSync(htmlPath, minifiedHtml);
        console.log('✅ index.html has been minified/obfuscated');
});
