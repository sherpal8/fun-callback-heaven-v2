const fs = require('fs');
const { exec, spawn } = require('child_process');

function projectGenerator(projectName) {
  fs.mkdir(`./${projectName}`, { recursive: true }, err => {
    if (err) throw err;
    else {
      const files = ['index.js', 'README.md', '.gitignore'];
      files.map(file => {
        let data = '// to be populated';
        if (file === '.gitignore') {
          data = `node_modules`;
        } else if (file === 'README.md') {
          data = 'This is an auto generated folder by projectGenerator.';
        }

        fs.appendFile(`./${projectName}/${file}`, `${data}`, function(err) {
          if (err) throw err;
          else console.log(`${file} file successfully created`);
        });
      });

      fs.readFile(`./templateLibrary/eslintrcTemplate.js`, 'utf8', function(
        err,
        data
      ) {
        if (err) throw err;
        fs.writeFile(`./${projectName}/.eslintrc.js`, data, function(err) {
          if (err) console.log(err);
          console.log('The .eslintrc.js file was successfully written onto!');
        });
      });

      fs.readFile('./templateLibrary/packageJsonData.json', 'utf8', function(
        err,
        data
      ) {
        if (err) throw err;
        fs.writeFile(`./${projectName}/package.json`, data, function(err) {
          if (err) {
            return console.log(err);
          }
          console.log('The package.json file was successfully written onto!');
        });
      });

      fs.mkdir(`./${projectName}/spec`, { recursive: true }, err => {
        if (err) throw err;
        else {
          console.log('Spec folder successfully created');
          fs.readFile('./templateLibrary/testFileTemplate.js', 'utf8', function(
            err,
            data
          ) {
            if (err) throw err;
            else {
              console.log('testFileTemplate.js successfully read');
              fs.appendFile(
                `./${projectName}/spec/index.spec.js`,
                data,
                function(err) {
                  if (err) throw err;
                  else console.log('index.spec.js file successfully created');
                }
              );
            }
          });
        }
      });

      exec(
        `cd ${projectName} && npm init -y && git init && npm install chai mocha eslint -D`,
        (error, stdout, stderr) => {
          if (error) console.error(`exec error: ${error}`);
          else {
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
          }
        }
      );
      // const ps = spawn(`./${projectName}/node_modules/.bin/eslint`, ['--init']);
      // const input = spawn(`./${projectName}/node_modules/.bin/eslint`);
      // ps.stdout.on('data', (data = 'yes') => {
      //   input.stdin.write(data);
      //   console.error(`ps stderr:${data}`);
      // });
    }
  });
}

projectGenerator('myProject');
