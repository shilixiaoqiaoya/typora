git reset --hard  保持本地分支和远程分支的一致性，本地未push到远端的代码会丢失





#### 合并代码规范

```text
合并分支流程
- 在lhq分支，拉取远端的feature分支，看有无冲突并解决
[拉取远端： git pull origin feature]
- 切到feature分支,先 git pull, merge下lhq分支，再git push
- 切到test分支，先git pull, merge下feature分支，再git push
```

- 合分支原则：先pull，再merge，再pull
- merge时简单冲突会被自动解决，进入vim窗口，敲i代表insert，按esc，输入:wq





#### 删除分支

- 删除本地分支：**git branch -d BranchName**
  - 当一个分支被推送并合并到远程分支后，-d才会本地删除该分支
  - 如果一个分支还没被推送或者合并，使用-D强制删除它
- 删除远程分支：**git push origin --delete BranchName**





#### 拉取分支

- git pull <远程主机名> <远程分支名>
- 将远程主机origin的master分支拉取过来，和当前分支合并：**git pull origin master**





#### 常见命令

- git restore . 放弃现有更改
- git switch <branch_name> 切换分支
- git switch -c <branch_name> 创建并切换分支
- git cherry-pick <commit_id>
- git checkout <commit_hash>















#### 配置全局用户名和邮箱

- git config --global [user.name](http://user.name/)  'your name'
- git config --global user.email  'your email'





#### 命令简写

- git branch ; gb ;查看本地分支
- git branch -d master ; gb -d master ；删除分支
- git checkout ； gco ； 切换分支
- git status；gst ；查看分支状态
- git add . ；gaa
- git commit -m 'fix: '日志' ； gcmsg '日志'
- git log --prettty=oneline ； glog' ； 显示提交历史的树形图

- git pull --rebase
- **git restore . 放弃现有更改**
- **git switch <branch> 切换分支**
- git cherry-pick <commit-id>

