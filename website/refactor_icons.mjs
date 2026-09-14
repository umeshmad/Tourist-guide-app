import fs from 'fs';
import path from 'path';

const files = [
    'src/App.jsx',
    'src/pages/Login.jsx',
    'src/pages/Register.jsx',
    'src/pages/OwnerDashboard.jsx',
    'src/pages/AdminDashboard.jsx'
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // First, let's inject the Icon component import if it's not there
    if (!content.includes("import Icon from")) {
        content = content.replace("import React", "import React\nimport Icon from '../components/Icon';\n");
    }

    // This regex looks for <span className="material-symbols-outlined" ...>icon_name</span>
    // and replaces it with <Icon name="icon_name" ... />
    // It's a bit complex due to possible props.
    
    const regex = /<span[^>]*className="material-symbols-outlined"[^>]*>([\w_]+)<\/span>/g;
    
    content = content.replace(regex, (match, iconName) => {
        // Extract any style props
        let styleMatch = match.match(/style=\{([^}]+)\}/);
        let styleProp = styleMatch ? ` style={${styleMatch[1]}}` : '';
        return `<Icon name="${iconName}"${styleProp} />`;
    });

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
}

files.forEach(f => processFile(path.join(process.cwd(), f)));
