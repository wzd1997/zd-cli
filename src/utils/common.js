// 根据我们想要实现的功能配置执行动作，遍历产生对应的命令
const mapActions = {
  create: {
    alias: 'c', //别名
    description: '创建一个项目', // 描述
    examples: [ //用法
      'zd-cli create <project-name>'
    ]
  },
  config: { //配置文件
    alias: 'conf', //别名
    description: 'config project variable', // 描述
    examples: [ //用法
      'zd-cli config set <k> <v>',
      'zd-cli config get <k>'
    ]
  },
  '*': {
    alias: '', //别名
    description: 'command not found', // 描述
    examples: [] //用法
  }
}

const ora = require('ora')
const download = require('download-git-repo')

// 封装loading效果  需要等待的函数fn loading时的文字描述 messgae
const fnLoadingByOra = (fn, message) => async (...argv) => {
  const spinner = ora(message)
  spinner.start()
  let result = await fn(...argv)
  spinner.succeed() // 结束loading
  return result
}

const axios = require('axios')
// 1).获取仓库列表
const fetchReopLists = async () => {
  // 获取当前组织中的所有仓库信息,这个仓库中存放的都是项目模板
  // const { data } = await axios.get('https://api.github.com/orgs/lxy-cli/repos'); 
  const { data } = await axios.get('https://api.github.com/users/wzd1997/repos')
  return data
}

//  获取仓库(repo)的版本号信息
const getTagLists = async (repo) => {
  const { data } = await axios.get(`https://api.github.com/repos/wzd1997/${repo}/tags`)
  return data
}

// 下载仓库
const githubTemplate = (repo, version, projectName) => {
  return (message) => {
    return new Promise((resolve, reject) => {
      const spinner = ora(message)
      spinner.start()
      download(`wzd1997/${repo}#${version}`, projectName, (err) => {
        if (err) reject(err)
        spinner.succeed() // 结束loading
        resolve(true)
      })
    })
  }


}

module.exports = {
  mapActions,
  fetchReopLists,
  fnLoadingByOra,
  getTagLists,
  githubTemplate
}
