#!/usr/bin/env node

import program from 'commander' ;

program
  .version(require('../package.json').version, '-v, --version')
  .usage('<command> [options]');

program
  .command('build')
  .description('build your project')
  .action(require('./build'))
  .option('-f, --from <from>')
  .option('-t, --target <target>')
  .option('-o, --output <output>');


program.parse(process.argv);
