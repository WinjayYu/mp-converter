const chalk = require('chalk');
const program =  require('commander');

program
  .version(require('../package.json').version, '-v, --version')
  .usage('<command> [options]');

program
  .command('build <type>')
  .description('build your project')
  .action(require('./build'));

program.parse(process.argv);
