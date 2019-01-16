//F10-交易必读-大宗交易表格
import React from "react";
import ReactDOM from "react-dom";
let TableInTable = () => (
  <table>
    <tr>
      <th></th>
      <th>发行价</th>
      <th>发行股价</th>
      <th>发行金额</th>
    </tr>
    <tr>
      <td>预案</td>
      <td>最低9.72</td>
      <td>最低9.72</td>
      <td>最低9.72</td>
    </tr>
    <tr>
      <td>实际价格</td>
      <td>最低9.72</td>
      <td>最低9.72</td>
      <td>最低9.72</td>
    </tr>
  </table>
)

let UlInTable = () => (
  <ul className='ulInTable'>
    <li>
      <p>2013-10-12 </p>
      <p>预案公布</p>
    </li>
    <li>
      <p>2013-10-12 </p>
      <p>预案公布公布</p>
    </li>
    <li>
      <p>2013-10-12 </p>
      <p>预案公布公布</p>
    </li>
    <li>
      <p>2013-10-12 </p>
      <p>预案公布公布</p>
    </li>
    <li>
      <p>2013-10-12 </p>
      <p>预案公布</p>
    </li>
    <li>
      <p>2013-10-12 </p>
      <p>预案公布</p>
    </li>
    <li>
      <p>2013-10-12 </p>
      <p>预案公布</p>
    </li>
  </ul>
)
let baseConfig = {
  BlockTransactionTable: {
    compType: "table",
    compName: "BlockTransactionTable", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    // 是否分页

    // 表格列配置
    columns: [
      { title: "交易日期", dataIndex: "trd_dt" },
      {
        title: "成交价",
        dataIndex: "tnv_prc"
      },
      {
        title: "成交金额（元）",
        dataIndex: "tnv_val"
      },
      {
        title: "成交量（股）",
        dataIndex: "tnv_vol"
      },
      {
        title: "买入营业部",
        dataIndex: "dept_name_buy"
      },
      {
        title: "卖出营业部",
        dataIndex: "dept_name_sell"
      }
    ]
  },
  cfxqTable: {
    compType: "table",
    compName: "BlockTransactionTable", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
    columns: [
      {
        title: "处罚对象",
        dataIndex: "pun_obj"
      },
      {
        title: "处罚结果",
        dataIndex: "pun_rslt"
      }
    ],

  },
  gdrsTable: {
    compType: "table",
    compName: "BlockTransactionTable", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
    columns: [
      {
        title: "交易日期",
        width: 120,
        dataIndex: "end_dt"
      },
      {
        title: "人均流通A股(万股)",
        width: 120,
        dataIndex: "a_avg_shr"
      },
      {
        title: "A股股东总数(户)",
        width: 120,
        dataIndex: "a_ttl_sh"
      },
      {
        title: "股价(元)",
        width: 120,
        dataIndex: "cls_prc"
      }
    ],

  },

  cgjgTable: {
    compType: "table",
    compName: "BlockTransactionTable", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
    columns: [
      {
        title: "交易日期",
        width: 170,
        dataIndex: "end_dt"
      },
      {
        title: "机构数量",
        width: 200,
        dataIndex: "org_num"
      },
      {
        title: "机构持股数(万股)",
        width: 200,
        dataIndex: "hld_shr"
      },
      {
        title: "机构持股市值(亿元)",
        width: 200,
        dataIndex: "hld_val"
      }, {
        title: "机构持股占总股本比例(%)",
        width: 200,
        dataIndex: "ttl_cptl_rat"
      }, {
        title: "流通股持股结构(%)",
        width: 200,
        dataIndex: "rateList"
      }
    ],

  },
  zjlxTable: {
    compType: "table",
    compName: "BlockTransactionTable", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
    columns: [
      {
        title: "交易日期",
        width: 120,
        dataIndex: "trd_dt"
      },
      {
        title: "主力净流入(万元)",
        width: 120,
        dataIndex: "main_mny_net_in"
      },
      {
        title: "超大单净额(万元)",
        width: 120,
        dataIndex: "huge_net_in"
      },
      {
        title: "大单金额(万元)",
        width: 120,
        dataIndex: "big_net_in"
      },
      {
        title: "中单净额(万元)",
        width: 120,
        dataIndex: "mid_net_in"
      },
      {
        title: "小单净额(万元)",
        width: 120,
        dataIndex: "small_net_in"
      }
    ]
  },

  rzrqTable: {
    compType: "table",
    compName: "BlockTransactionTable", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
    columns: [
      {
        title: "交易日期",
        width: 120,
        dataIndex: "trd_dt"
      },
      {
        title: "融资余额(元)",
        width: 120,
        dataIndex: "fin_val"
      },
      {
        title: "融券卖出量(股)",
        width: 120,
        dataIndex: "secu_sell_vol"
      },
      {
        title: "融券余额(元)",
        width: 120,
        dataIndex: "secu_val"
      },
      {
        title: "融券余量(股)",
        width: 120,
        dataIndex: "secu_vol"
      },
      {
        title: "融资融券余额(元)",
        width: 120,
        dataIndex: "ttl_val"
      }
    ],
  },

  menu : [{
    type: 'table',
    name: '市场表现',
    elem: 'scbx',
    columns: [{
      title: '排名', dataIndex: 'rank', width: 80,
    }, {
      title: '证券代码', dataIndex: 'trd_code'
    }, {
      title: '证券简称', dataIndex: 'secu_sht'
    }, {
      title: '涨跌幅(%)', dataIndex: 'day_chg_rat', defaultSortOrder: 'descend',
    }, {
      title: '1周涨跌幅(%)', dataIndex: 'chg_rat_rw'
    }, {
      title: '1月涨跌幅(%)', dataIndex: 'chg_rat_rm'
    }, {
      title: '3月涨跌幅(%)', dataIndex: 'chg_rat_r3m'
    }, {
      title: '6月涨跌幅(%)', dataIndex: 'chg_rat_r6m'
    }, {
      title: '1年涨跌幅(%)', dataIndex: 'chg_rat_ry'
    }]
  }, {
    type: 'table',
    name: '公司规模',
    elem: 'gsgm',    
    columns: [{
      title: '排名', dataIndex: 'rank', width: 80
    }, {
      title: '证券代码', dataIndex: 'trd_code'
    }, {
      title: '证券简称', dataIndex: 'secu_sht'
    }, {
      title: 'A股总市值(亿元)', dataIndex: 'tmkt_val', defaultSortOrder: 'descend',
    }, {
      title: 'A股流通市值(亿元)', dataIndex: 'fmkt_val'
    }, {
      title: '流通A股(万股)', dataIndex: 'a_shr_circ'
    }, {
      title: '总股本(万股)', dataIndex: 'ttl_shr'
    }, {
      title: '营业收入(万元)', dataIndex: 'ttl_oper_inc'
    }]
  }, {
    type: 'table',
    name: '估值水平',
    elem: 'gzsp',    
    columns: [{
      title: '排名', dataIndex: 'rank', width: 80
    }, {
      title: '证券代码', dataIndex: 'trd_code'
    }, {
      title: '证券简称', dataIndex: 'secu_sht'
    }, {
      title: '市盈率TTM', dataIndex: 'pettm', defaultSortOrder: 'descend',
    }, {
      title: '市盈率LYR', dataIndex: 'pe'
    }, {
      title: '市盈率MRQ', dataIndex: 'pb'
    }, {
      title: '市销率TTM', dataIndex: 'pettm'
    }, {
      title: '市现率TTM', dataIndex: 'pc'
    }, {
      title: '最新收盘价(元)', dataIndex: 'cls_prc'
    }]
  }, {
    type: 'table',
    name: '财务状况',
    elem: 'cwzk',    
    columns: [{
      title: '排名', dataIndex: 'rank', width: 80
    }, {
      title: '证券代码', dataIndex: 'trd_code'
    }, {
      title: '证券简称', dataIndex: 'secu_sht'
    }, {
      title: '每股收益(元)', dataIndex: 'eps_bas', defaultSortOrder: 'descend',
    }, {
      title: '每股净资产(元)', dataIndex: 'bvps'
    }, {
      title: '净资产收益率(%)', dataIndex: 'roe'
    }, {
      title: '净销售利润(%)', dataIndex: 'sale_npm'
    }, {
      title: '净利润增长率(%)', dataIndex: 'net_prof_yoy'
    }]
  }],
  lhbTable: {
    compType: "table",
    compName: "BlockTransactionTable", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
    columns: [
      {
        title: "营业部名称",
        dataIndex: "dept_name"
      },
      {
        title: "买入金额(元)",
        dataIndex: "buy_val"
      },
      {
        title: "买入占总成交比例(%)",
        dataIndex: "buy_rat"
      },
      {
        title: "卖出金额(元)",
        dataIndex: "sell_val"
      },
      {
        title: "卖出占总成交比例(%)",
        dataIndex: "sell_rat"
      },
      {
        title: "净额(元)",
        dataIndex: "tnv_val"
      }
    ],
  },
  lhbTable2: {
    compType: "table",
    compName: "BlockTransactionTable", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
    columns: [
      {
        title: "营业部名称",
        dataIndex: "dept_name"
      },
      {
        title: "买入金额(元)",
        dataIndex: "buy_val"
      },
      {
        title: "买入占总成交比例(%)",
        dataIndex: "buy_rat"
      },
      {
        title: "卖出金额(元)",
        dataIndex: "sell_val"
      },
      {
        title: "卖出占总成交比例(%)",
        dataIndex: "sell_rat"
      },
      {
        title: "净额(元)",
        dataIndex: "tnv_val"
      }
    ],
  },
  /**
   * 十大流通股东
   */
  sdltgdTable: {
    compType: "table",
    compName: "BlockTransactionTable", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
    columns: [
      {
        title: '序号', dataIndex: 'sh_sn', isSorter: false,
      }, {
        title: '股东名称', dataIndex: 'sh_name',
      }, {
        title: '图形', dataIndex: 'chart',
        // render: (text, record) =><div  style={{width:(record.chart/maxN)*100 + '%',background:'#d8a060',height:'5px'}} ></div>,
      }, {
        title: '占股总比例', dataIndex: 'ttl_cptl_rat1',
      }
    ],
  },


  /**
   * 高管持股变动
   */
  ggcgbdTable: {
    compType: "table",
    compName: "BlockTransactionTable", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
    columns: [
      {
        title: "变动日期",
        width: 120,
        dataIndex: "chg_dt"
      },
      {
        title: "变动人与公司高管关系",
        width: 120,
        dataIndex: "rel_desc"
      },
      {
        title: "公司高管职务",
        width: 120,
        dataIndex: "posi_desc"
      },
      {
        title: "变动股数(股)",
        width: 120,
        dataIndex: "chg_shr",
      },
      {
        title: "变动均价(元股)",
        width: 120,
        dataIndex: "chg_avg_prc"
      },
      {
        title: "变动后持股数(股)",
        width: 120,
        dataIndex: "chg_shr_aft"
      },
      {
        title: "变动比例(%)",
        width: 120,
        dataIndex: "chg_rat"
      },
      {
        title: "股份变动途径",
        width: 120,
        dataIndex: "chg_rsn_desc"
      }
    ],
  },
  /**
   * 股东限售解禁表
   */
  gdjsjjbTable: {
    compType: "table",
    compName: "BlockTransactionTable", // 组件名
    dataType: [], // 数据类型
    // size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
    columns: [
      {
        title: "股东名称",
        width: 230,
        dataIndex: "sh_name"
      },
      {
        title: "解禁日期",
        width: 157,
        dataIndex: "bgn_dt"
      },
      {
        title: "解禁股数(股)",
        width: 144,
        dataIndex: "new_shr"
      },
      {
        title: "持股总数(股)",
        width: 144,
        dataIndex: "hld_shr"
      },
      {
        title: "解禁占流通股比例(%)",
        width: 96,
        dataIndex: "new_shr_rat"
      },
      {
        title: "解禁类型",
        width: 246,
        dataIndex: "shr_typ"
      }
    ]
  },
  /**
   * 指标一览
   */
  zbylTable: {
    compType: "table",
    compName: "BlockTransactionTable", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
    columns_ComcnFinAnal: [
      {
        title: "基本每股收益",
        dataIndex: "eps_bas"
      },
      {
        title: "净利润",
        dataIndex: "net_prof"
      },
      {
        title: "归属于上市公司股东的净利润",
        dataIndex: "net_prof_pco"
      },
      {
        title: "归属于上市公司股东的净利润同比增长",
        dataIndex: "net_prof_pco_yoy"
      },
      {
        title: "扣除非经常性损益后净利润",
        dataIndex: "net_prof_excl"
      },
      {
        title: "扣除非经常性损益后净利润同比增长",
        dataIndex: "net_prof_pco_excl_yoy"
      },
      {
        title: "营业总收入",
        dataIndex: "ttl_oper_inc"
      },
      {
        title: "营业总收入同比增长",
        dataIndex: "oper_inc_yoy"
      },
      {
        title: "每股净资产",
        dataIndex: "bvps"
      },
      {
        title: "全面摊薄净资产收益率",
        dataIndex: "roe"
      },
      {
        title: "加权平均净资产收益率",
        dataIndex: "roe_wt"
      },
      {
        title: "资产负债率",
        dataIndex: "ast_liab_rat"
      },
      {
        title: "每股资本公积",
        dataIndex: "cptl_rsv_ps"
      },
      {
        title: "每股未分配利润",
        dataIndex: "ret_prof_ps"
      },
      {
        title: "每股经营活动产生的现金流量净额",
        dataIndex: "net_cf_oper_ps"
      },
      {
        title: "销售净利率",
        dataIndex: "sale_npm"
      }
    ],
    columns_ComcnIncStmtNas: [
      {
        title: "净利润",
        dataIndex: "net_prof"
      },
      {
        title: "扣非净利润",
        dataIndex: "net_prof_pco_excl"
      },
      {
        title: "营业总收入",
        dataIndex: "ttl_oper_inc"
      },
      {
        title: "营业收入",
        dataIndex: "oper_inc"
      },
      {
        title: "营业总成本",
        dataIndex: "ttl_oper_cost"
      },
      {
        title: "营业成本",
        dataIndex: "oper_cost"
      },
      {
        title: "营业利润",
        dataIndex: "oper_prof"
      },
      {
        title: "投资收益",
        dataIndex: "inv_inc"
      },
      {
        title: "资产减值损失",
        dataIndex: "ast_impr_loss"
      },
      {
        title: "管理费用",
        dataIndex: "adm_exp"
      },
      {
        title: "销售费用",
        dataIndex: "sell_exp"
      },
      {
        title: "财务费用",
        dataIndex: "fin_exp"
      },
      {
        title: "营业外收入",
        dataIndex: "noper_inc"
      },
      {
        title: "营业外支出",
        dataIndex: "noper_exp"
      },
      {
        title: "营业税金及附加",
        dataIndex: "biz_tax_sur"
      },
      {
        title: "利润总额",
        dataIndex: "ttl_prof"
      }, {
        title: "所得税",
        dataIndex: "inc_tax_exp"
      }, {
        title: "其他综合收益",
        dataIndex: "oth_comp_inc"
      }, {
        title: "综合收益总额",
        dataIndex: "ttl_comp_inc"
      }, {
        title: "归属于母公司股东的综合收益总额",
        dataIndex: "pco_ttl_comp_inc"
      }
    ],
    columns_ComcnCashFlowNas: [
      {
        title: "销售商品、提供劳务收到的现金",
        dataIndex: "cash_rcv_sale"
      },
      {
        title: "收到的税费和返还",
        dataIndex: "tax_rbt_rcv"
      },
      {
        title: "支付的各项税费",
        dataIndex: "cash_pay_tax"
      },
      {
        title: "支付给职工一级为职工支付的现金",
        dataIndex: "cash_pay_emp"
      },
      {
        title: "经营现金流入",
        dataIndex: "cf_in_oper"
      },
      {
        title: "经营现金流出",
        dataIndex: "cf_out_oper"
      },
      {
        title: "经营现金流量净额",
        dataIndex: "net_cf_oper"
      },
      {
        title: "处置固定资产、无形资产的现金",
        dataIndex: "cash_rcv_dspl_filt_ast"
      },
      {
        title: "构建固定资产和其他支付的现金",
        dataIndex: "pur_fix_intg_ast"
      },
      {
        title: "投资支付的现金",
        dataIndex: "cash_pay_inv"
      },
      {
        title: "取得子公司现金净额",
        dataIndex: "sub_pay_cash"
      },
      {
        title: "支付其他与投资的现金",
        dataIndex: "oth_cash_pay_inv"
      },
      {
        title: "投资现金流入",
        dataIndex: "cf_in_inv"
      },
      {
        title: "投资现金流出",
        dataIndex: "cf_out_inv"
      },
      {
        title: "投资现金流量净额",
        dataIndex: "net_cf_inv"
      },
      {
        title: "吸收投资收到现金",
        dataIndex: "cash_rcv_cptl"
      },
      {
        title: "取得借款的现金",
        dataIndex: "brw_rcv"
      },
      {
        title: "收到其他与筹资的现金",
        dataIndex: "oth_cash_rcv_fin"
      },
      {
        title: "偿还债务支付现金",
        dataIndex: "cash_rpay_brw"
      },
      {
        title: "分配股利、利润或偿付利息支付的现金",
        dataIndex: "cash_pay_dvd_int"
      },
      {
        title: "支付其他与筹资的现金",
        dataIndex: "oth_cash_pay_fin"
      },
      {
        title: "筹资现金流入",
        dataIndex: "cf_in_fin"
      },
      {
        title: "筹资现金流出",
        dataIndex: "cf_out_fin"
      },
      {
        title: "筹资现金流量净额",
        dataIndex: "net_cf_fin"
      },
      {
        title: "汇率变动对现金的影响",
        dataIndex: "efct_er_chg_cash"
      },
      {
        title: "现金及现金等价物净增加额",
        dataIndex: "cash_eq_net_incr"
      }
    ],
    columns_ComcnBalShtNas: [
      {
        title: "货币资金",
        dataIndex: "mny_cptl"
      },
      {
        title: "应收账款",
        dataIndex: "acct_rcv"
      },
      {
        title: "预付账款",
        dataIndex: "ppay"
      },
      {
        title: "应收利息",
        dataIndex: "int_rcv"
      },
      {
        title: "其他应收款",
        dataIndex: "oth_rcv"
      },
      {
        title: "其他流动资产",
        dataIndex: "oth_cur_ast"
      },
      {
        title: "流动资产合计",
        dataIndex: "ttl_cur_ast"
      },
      {
        title: "可供出手金融资产",
        dataIndex: "aval_sale_fin_ast"
      },
      {
        title: "固定资产",
        dataIndex: "fix_ast"
      },
      {
        title: "在建工程",
        dataIndex: "const_matl"
      },
      {
        title: "无形资产",
        dataIndex: "intg_ast"
      },
      {
        title: "商誉",
        dataIndex: "gw"
      },
      {
        title: "长期待摊费用",
        dataIndex: "lt_ppay_exp"
      },
      {
        title: "递延所得税资产",
        dataIndex: "dfr_tax_ast"
      },
      {
        title: "非流动资产合计",
        dataIndex: "ttl_ncur_ast"
      },
      {
        title: "资产总计",
        dataIndex: "ttl_ast"
      },
      {
        title: "短期借款",
        dataIndex: "st_ln"
      },
      {
        title: "应付账款",
        dataIndex: "acct_pay"
      },
      {
        title: "预收账款",
        dataIndex: "acct_rcv_adv"
      },
      {
        title: "应付职工薪酬",
        dataIndex: "emp_comp_pay"
      },
      {
        title: "应收税费",
        dataIndex: "tax_pay"
      },
      {
        title: "应付股利",
        dataIndex: "dvd_pay"
      },
      {
        title: "其他应付款",
        dataIndex: "oth_pay"
      },
      {
        title: "流动负债合计",
        dataIndex: "ttl_cur_liab"
      },
      {
        title: "预计负债-非流动",
        dataIndex: "est_liab"
      },
      {
        title: "预计负债-流动",
        dataIndex: "est_liab_cur"
      },
      {
        title: "递延所得税负债",
        dataIndex: "dfr_tax_liab"
      },
      {
        title: "其他非流动负债",
        dataIndex: "oth_ncur_liab"
      },
      {
        title: "非流动负债合计",
        dataIndex: "ttl_ncur_liab"
      },
      {
        title: "负债合计",
        dataIndex: "ttl_liab"
      },
      {
        title: "股本",
        dataIndex: "pay_up_cptl"
      },
      {
        title: "资本公积金",
        dataIndex: "cptl_rsv"
      },
      {
        title: "盈余公积金",
        dataIndex: "sur_rsv"
      },
      {
        title: "未分配利润",
        dataIndex: "ret_prof"
      },
      {
        title: "外币报表折算差额",
        dataIndex: "fcy_trslt_diff"
      },
      {
        title: "归属于上市公司股东权益合计",
        dataIndex: "ttl_eqy_pco"
      },
      {
        title: "归属于普通股股东权益",
        dataIndex: "ttl_eqy_shr"
      },
      {
        title: "负债和股东权益总计",
        dataIndex: "liab_sheqy"
      }
    ],
    columns_ComcnScBkCptl: [
      {
        title: "证券净资本(",
        dataIndex: "net_cptl"
      },
      {
        title: "净资产",
        dataIndex: "net_ast"
      },
      {
        title: "净资本/各项风险资本准备之和",
        dataIndex: "net_cptl_risk_rsv"
      },
      {
        title: "净资本/净资产",
        dataIndex: "net_cptl_ast"
      },
      {
        title: "净资本/负债",
        dataIndex: "net_cptl_liab"
      },
      {
        title: "净资产/负债",
        dataIndex: "net_ast_liab"
      },
      {
        title: "自营权益类证券及证券衍生品/净资本",
        dataIndex: "ssup_eqy_net_cptl"
      },
      {
        title: "自营固定收益类证券/净资本",
        dataIndex: "ssup_bnd_net_cptl"
      },
      {
        title: "各项风险资本准备之和",
        dataIndex: "risk_rsv"
      }
    ],

  },

  /**
 * 资本运作上市公司
 */
  gqtzTable: {
    compType: "table",
    compName: "EquityInvestment", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
    columns: [
      {
        title: "证券代码",
        dataIndex: "inv_trd_code"
      },
      {
        title: "公司名称",
        dataIndex: "inv_secu_sht"
      },
      {
        title: "初始投资(元)",
        dataIndex: "inv_val_bgn"
      },
      {
        title: "期末持有数(元)",
        dataIndex: "hld_val_end"
      },
      {
        title: "期末账面价值(元)",
        dataIndex: "acct_val_end"
      },
      {
        title: "报告期投资损益(元)",
        dataIndex: "prof_and_loss"
      }
    ],

  },
  /**
 * 资本运作非上市公司
 */
  gqtzfssTable: {
    compType: "table",
    compName: "EquityInvestment", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
    columns: [
      {
        title: "公司名称",
        dataIndex: "inv_secu_sht"
      },
      {
        title: "初始投资(元)",
        dataIndex: "inv_val_bgn"
      },
      {
        title: "期末持有数(元)",
        dataIndex: "hld_val_end"
      },
      {
        title: "期末账面价值(元)",
        dataIndex: "acct_val_end"
      },
      {
        title: "会计核算科目",
        dataIndex: "item_name"
      }
    ],

  },

/**
 * 主营构成
 */
zygcTable: {
  compType: "table",
  compName: "EquityInvestment", // 组件名
  dataType: [], // 数据类型
  size: "small", // 组件大小
  pagination: false, // 是否分页
  // 表格列配置
  columns: [
    {
      title: "",
      width:120,
      dataIndex: "biz_typ_name"
    },
    {
      title: "主营构成",
       width:120,
      dataIndex: "biz_name"
    },
    {
      title: "主营收入",
       width:120,
      dataIndex: "oper_inc1"
    },
    {
      title: "主营成本",
       width:120,
      dataIndex: "oper_cost1"
    },
    {
      title: "成本比例",
       width:120,
      dataIndex: "ttl_oper_cost_rat1"
    },
    {
      title: "营业利润",
       width:120,
      dataIndex: "oper_prof1"
    },
    {
      title: "利润比例",
       width:120,
      dataIndex: "ttl_oper_prof_rat1"
    },
    {
      title: "毛利润",
       width:120,
      dataIndex: "gpm1"
    }
  ],

},




  /**
   * 分红
   */
  fenhongTable: {
    compType: "table",
    compName: "BlockTransactionTable", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
    columns: [
      {
        title: "年度",
        width:60,
        dataIndex: "end_dt"
      },
      {
        title: "分红方案说明",
        width:138,
        dataIndex: "cash_bfr_tax"
      },
      {
        title: "分红对象",
        dataIndex: "rd_obj"
      },
      {
        title: "董事会预案",
        dataIndex: "bd_rslt_ntc_dt"
      },
      {
        title: "懂事大会决案",
        dataIndex: "shm_rslt_ntc_dt"
      },
      {
        title: "实施公告",
        dataIndex: "impl_ntc_dt"
      },
      {
        title: "分红进程股权登记",
        dataIndex: "rt_reg_dt"
      },
      {
        title: "除权除息",
        dataIndex: "ex_rd_dt"
      },
      {
        title: "送转股上市日",
        dataIndex: "bt_trd_dt"
      },
      {
        title: "红利发放",
        dataIndex: "dvd_pay_dt"
      },
      {
        title: "股份支付率%",
        dataIndex: "dvd_pay_rat"
      }
    ],
  },
  /**
   * 增发
   */
  zengfaTable: {
    compType: "table",
    compName: "BlockTransactionTable", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
    columns: [
      {
        title: "方案进度",
        width :100,
        dataIndex: "event_proc_desc"
      },
      {
        title: "发行对象类型",
        width :300,
        dataIndex: "iss_obj"
      },
      {
        title: "发行方式",
        width :50,
        dataIndex: "type"
      },
      {
        title: "发行方案",
        dataIndex: "programme"
      },
      {
        title: "增发进程",
        dataIndex: "process"
      }
    ],
   
  },
  /**
   * 配股
   */
  peiguTable: {
    compType: "table",
    compName: "BlockTransactionTable", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
    columns: [
      {
        title: "方案进度",
        dataIndex: "fajd"
      },
      {
        title: "发行对象类型",
        dataIndex: "fxdx"
      },
      {
        title: "发行方式",
        dataIndex: "fxfs"
      },
      {
        title: "发行方案",
        dataIndex: "fsfa"
      },
      {
        title: "股份支付率（%）",
        dataIndex: "gfzf"
      }
    ],
    data: []
  },
  /**
   * 评级一览
   */
  pjylTable: {
    compType: "table",
    compName: "BlockTransactionTable", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
    columns: [
      {
        title: "评级周期",
        dataIndex: "pjzq"
      },
      {
        title: "综合评价",
        dataIndex: "zhpj"
      },
      {
        title: "合计",
        dataIndex: "hj"
      },
      {
        title: "买入",
        dataIndex: "mr"
      },
      {
        title: "增持",
        dataIndex: "zc"
      },
      {
        title: "中性",
        dataIndex: "zx"
      },
      {
        title: "减持",
        dataIndex: "jx"
      },
      {
        title: "卖出",
        dataIndex: "mc"
      }
    ],
    data: [
      {
        pjzq: "近六个月",
        zhpj: "买入",
        hj: "74",
        mr: "76",
        zc: "9",
        zx: "0",
        jx: "0",
        mc: "0"
      },
      {
        pjzq: "近六个月",
        zhpj: "买入",
        hj: "74",
        mr: "76",
        zc: "9",
        zx: "0",
        jx: "0",
        mc: "0"
      },
      {
        pjzq: "近六个月",
        zhpj: "买入",
        hj: "74",
        mr: "76",
        zc: "9",
        zx: "0",
        jx: "0",
        mc: "0"
      },
      {
        pjzq: "近六个月",
        zhpj: "买入",
        hj: "74",
        mr: "76",
        zc: "9",
        zx: "0",
        jx: "0",
        mc: "0"
      }
    ]
  },
  /**
   * 业绩预测明细
   */
  yjycmxTable: {
    compType: "table",
    compName: "BlockTransactionTable", // 组件名
    dataType: [], // 数据类型
    size: "small", // 组件大小
    pagination: false, // 是否分页
    // 表格列配置
 
    
  }
};
export default baseConfig;
