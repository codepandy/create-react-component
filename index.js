#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const download = require("download-git-repo"); // 下载模板文件
const chalk = require("chalk"); // 终端样字符串样式设置
const symbols = require("log-symbols"); //各种日志级别的彩色符号
const ejs = require("ejs"); //修改模版文件内容
const ora = require("ora"); //优雅的终端转轮，就是loading，提示进行中
const inquirer = require("inquirer"); //公共交互式命令行用户界面的集合。就是询问时输入
const shell = require("shelljs");
const isEnglish = /^[a-zA-Z]+\d*$/gi; //检查文件名是否是英文，只支持英文

const package = require("./package.json");

program
  .version(package.version, "-v --version", "查看当前版本")
  .command("init <name>")
  .action(name => {
    if (!isEnglish.test(name)) {
      console.log(symbols.error, chalk.red("名称只能有字母和数字组成！"));
      return;
    }
    if (!fs.existsSync(name)) {
      inquirer
        .prompt([
          {
            type: "input",
            name: "author",
            message: "请输入作者名称",
          },
          {
            name: "description",
            message: "请输入组件描述",
          },
          {
            name: "keywords",
            message: "请输入关键字,多个之间用英文逗号连接",
          },
          {
            name: "repository",
            message: "请输入你代码将要放置的仓库地址",
          },
          {
            type: "list",
            name: "cssPreprocessor",
            message: "请选择css预处理器",
            choices: ["less", "sass", "none"],
          },
        ])
        .then(ansers => {
          console.log(chalk.green("选项内容是："), ansers);
          console.log(symbols.success, chalk.green("开始创建...........，请稍后"));
          const spinner = ora(chalk.green("正在下载模板..."));
          spinner.start();

          download(
            `direct:https://github.com/codepandy/react-component-template.git`,
            name,
            { clone: true },
            err => {
              if (err) {
                spinner.fail(chalk.red("模板下载失败，请重新下执行！"));
                console.log(symbols.error, chalk.red(err));
                return;
              }
              spinner.succeed(chalk.green("模板下载成功！"));
              const { author, description, keywords, repository, cssPreprocessor } = ansers;
              const packageSpinner = ora(chalk.green("开始配置 package.json 文件..."));
              try {
                packageSpinner.start();
                const subRepository = repository
                  ? repository.substring(0, repository.indexOf("."))
                  : "";
                const packagePath = path.resolve(process.cwd(), name, "package.json");
                console.log(chalk.yellow(`package.json地址：${packagePath}`));
                const packageString = fs.readFileSync(packagePath, "utf8");
                let packageJson = JSON.parse(packageString);
                packageJson = {
                  ...packageJson,
                  author,
                  description,
                  keywords: keywords ? keywords.split(",") : [],
                  repository: {
                    type: `git`,
                    url: `git+${repository}`,
                  },
                  bugs: {
                    url: `${subRepository}/issues`,
                  },
                  homepage: `${subRepository}#readme`,
                };

                fs.writeFileSync(packagePath, JSON.stringify(packageJson));
                packageSpinner.succeed("package.json文件配置成功！");
              } catch (error) {
                console.log(symbols.error, error);
                packageSpinner.fail(chalk.red("文件配置失败！"));
              }

              const webpackSpinner = ora(chalk.green("开始配置 webpack ..."));
              try {
                webpackSpinner.start();
                const webpackTemplatePath = path.resolve(process.cwd(), name, "webpack.base.ejs");
                console.log(chalk.yellow(`webpack template 地址：${webpackTemplatePath}`));
                const webpackTemplate = fs.readFileSync(webpackTemplatePath, "utf8");
                const webpackString = ejs.render(webpackTemplate, { cssPreprocessor });
                const webpackFilePath = path.resolve(process.cwd(), name, "webpack.base.js");
                fs.writeFileSync(webpackFilePath, webpackString);
                webpackSpinner.succeed(chalk.green("webpack 文件配置成功！"));
                fs.unlinkSync(webpackTemplatePath); // 删除模板文件
              } catch (error) {
                webpackSpinner.fail(chalk.red("webpack 文件配置失败"));
                console.log(chalk.red(error));
              }

              //安装依赖
              const installDependenciesSpinner = ora(chalk.green(`安装依赖中...`));
              installDependenciesSpinner.start();
              shell.exec(
                `cd ${name}
              npm i`,
                error => {
                  if (error) {
                    installDependenciesSpinner.fail(chalk.red(`依赖安装失败：${error}`));
                  }
                  installDependenciesSpinner.succeed(
                    chalk.green("依赖安装完成，开始开发你的组件吧！"),
                  );
                },
              );
            },
          );
        });
    }
  });

program.parse(process.argv);
