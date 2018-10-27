import program from 'commander' ;

program
  .version(require('../package.json').version, '-v, --version')
  .usage('<command> [options]');

program
  .command('build')
  .description('build your project')
  .action(require('./build'))
  .option('f, --from')
  .option('t, --target')
  .option('o, --output')


program.parse(process.argv);
