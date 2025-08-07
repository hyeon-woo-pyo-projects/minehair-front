// scripts/obfuscate.js
const fs = require('fs');
const path = require('path');
const obfuscator = require('javascript-obfuscator');

const buildPath = path.join(__dirname, '../build/static/js');

fs.readdirSync(buildPath).forEach(file => {
    const filePath = path.join(buildPath, file);

    if (file.endsWith('.js')) {
        const code = fs.readFileSync(filePath, 'utf8');

        const obfuscatedCode = obfuscator.obfuscate(code, {
            compact: true,
            controlFlowFlattening: true,
            deadCodeInjection: true,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            renameGlobals: true,
            stringArray: true,
            stringArrayEncoding: ['rc4'],
            stringArrayThreshold: 0.75,
        }).getObfuscatedCode();

        fs.writeFileSync(filePath, obfuscatedCode);
        console.log(`✔️ Obfuscated: ${file}`);
    }
});
