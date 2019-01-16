const complete = require('./complete');
let common = require('./Common');

export default function indexHandle({name, ...args}){
  common.init(args);
  try{
    complete[name]({open: 'open', close: 'close', low: 'low', high: 'high', ...args, common});
  }catch(err){
    debugger;
  }
}
