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
            content = content.replace(/#9f24e8/gi, '#A229F2'); 
            content = content.replace(/#59168b/gi, '#531B8C'); 
            
            // Replace remaining colors with appropriate ones from the new palette
            // F2F2F2 (light background), 9D7ABF (muted text/icons), 531B8C (dark text), A229F2 (primary), BA66F2 (light primary)
            
            fs.writeFileSync(fullPath, content);
        }
    });
}

processDirectory(directoryPath);
processDirectory(pagesPath);

let cssPath = path.join(__dirname, 'client/src/index.css');
if (fs.existsSync(cssPath)) {
    let cssContent = fs.readFileSync(cssPath, 'utf8');
    cssContent = cssContent.replace(/#9f24e8/gi, '#A229F2');
    cssContent = cssContent.replace(/#59168b/gi, '#531B8C');
    fs.writeFileSync(cssPath, cssContent);
}

console.log('Colors replaced basic mapping.');
