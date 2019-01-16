# 组件库说明与规范

## 文件目录结构

```
.
├── index.js
├── highOrder
│   └── TableInTabNew.js
├── lists
│   ├── ChangeOrigin.js
│   ├── ChangeOrigin.less
│   ├── ChartOrigin.js
│   ├── NewsOrigin.js
│   ├── NewsOrigin.less
│   ├── TableOrigin.js
│   └── TableOrigin.less
├── modules
│   ├── CompChange.js
│   ├── CompChart.js
│   ├── CompNews.js
│   └── CompTable.js
```

## 目录说明

* `./modules/`: 向外部提供组件的窗口
* `./highOrder/`: 存放组件修饰器, 为了降低组件代码的耦合度, 当组件部分模块**需要高度复用**时使用修饰器修饰
* `./lists/`: 存放供外部组件使用的子组件与模块

## 组件规范

1. 原则上组件应保存高度独立
2. 避免外部影响, 组件间避免相互耦合
3. 组件应考虑高度可配置化
4. 组件应考虑渲染情况下在容器内的自适应, 容器给定空间, 组件自适应填充
5. 推荐组件与数据独立捆绑组件初始化后发起数据请求(根据业务需求确定)

## 组件命名规范

**(待商议)**

如: 向外提供的组件以Comp开头, 供组件组装的子组件或模块以Origin结尾等

## 组件配置信息描述(迭代更新与组件用例保存)

**(待商议)**

1. 此表格记录配置信息的用途与含义, 应该迭代更新
2. 配置信息用例应在组件内固化保存并迭代更新

配置信息表:

名称 | 含义 | 用途
:--: | :--: | :--:
|||

略
