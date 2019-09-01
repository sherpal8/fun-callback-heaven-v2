const fs = require('fs');

function projectGenerator(projectName) {
  fs.mkdir(`./${projectName}`, { recursive: true }, err => {
    if (err) throw err;
    else {
      const files = [
        'index.js',
        'package.json',
        'README.md',
        'eslint',
        '.gitignore'
      ];
      files.map(file => {
        fs.appendFile(
          `./${projectName}/${file}`,
          `// to be populated`,
          function(err) {
            if (err) throw err;
            else console.log(`${file} file successfully created`);
          }
        );
      });
      fs.mkdir(`./${projectName}/spec`, { recursive: true }, err => {
        if (err) throw err;
        else {
          console.log('Spec folder successfully created');
          fs.appendFile(
            `./${projectName}/spec/index.spec.js`,
            `// for testing`,
            function(err) {
              if (err) throw err;
              else console.log('index.spec.js file successfully created');
            }
          );
        }
      });
    }
  });
}

projectGenerator('myProject');
