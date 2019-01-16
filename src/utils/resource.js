import { fetchResource } from './fetch';
import config from '@/config';

const API_HOST = config.API_HOST;
const SERVICE_NAME = config.SERVICE_NAME;

export const Resource = {
  // testData: fetchResource(`${API_HOST}/posts`),

  // getReportList: fetchResource(`${API_HOST_TEXT}`,'webs.getReportList'),

  // customize: fetchResource(`/apis/customize`),
  // customize_all: fetchResource(`/apis/customize_all`),
  // plugins: fetchResource(`/apis/plugins`),
  
  //本地mock模拟接口
  f10_industry: fetchResource(`/apis/f10-industry`),
  //F10行业专题接口
  f10_IndStkcnMkt: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/IndStkcnMkt`),
  f10_IndComcnScale: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/IndComcnScale`),
  f10_IndComcnMktQuotIdx: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/IndComcnMktQuotIdx`),
  f10_InduComcnFinAnal: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/InduComcnFinAnal`),
  f10_ZxRrpRptAlls: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ZxRrpRptAlls`),
  //分红增发配股接口
  fh: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/StkcnDvdInfo`),
  zf: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/StkcnIss`),

  kline: fetchResource(`${API_HOST}${SERVICE_NAME}/queryKLine`),
  livelist: fetchResource(`${API_HOST}${SERVICE_NAME}/livelist`),
  newslist: fetchResource(`${API_HOST}${SERVICE_NAME}/newslist`),
  newsdetail: fetchResource(`${API_HOST}${SERVICE_NAME}/newsdetail`),
  codelist: fetchResource(`${API_HOST}${SERVICE_NAME}/codelist`),
  codelist: fetchResource(`${API_HOST}${SERVICE_NAME}/codelist`),
  codelistByGZ: fetchResource(`${API_HOST}${SERVICE_NAME}/codelistByGZ/ALL`),

  //日K
  QueryKLine: fetchResource(`${API_HOST}${SERVICE_NAME}/queryKLine`),
  stkcnsectmemberlist: fetchResource(`${API_HOST}${SERVICE_NAME}/stkcnsectmemberlist`),

  // 获取复权因子
  getReinstatement: fetchResource(`${API_HOST}${SERVICE_NAME}/queryier`),

  //f10
  NewIdxVal: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/NewIdxVal`),
  BasSpclNtc: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/BasSpclNtc`),
  StkcnBlkTrd: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/StkcnBlkTrd`),
  StkcnMnyFlow: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/StkcnMnyFlow`),
  StkcnAbnTrd: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/StkcnAbnTrd`),
  SmtcnExchTrdDet: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/SmtcnExchTrdDet`),
  OtbIllBas: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/OtbIllBas`),
  ZxTxtNwsLstComs: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ZxTxtNwsLstComs`),
  ZxTxtAnnCenters: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ZxTxtAnnCenters`),
  ZxRrpRptAlls: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ZxRrpRptAlls`),

  ComcnCard: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnCard`),
  ComcnSh: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnSh`),
  ComcnRelSh: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnRelSh`),
  ComcnShNum: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnShNum`),
  ComcnLdrShrChg: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnLdrShrChg`),
  ComcnShOrgCol: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnShOrgCol`),
  ComcnShLimCirc: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnShLimCirc`),
  ComcnShrChg: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnShrChg`),

  ComcnFinAnal: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnFinAnal`),
  ComcnIncStmtNas: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnIncStmtNas`),
  ComcnCashFlowNas: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnCashFlowNas`),
  ComcnBalShtNas: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnBalShtNas`),
  ComcnScBkCptl: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnScBkCptl`),
  ComcnBalShtGen: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnBalShtGen`),
  ComcnHldLst: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnHldLst`),
  ComcnHldFinUnLst: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnHldFinUnLst`),
  ComcnInvSecu: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnInvSecu`),
  ComcnMainBiz: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnMainBiz`),
  ComcnFinAnalBiz: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ComcnFinAnalBiz`),
  
  RrpRptRatStat: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/RrpRptRatStat`),
  IvstEstTot: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/IvstEstTot`),
  IvstEstBsc: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/IvstEstBsc`),
  // ZxTxtNwsLstComs: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/ZxTxtNwsLstComs`),
  
  StkcnDvdInfo: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/StkcnDvdInfo`),
  StkcnIss: fetchResource(`${API_HOST}${SERVICE_NAME}/F10/StkcnIss`),

}
