# vue_shop

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

开发启动项目流程
1. cd /Users/xxx/Documents/git.xxx.com/vue_shop
2. vue ui
3. 在浏览器ui中 启动 项目 http://localhost:8000/tasks



项目上线流程：

1. 通过node创建web服务器
新创建node项目,并安装express,通过express快速创建web服务器,将vue打包生成的dist文件夹,托管为静态资源即可,关键代码如下
```
// 1. 新建文件夹 新建vue_shop_server
// 2. cd /Users/xxx/Documents/git.xxx.com/vue_shop_server
// 3. npm init -y
// 4. npm i express -S
// 5. 将打包后的dist放入node项目中
  在vue ui 浏览器中， 点击build 会生成dist/ 文件夹
// 6. 在vue_shop_server根目录中，新建app.js
将以下代码导入：
const express = require('express')
const app = express()

app.use(express.static('./dist'))
app.listen(80, () => {
    console.log('server runing at http://127.0.0.1')
})
// 5. node app.js启动项目
在vue_shop_server根目录中
  node ./app.js 
  当终端打印server running at http://127.0.0.1 为成功运行
  可以通过http://127.0.0.1 直接访问
```

2. 开启gzip配置
通过gzip减小文件体积,使传输速度更快
在服务器端使用express做gzip压缩,配置如下
```
// 1. cd vue_shop_server根目录
// 2. npm install compression -S
// 3. 导入包
const compression = require('compression')
// 4. 启用中间件
app.use(compression())
```


最终app.js 代码如下：
```
  const express = require('express')
  // Gzip压缩
  const compression = require('compression')

  const app = express()
  // 一定要把这一行代码，写到静态资源托管之前，否则Gzip压缩 不生效
  app.use(compression())
  app.use(express.static('./dist'))

  app.listen(80, () => {
    console.log('server running at http://127.0.0.1')
  })
```

项目进程管理【后台】
使用pm2管理应用
1. npm i pm2 -g //全局安装
2. 进入vue_shop_server
- cd /Users/xxx/Documents/git.xxx.com/vue_shop_server
3. pm2 start 脚本(如./app.js) --name 自定义名称 // 启动项目
- pm2 start ./app.js --name web_vueshop
- 可以通过 http://127.0.0.1/ 进行访问
4. pm2 ls //查看服务器运行的项目
5. pm2 restart 自定义名称 //重启项目
6. pm2 stop 自定义名称 //停止项目
7. pm2 delete 自定义名称 //删除项目
