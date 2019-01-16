/**
 * 配置不同环境的静态常量
 * 常用来配置请求不同环境接口信息
 * 输出项目常量请用大写
 */
let realPath = '';
if(process.env.BUILD_ENV==='uat'){
    // 测试环境
    realPath = '/uat';
    console.log('-------------------测试环境--------------------');
}else if(process.env.BUILD_ENV==='pro'){
    // 生产环境
    realPath = '/pro';
    console.log('-------------------生产环境--------------------');
}else{
    // 开发环境
    realPath = '/dev';
    console.log('-------------------开发环境--------------------');
}

//接口真实前缀
export const REALPATH = realPath;

