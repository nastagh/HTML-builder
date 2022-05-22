const fsPromises = require('fs/promises');
const path = require('path');

async function copyDir(src, dest) {
  const srcPath = path.join(__dirname, src);
  const destPath= path.join(__dirname, dest);

  await fsPromises.mkdir(destPath,{ recursive: true });
  const destFiles= await fsPromises.readdir(destPath);
  for (let file of destFiles) {
    await fsPromises.rm(path.join(destPath,file));
  }

  const srcFiles= await fsPromises.readdir(srcPath);
  for (let file of srcFiles) {
    await fsPromises.copyFile(path.join(srcPath,file), path.join(destPath, file));
  }
}

copyDir('files','files-copy');
