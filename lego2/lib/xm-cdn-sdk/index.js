const fs = require('fs-extra')
const path = require('path')
const axios = require('axios')
const request = require('request')
const chalk = require('chalk')

class XmCdnSDK {
  constructor(option) {
    if (!option) {
      this.logger.error('请传入正确的参数')
    }
    if (!option.env) {
      this.logger.error('请传入环境变量env参数 example:{ env:"production" }')
    }
    const {
      cdnDirName,
      bundleDirName,
      env,
    } = option
    this.env = env
    this.cdnDirName = cdnDirName
    this.bundleDirName = bundleDirName
  }

  init() {
    this.logger.info('开始上传静态文件...')
    // this.logger.info('传入的环境变量：' + this.env)
    this.fileDisplay(this.bundleDirName)
  }

  logger = {
    error: (log) => {
      throw new Error(chalk.redBright(log))
    },
    info: (log) => {
      console.log(chalk.magenta(log))
    },
  }

  setTakaTokenUrl = () => {
    if (this.env === 'qa') {
      XmCdnSDK.takaTokenUrl = XmCdnSDK.takaTokenUrl.substring(0, 8) + 'qa' + XmCdnSDK.takaTokenUrl.substring(8)
    }
  }

  fileDisplay = (bundleDirName) => {
    // 根据文件路径读取文件，返回文件列表
    fs.readdir(bundleDirName, (err, files) => this.readdirCallBack({ files, bundleDirName }))
  }

  readdirCallBack = async ({ files, bundleDirName }) => {
    await Promise.all(files.map(filename => {
      const suffix = this.getSuffix(filename)
      const isSupportFile = XmCdnSDK.supportFiles.includes(suffix)
      // 获取当前文件的绝对路径
      const filedir = path.join(bundleDirName, filename)
      // 根据文件路径获取文件信息，返回一个fs.Stats对象
      fs.stat(filedir, (eror, stats) => this.statCallBack({ stats, isSupportFile, filedir }))
    }))
  }

  statCallBack = ({ stats, isSupportFile, filedir }) => {
    const isFile = stats.isFile()// 是文件
    const isDir = stats.isDirectory()// 是文件夹


    if (isFile && isSupportFile) {
      const bizType = this.cdnDirName
      // 需要上传的文件类型
      this.getToken({
        filedir,
        bizType
      })
    }

    // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
    if (isDir) {
      this.fileDisplay(filedir)
    }
  }

  getToken = async ({ filedir, bizType }) => {
    await axios.post(XmCdnSDK.takaTokenUrl, {
      bizType
    })
      .then(res => {
        const response = res.data
        const customFilePath = `/${bizType}${filedir.replace(this.bundleDirName, '').replace(/\\/g, '/')}`
        this.uploadFile({
          filedir,
          action: `${response.data.uploadDomain}/v1/file`,
          token: response.data.token,
          customFilePath
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  uploadFile = async ({ filedir, action, token, customFilePath }) => {
    const data = {
      customFilePath,
      isFullWrite: 1,
    };
    const params = {
      url: action,
      formData: {
        ...data,
        file: fs.createReadStream(filedir),
      },
      headers: {
        token,
      },
    }
    request.post(params, (err, resp, body) => {
      if (err) {
        console.warn('上传失败');
        return;
      }
      const result = JSON.parse(body);
      console.log(`${chalk.green('上传成功')} 地址是：${result.data[0].publishUrl}`);
    });
  }

  getSuffix = (url) => {
    return url.substring(url.lastIndexOf('.'), url.length)
  }
}
XmCdnSDK.takaTokenUrl = 'https://api.xinmai100.com/xinmai-admin-order/taka-token'
XmCdnSDK.supportFiles = ['.js', '.png', '.jpg', '.css', '.xlsx']

module.exports = XmCdnSDK
