const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output, stdout } = require('process');

const file = fs.createWriteStream(path.join(__dirname,'text.txt'));
const rl = readline.createInterface({ input, output });

process.on('exit', () => {
  console.log('Bye. Have a good day!');
});

rl.on('close', () => {
  process.exit();
});

stdout.write('Write something\n');

function writeReadline() {
  rl.question('', (answer) =>{
    if (answer === 'exit') {
      rl.close();
    }
    file.write(`${answer}\n`);
    writeReadline();
  });
}

writeReadline();

