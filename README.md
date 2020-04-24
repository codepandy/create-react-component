# create-react-component

一个创建 react 组件的脚手架命令行工具 CLI，创建的组件已做浏览器兼容。

## 安装

```bash
npm install -g @wenmu/create-react-component
```

## 初始化项目

```bash
c-rc-c init <componentName>

//比如
c-rc-c init GroupButton
```

### 命令为什么是`c-rc-c`

这是`create-react-component`的缩写。本来想写成`ccc`，感觉这个名字太随便了，哈哈。

## 开发组件

目录结构

```bash
.
├── README.md           # 组件说明文件
├── package-lock.json
├── package.json
├── src                 # 代码目录
│   ├── assets          # 图片等静态资源
│   ├── demo            # 测试组件目录
│   ├── index.js        # 组件代码文件
│   └── index.less
├── webpack.base.js     # webpack共用配置
├── webpack.dev.js      # webpack开发环境配置
└── webpack.pro.js      # webpack生产环境配置
```

## 测试组件

组件开发过程中，可以在 demo 中调用测试结果。

```bash
npm run start
```

## 发布组件到 npm 仓库中

组件测试没问题后，就可以发布到 npm 仓库中，供他人和自己以后使用。

```bash
npm run pub
```

至于发布到 npm 仓库的相关配置，可以看这边文章：[《开发并发布和更新一个 npm 包》](https://blog.wangpengpeng.site/2020/01/08/%E5%BC%80%E5%8F%91%E5%B9%B6%E5%8F%91%E5%B8%83%E5%92%8C%E6%9B%B4%E6%96%B0%E4%B8%80%E4%B8%AAnpm%E5%8C%85/)
