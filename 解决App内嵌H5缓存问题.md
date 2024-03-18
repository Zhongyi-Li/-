#### 背景：每次前端 H5 资源发布后 用户手机打开 app h5 页面并没有实时更新

- 难点：由于 webview 组件类似浏览器的缓存机制，每次打开资源文件时会扫描本地磁盘/内存是否有缓存 有缓存的话就直接取缓存资源
  导致了用户多次退出 app 重新打开后还是旧的 h5 内容。而每次修改了文件后 webpack 在打包时会检测到资源文件内容的变化 重新生成唯一的文件名。但是依然失效
- 解决方案： 与后端协商，后端新增一个读取前端发布资源时间的接口，采用浏览器的协商缓存机制解决资源未更新的缓存问题。
- 步骤一：浏览器首次访问服务器资源时在资源文件中设置响应头 e-tag: 时间戳 + cache-control: no-cache 。后续的请求浏览器会自动在请求头上带上 if-None-Match。前端资源修改单独发布时 将打包时间的时间戳写入.env 文件中。通过 用户再次打开 h5 页 请求资源文件时 由于当前请求头中的 if-None-Match 大于服务器端的 e-tag 就会接收到状态码为 200 的新资源，否则服务器会返回 304 告诉浏览器使用本地内存的缓存资源文件
- 前端实现步骤：

1.  package.json 文件 npm run build 命令中增加 node generateTimestamp.js 命令。
2.  新建 generateTimestamp.js，
    fs.writeFileSync(path.resolve(\_\_dirname, '.env'), `BUILD_TIMESTAMP=${timestamp}\n`);
3.  在入口文件中如果收到响应头的 etag 与本次打包时间不一致则发送接口将打包的时间告知后端 process.env.BUILD_TIMESTAMP
