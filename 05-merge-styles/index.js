const fsPromises = require('fs/promises');
const path = require('path');
const styles=[];
const newFileName='bundle.css';

async function mergeCSS(src, dest) {
  const srcPath= path.join(__dirname,src);
  const destPath =path.join(__dirname, dest, newFileName);
  const fileArray = await fsPromises.readdir(srcPath,{ withFileTypes: true });
  for (let file of fileArray) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      styles.push(`${await fsPromises.readFile(path.join(srcPath,file.name))}\n`);
    }
  }
  await fsPromises.writeFile(destPath,styles);
}

mergeCSS('styles','project-dist');

