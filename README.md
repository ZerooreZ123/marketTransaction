# 项目集成 react16 react-router4  react-redux  redux-thunk异步中间件  antd UI组件库  animate.css样式库


# 安装依赖
    npm install



# 启动本地开发环境服务
    npm run start
    
    
# 打包测试环境代码
    npm run build-uat
# 打包生产环境代码
    npm run build-pro
#### 打包后的正式环境代码与测试环境代码可以在 ‘src/config/Constant.js’ 中区别测试与生产中有可能出现的不同，比如接口地址等


# 必要的规范：
#### 所有className,id,文件名以及方法名请使用小驼峰命名
    例如： className='myCompnent'
          myUtil.js
          
#### 组件文件夹和组件名称请使用大驼峰命名
    例如： MyComponent

#### 所有有属性请使用单引号

#### 不要通过 displayName 来命名组件，通过引用来命名组件
    // bad
    export default React.createClass({
      displayName: 'ReservationCard',
      // stuff goes here
    });
    
    // good
    export default class ReservationCard extends React.Component {
    }
    
#### 对于JSX语法，props少的可以一行，多的遵循下面的对齐风格。
    // bad
      <Foo superLongParam='bar'
           anotherSuperLongParam="baz" />
    
      // good
      <Foo
        superLongParam='bar'
        anotherSuperLongParam="baz"
      />
    
      // props只有一个的，可以一行写完
      <Foo bar='bar' />
    
      // children
      <Foo
        superLongParam='bar'
        anotherSuperLongParam='baz'
      >
        <Spazz />
      </Foo>
      
#### 没有子组件的父组件使用自闭和标签      
      //bad
      <Foo></Foo>
      
      //good
      <Foo />    
      
#### 不要对 React 组件的内置方法使用 underscore 前缀
    // bad
    React.createClass({
      _onClickSubmit() {
        // do stuff
      }
    
      // other stuff
    });
    
    // good
    class extends React.Component {
      onClickSubmit() {
        // do stuff
      }
    
      // other stuff
    });
    
#### 继承 React.Component 的类的方法可以遵循下面的顺序
     1   constructor
     2   optional static methods
     3   getChildContext
     4   componentWillMount
     5   componentDidMount
     6   componentWillReceiveProps
     7   shouldComponentUpdate
     8   componentWillUpdate
     9   componentDidUpdate
     10  componentWillUnmount
     11  clickHandlers or eventHandlers like onClickSubmit() or onChangeDescription()
     12  getter methods for render like getSelectReason() or getFooterContent()
     13  Optional render methods like renderNavigation() or renderProfilePicture()
     14  render

#### 每个组件的本组件状态和数据放在自己的文件夹
    例如： Test组件。
          index--界面以及界面处理方法
          action--本组件的action创建函数
          actionType--存储action常量
          reducer--组件数据以及reducer函数
    最后把本组件数据绑定到reducers/index.js.old 状态树。
          
#### 共用的工具方法可以放到utils文件夹下以功能命名
    例如： http.js math.js等
    
#### 所有常量放入config/Constant.js
#### 所有接口放入config/Interface.js

