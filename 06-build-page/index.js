const fsPromises = require('fs/promises');
const path = require('path');
const styles=[];
const styleFile='style.css';
const htmlFile='index.html';

async function createPage(mainDir,presentDir,copyDir) {
  const destPath=path.join(__dirname,mainDir);
  const copyDirPath=path.join(destPath,copyDir);
  const presentDirPath=path.join(__dirname, presentDir);

  await fsPromises.mkdir(destPath,{ recursive: true });
  
  mergeCSS('styles',mainDir);
  copyFolder(presentDirPath,copyDirPath);
  createTemplate('template.html','components',mainDir);
}

async function mergeCSS(styleDir,mainDir) {
  const srcPath=path.join(__dirname,styleDir);
  const destPath=path.join(__dirname,mainDir);
  const stylePath=path.join(destPath, styleFile);
  const styleArray= await fsPromises.readdir(srcPath,{ withFileTypes: true });
  for (let file of styleArray ) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      styles.push(`${await fsPromises.readFile(path.join(srcPath,file.name))}\n`);
    }
  }
  await fsPromises.writeFile(stylePath,styles);
}

async function copyFolder(presentPath,copyPath){
  await fsPromises.mkdir(copyPath,{ recursive: true });
  const copyArray = await fsPromises.readdir(copyPath);
  for (let file of copyArray) {
    await fsPromises.rm(path.join(copyPath,file),{recursive: true});
  }

  const fileArray = await fsPromises.readdir(presentPath,{ withFileTypes: true });

  for (let file of fileArray) {
    if (!file.isDirectory()){
      await fsPromises.copyFile(path.join(presentPath,file.name), path.join(copyPath, file.name));
    }
    else {
      await copyFolder(path.join(presentPath,file.name),path.join(copyPath,file.name));
    }
  }
}

async function createTemplate(fileName,folderName,mainDir){
  const templatePath=path.join(__dirname,fileName);
  const componentsPath=path.join(__dirname,folderName);
  let template = await fsPromises.readFile(templatePath,'utf-8');
  const componentsArray= await fsPromises.readdir(componentsPath,{ withFileTypes: true });
  const destPath=path.join(__dirname,mainDir);

  for (let file of componentsArray) {
    if (file.isFile()&&path.extname(file.name) === '.html') {
      const fileContent = await fsPromises.readFile(path.join(componentsPath,file.name));
      const componentsName = new RegExp(`{{${(file.name).split('.')[0]}}}`,'g');
      template=template.replace(componentsName, fileContent);
    }
  }
  await fsPromises.writeFile(path.join(destPath,htmlFile),template);

}

createPage('project-dist','assets','assets');