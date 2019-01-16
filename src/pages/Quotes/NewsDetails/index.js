/*
* 行情详情组件
* 通过redux 中 isShow 来引用组件和卸载组件
*/
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Modal } from 'antd';
import {controller} from '@/actions'
import './index.less';
import {Resource} from '@/utils/resource';

import {formDate,formDate2} from '@/utils/FormatUtils'


class NewsDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            newsDetailsInfo:{}
        }
    }

 
    componentDidMount() {
        if(this.props.newsDetailsData.name === "DetailNewsLeft"){
            Resource.ZxTxtNwsLstComs.post('', '', this.props.newsDetailsData.id).then((data) => {
                // console.log(data,"DetailNewsLeft")
                this.setState({newsDetailsInfo : data})
              }).catch(err => {})
        }else if(this.props.newsDetailsData.name === "DetailNewsRight"){
            // console.log(data,"DetailNewsRight")            
            Resource.ZxTxtAnnCenters.post('', '',  this.props.newsDetailsData.id).then((data) => {
                this.setState({newsDetailsInfo : data})
              }).catch(err => {})
        }else if(this.props.newsDetailsData.name === 'DetailNewsPaper'){
            Resource.ZxRrpRptAlls.post('', '', this.props.newsDetailsData.id).then((data) => {
                this.setState({ newsDetailsInfo : data })
              }).catch(err => {})
        }else{
            Resource.newsdetail.post('', '', this.props.newsDetailsData.id).then((data) => {
                console.log('新闻详情',data)
               this.setState({newsDetailsInfo : data})
              }).catch(err => {})
        }
        
       
    }

    handleCancel = () => {
        this.props.controller({isShowNewsDetails: false});
      }


    render (){
        console.log("数据详情",this.state.newsDetailsInfo)
        return (
            <div >
               <Modal
                    title="资讯"
                    visible={ this.props.isShowNewsDetails}
                    onCancel={this.handleCancel}
                    wrapClassName="newsModal"
                >
                {
                    this.props.newsDetailsData.name === "DetailNewsLeft" && (
                        <div className="newsDetails">
                            <div className="top">
                            <h2>{this.state.newsDetailsInfo.tit}</h2>
                            <p className="datetime">
                            来源：<span>{this.state.newsDetailsInfo.info_source}</span> <span>{formDate(this.state.newsDetailsInfo.pub_time ,this.state.newsDetailsInfo.pubtime,'YYYY-MM-DD HH:mm:ss')}</span>
                            </p>
                            <pre>{this.state.newsDetailsInfo.cont}</pre>
                            {/* <footer>
                            <p>【重要声明】：本公司所提供的公司公告、个股资料、投资咨询建议、研究报告、策略报告等信息仅供参考，并不构成所述证券买卖的出价或询价，投资者使用前请予以核实，风险自负。对于转载的外部资讯仅供参考，不代表广发证券股份有限公司对其内容的认可或推荐，不构成广发证券股份有限公司做出的投资建议或对任何证券投资价值观点的认可。本公司所提供的上述信息，力求但不保证数据的准确性和完整性，不保证已做最新变更，请以上市公司公告信息为准。投资者应当自主进行投资决策，对投资者因依赖上述信息进行投资决策而导致的财产损失，本公司不承担法律责任。未经本公司同意，任何机构或个人不得对本公司提供的上述信息进行任何形式的转载、发布、复制或进行有悖原意的删节和修改。</p>
                            </footer> */}
                            </div>
                            {/* <div className="bottom">
                                
                            </div> */}
                        </div>
                    )
                }{
                    this.props.newsDetailsData.name === "DetailNewsRight" && (
                        <div className="newsDetails">
                            <div className="top">
                            <h2>{this.state.newsDetailsInfo.tit}</h2>
                            <p className="datetime">
                            <span>{this.state.newsDetailsInfo.com_name}</span> <span>{formDate(this.state.newsDetailsInfo.pub_time ,this.state.newsDetailsInfo.pubtime,'YYYY-MM-DD HH:mm:ss')}</span>
                            </p>
                            <pre dangerouslySetInnerHTML={{ __html: this.state.newsDetailsInfo.cont}} ></pre>
                            {/* <footer>
                            <p>【重要声明】：本公司所提供的公司公告、个股资料、投资咨询建议、研究报告、策略报告等信息仅供参考，并不构成所述证券买卖的出价或询价，投资者使用前请予以核实，风险自负。对于转载的外部资讯仅供参考，不代表广发证券股份有限公司对其内容的认可或推荐，不构成广发证券股份有限公司做出的投资建议或对任何证券投资价值观点的认可。本公司所提供的上述信息，力求但不保证数据的准确性和完整性，不保证已做最新变更，请以上市公司公告信息为准。投资者应当自主进行投资决策，对投资者因依赖上述信息进行投资决策而导致的财产损失，本公司不承担法律责任。未经本公司同意，任何机构或个人不得对本公司提供的上述信息进行任何形式的转载、发布、复制或进行有悖原意的删节和修改。</p>
                            </footer> */}
                            </div>
                            {/* <div className="bottom">
                                
                            </div> */}
                        </div>
                    )
                } {
                    this.props.newsDetailsData.name === 'DetailNewsPaper' && (
                        <div className="newsDetails">
                            <div className="top">
                            <h2>{this.state.newsDetailsInfo.tit}</h2>
                            <p className="datetime">
                              <span>{this.state.newsDetailsInfo.com_name}</span> | <span>{this.state.newsDetailsInfo.aut}</span> | <span>{this.state.newsDetailsInfo.rpt_typ}</span> | <span>{formDate2(this.state.newsDetailsInfo.pub_dt)}</span>
                            </p>
                            <pre>{this.state.newsDetailsInfo.abst}</pre>
                            
                            </div>
                        </div>
                    )
                }
                {
                    this.props.newsDetailsData.name === "ComplexNewsKC" && (
                        <div className="newsDetails">
                            <div className="top">
                            <h2>{this.state.newsDetailsInfo.title}</h2>
                            <p className="datetime">
                            来源：<span>{this.state.newsDetailsInfo.medname}</span> <span>{formDate(this.state.newsDetailsInfo.pubdate ,this.state.newsDetailsInfo.pubtime,'YYYY-MM-DD HH:mm:ss')}</span>
                            </p>
                            <pre>{this.state.newsDetailsInfo.content}</pre>
                            {/* <footer>
                            <p>【重要声明】：本公司所提供的公司公告、个股资料、投资咨询建议、研究报告、策略报告等信息仅供参考，并不构成所述证券买卖的出价或询价，投资者使用前请予以核实，风险自负。对于转载的外部资讯仅供参考，不代表广发证券股份有限公司对其内容的认可或推荐，不构成广发证券股份有限公司做出的投资建议或对任何证券投资价值观点的认可。本公司所提供的上述信息，力求但不保证数据的准确性和完整性，不保证已做最新变更，请以上市公司公告信息为准。投资者应当自主进行投资决策，对投资者因依赖上述信息进行投资决策而导致的财产损失，本公司不承担法律责任。未经本公司同意，任何机构或个人不得对本公司提供的上述信息进行任何形式的转载、发布、复制或进行有悖原意的删节和修改。</p>
                            </footer> */}
                            </div>
                            {/* <div className="bottom">
                                
                            </div> */}
                        </div>
                    )
                   
                }
                    
                </Modal>
            </div>
        )
    }
}
export default connect(
    state => ({newsDetailsData:state.DisplayController.newsDetailsData,isShowNewsDetails:state.DisplayController.isShowNewsDetails}),{controller}
)(NewsDetails);
