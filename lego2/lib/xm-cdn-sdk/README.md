# xm-cdn-sdk

## 静态文件上传 cdn 接入文档

#### sdk 参数说明

- env  
  当前环境变量，必传
- cdnDirName  
  cdn静态文件夹名称，必传
- bundleDirName  
  本地打包后静态文件存放的文件夹目录，必传

### 初始化 SDK

```javascript
const XmCdnSdk = require("xm-cdn-sdk");
const path = require("path");

const bundleDirName = path.resolve(path.join(__dirname, "****"));

const xmCdnSdk = new XmCdnSdk({
  env: "qa", // 当前环境变量
  bundleDirName, // 本地打包后静态文件存放的文件夹目录
  cdnDirName: "*****", // cdn静态文件夹名称
});

xmCdnSdk.init();
```

#####  注意事项：
- 暂无
