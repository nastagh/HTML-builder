const fsPromises = require('fs/promises');
const path = require('path');

(async () => {
  const fileArray= await fsPromises.readdir(path.join(__dirname, 'secret-folder'),{ withFileTypes: true });
  for (let file of fileArray) {
    if (file.isFile()) {
      const fullFileName =file.name;
      const fileName= fullFileName.split('.')[0];
      const pathToFile = path.join(__dirname, 'secret-folder', fullFileName);
      const fileType = path.extname(fullFileName).slice(1);
      const size = (await fsPromises.stat(pathToFile)).size/1000;
      console.log(`${fileName} - ${fileType} - ${size}Kb`);
    }
  }
})();


