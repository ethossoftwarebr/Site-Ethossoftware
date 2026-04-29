const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'client/src/components');
const pagesPath = path.join(__dirname, 'client/src/pages');

function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Map old brand colors to new palette
            content = content.replace(/#9f24e8/g, '#A229F2'); 
            content = content.replace(/#59168b/g, '#531B8C'); 
            // Also case variants if any
            content = content.replace(/#9F24E8/g, '#A229F2'); 
            content = content.replace(/#59168B/g, '#531B8C'); 
            
            fs.writeFileSync(fullPath, content);
        }
    });
}

processDirectory(directoryPath);
processDirectory(pagesPath);

let cssPath = path.join(__dirname, 'client/src/index.css');
if (fs.existsSync(cssPath)) {
    let cssContent = fs.readFileSync(cssPath, 'utf8');
    cssContent = cssContent.replace(/#9f24e8/g, '#A229F2');
    cssContent = cssContent.replace(/#59168b/g, '#531B8C');
    cssContent = cssContent.replace(/#9F24E8/g, '#A229F2');
    cssContent = cssContent.replace(/#59168B/g, '#531B8C');
    fs.writeFileSync(cssPath, cssContent);
}

let homePath = path.join(__dirname, 'client/src/pages/Home.tsx');
if (fs.existsSync(homePath)) {
    let homeContent = fs.readFileSync(homePath, 'utf8');
    homeContent = homeContent.replace(/bg-white/g, 'bg-[#F2F2F2]');
    fs.writeFileSync(homePath, homeContent);
}

console.log('Colors replaced basic mapping.');
