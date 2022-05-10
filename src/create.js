/**
 * @fnLoadingByOra ora加载封装
 * @fetchReopLists 获取github仓库模板
 * @getTagLists 获取github仓库模板 获取模板tag
 * @githubTemplate 下载github仓库 的代码
 */
const inquirer = require('inquirer');
const {
  fnLoadingByOra, fetchReopLists, getTagLists, githubTemplate,
} = require('./utils/common');

const chooseHub = async () => {
  let repos = await fnLoadingByOra(fetchReopLists, '正在链接你的仓库...')();
  repos = repos.map((item) => item.name);
  // 使用inquirer 在命令行中可以交互
  const { repo } = await inquirer.prompt([
    {
      type: 'list',
      name: 'repo',
      message: '请选择一个你要创建的项目',
      choices: repos,
    },
  ]);
  let tags = await fnLoadingByOra(getTagLists, `正在链接你的选择的仓库${repo}的版本号...`)(repo);
  tags = tags.map((item) => item.name);
  console.log(`我现在选择了那个仓库？ ${repo}`);
  console.log(`仓库 ${repo}的版本信息列表：${tags}`);
  console.log(JSON.stringify(tags));

  if (tags.length === 0) {
    console.log(`${repo}仓库暂无版本号，请重新选择`);
    chooseHub();
    return;
  }
  const { tag } = await inquirer.prompt([
    {
      type: 'list',
      name: 'tag',
      message: '请选择一个你要创建的项目模板',
      choices: tags,
    },
  ]);
  console.log(`我现在选择了那个仓库？ ${repo}`);
  console.log(`仓库 ${repo}的版本信息列表： ${tag}`);

  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: '请输入项目名称: ',
      validate(v) {
        const done = this.async();
        if (!v.trim()) {
          done('项目名称不能为空~');
        }
        done(null, true);
      },
    },
  ]);

  console.log(projectName);

  githubTemplate(repo, tag, projectName)(`正在download仓库${repo}的代码...`).then((res) => {
    if (res) {
      console.log('下载完成');
    } else {
      console.log(res, ': 下载失败');
    }
  });
};

module.exports = chooseHub;
