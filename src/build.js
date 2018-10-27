import Compile from './compile'

exports = module.exports = function(options){
  let compile = new Compile(options);
  compile.build();
}
