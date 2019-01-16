//F10-财务资本经营
import React from "react";

export let baseConfigFinancial={
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
                dataIndex: "code"
            },
            {
                title: "公司名称",
                dataIndex: "CName"
            },
            {
                title: "初始投资(元)",
                dataIndex: "perNum"
            },
            {
                title: "期末持有数(元)",
                dataIndex: "hasNum"
            },
            {
                title: "报告期投资损益(元)",
                dataIndex: "winAndLose1"
            },
            {
                title: "报告期投资损益(元)",
                dataIndex: "winAndLose2"
            }
        ],
        data: [
            {
                code: "60111",
                CName: "中国国航",
                perNum: "4.6亿",
                hasNum: "--",
                winAndLose1:'123',
                winAndLose2:'234'
            },
            {
                code: "60111",
                CName: "中国国航",
                perNum: "4.6亿",
                hasNum: "--",
                winAndLose1:'123',
                winAndLose2:'234'
            },
            {
                code: "60111",
                CName: "中国国航",
                perNum: "4.6亿",
                hasNum: "--",
                winAndLose1:'123',
                winAndLose2:'234'
            },
            {
                code: "60111",
                CName: "中国国航",
                perNum: "4.6亿",
                hasNum: "--",
                winAndLose1:'123',
                winAndLose2:'234'
            },
            {
                code: "60111",
                CName: "中国国航",
                perNum: "4.6亿",
                hasNum: "--",
                winAndLose1:'123',
                winAndLose2:'234'
            },
            {
                code: "60111",
                CName: "中国国航",
                perNum: "4.6亿",
                hasNum: "--",
                winAndLose1:'123',
                winAndLose2:'234'
            }
        ]
    },
    gqtzFssTable:{
        compType: "table",
        compName: "EquityInvestment", // 组件名
        dataType: [], // 数据类型
        size: "small", // 组件大小
        pagination: false, // 是否分页
        columns: [
            {
                title: "公司名称",
                dataIndex: "CName"
            },
            {
                title: "初始投资(元)",
                dataIndex: "perNum"
            },
            {
                title: "期末账面价值(元)",
                dataIndex: "hasNum"
            },
            {
                title: "会计核算科目",
                dataIndex: "computer"
            }
        ],
        data: [
            {
                CName: "中国国航",
                perNum: "4.6亿",
                hasNum: "6亿",
                computer:'312'
            },
            {
                CName: "中国国航",
                perNum: "4.6亿",
                hasNum: "6亿",
                computer:'312'
            },
            {
                CName: "中国国航",
                perNum: "4.6亿",
                hasNum: "6亿",
                computer:'312'
            }
        ]
    },
    kgcjTable:{
        compType: "table",
        compName: "EquityInvestment", // 组件名
        dataType: [], // 数据类型
        size: "small", // 组件大小
        pagination: false, // 是否分页
        columns: [
            {
                title: "",
                dataIndex: "FL",
                render: (value, row, index) => {
                    const obj = {
                        children: value,
                        props: {},
                    };
                    obj.props.rowSpan = 0
                    if (index === 0) {
                        obj.props.rowSpan = 4;
                    }
                    // These two are merged into above cell
                    if (index === 4) {
                        obj.props.rowSpan = 7;
                    }
                    if (index === 11) {
                        obj.props.rowSpan = 3;
                    }
                    return obj;
                }
            },
            {
                title: "主营构成",
                dataIndex: "zygc"
            },
            {
                title: "主营收入",
                dataIndex: "zysr"
            },
            {
                title: "收入比例",
                dataIndex: "srbl"
            },
            {
                title: "主营成本",
                dataIndex: "zycb"
            },
            {
                title: "成本比列",
                dataIndex: "cbbl"
            },
            {
                title: "营业利润",
                dataIndex: "yylr"
            },
            {
                title: "利润比列",
                dataIndex: "lrbl"
            },
            {
                title: "毛利润",
                dataIndex: "mlr"
            }
        ],
        data: [
            {
                FL:'按行业',
                zygc: "经济和财务管理",
                zysr: "4.6亿",
                srbl: "6亿",
                zycb:'312',
                cbbl:'--',
                yylr:'--',
                lrbl:'--',
                mlr:'111'
            },
            {
                FL:'按行业',
                zygc: "投资银行",
                zysr: "4.6亿",
                srbl: "6亿",
                zycb:'312',
                cbbl:'--',
                yylr:'--',
                lrbl:'--',
                mlr:'111'
            },
            {
                FL:'按行业',
                zygc: "其他",
                zysr: "4.6亿",
                srbl: "6亿",
                zycb:'312',
                cbbl:'--',
                yylr:'--',
                lrbl:'--',
                mlr:'111'
            },
            {
                FL:'按行业',
                zygc: "投资管理",
                zysr: "4.6亿",
                srbl: "6亿",
                zycb:'312',
                cbbl:'--',
                yylr:'--',
                lrbl:'--',
                mlr:'111'
            },
            {
                FL:'按产品',
                zygc: "手续费及其他收入",
                zysr: "4.6亿",
                srbl: "6亿",
                zycb:'312',
                cbbl:'--',
                yylr:'--',
                lrbl:'--',
                mlr:'111'
            },
            {
                FL:'按产品',
                zygc: "投资收益",
                zysr: "4.6亿",
                srbl: "6亿",
                zycb:'312',
                cbbl:'--',
                yylr:'--',
                lrbl:'--',
                mlr:'111'
            },
            {
                FL:'按产品',
                zygc: "利息净收入",
                zysr: "4.6亿",
                srbl: "6亿",
                zycb:'312',
                cbbl:'--',
                yylr:'--',
                lrbl:'--',
                mlr:'111'
            },
            {
                FL:'按产品',
                zygc: "公允价值变动利益",
                zysr: "4.6亿",
                srbl: "6亿",
                zycb:'312',
                cbbl:'--',
                yylr:'--',
                lrbl:'--',
                mlr:'111'
            },
            {
                FL:'按产品',
                zygc: "其他业务收入",
                zysr: "4.6亿",
                srbl: "6亿",
                zycb:'312',
                cbbl:'--',
                yylr:'--',
                lrbl:'--',
                mlr:'111'
            },
            {
                FL:'按产品',
                zygc: "其他利益",
                zysr: "4.6亿",
                srbl: "6亿",
                zycb:'312',
                cbbl:'--',
                yylr:'--',
                lrbl:'--',
                mlr:'111'
            },
            {
                FL:'按产品',
                zygc: "汇兑收益",
                zysr: "4.6亿",
                srbl: "6亿",
                zycb:'312',
                cbbl:'--',
                yylr:'--',
                lrbl:'--',
                mlr:'111'
            },
            {
                FL:'按地区',
                zygc: "广东地区",
                zysr: "4.6亿",
                srbl: "6亿",
                zycb:'312',
                cbbl:'--',
                yylr:'--',
                lrbl:'--',
                mlr:'111'
            },
            {
                FL:'按地区',
                zygc: "香港地区",
                zysr: "4.6亿",
                srbl: "6亿",
                zycb:'312',
                cbbl:'--',
                yylr:'--',
                lrbl:'--',
                mlr:'111'
            },
            {
                FL:'按地区',
                zygc: "其他地区",
                zysr: "4.6亿",
                srbl: "6亿",
                zycb:'312',
                cbbl:'--',
                yylr:'--',
                lrbl:'--',
                mlr:'111'
            }
        ]
    }
}

export default baseConfigFinancial;