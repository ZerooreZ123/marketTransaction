/* *************
 * 暗黑主题全局变量配置
 * ************/
const black_theme = require('./theme_black.js');
const white_theme = require('./theme_white.js');
const gold_theme = require('./theme_gold.js');
const config = require('../config.js');
let theme;

switch(config.theme){
  case 'black':
    theme = black_theme;
    break;
  case 'white':
    theme = white_theme;
    break;
  case 'gold':
    theme = gold_theme;
    break;
}

let styleConfig= () => {
  return {
    ...theme
  }
}

module.exports = styleConfig;

module.styleConfig = styleConfig();
