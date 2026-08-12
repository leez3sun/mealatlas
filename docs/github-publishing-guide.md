# 从本地项目到 GitHub 在线网站

## 三层概念

1. **本地项目**：`D:\ABAQUS实例模拟\mealatlas` 中的源代码、图片与文档。电脑关机不影响文件，但别人访问不到。
2. **GitHub 仓库**：推送到 `github.com/<用户名>/<仓库名>` 的在线代码副本与版本历史。它不是网站运行服务器。
3. **GitHub Pages**：GitHub Actions 构建代码后发布的静态网站，网址通常是 `https://<用户名>.github.io/<仓库名>/`。本机关闭后仍能访问。

本项目已经包含 `.github/workflows/deploy.yml`，因此推送后只需启用 Pages 的 GitHub Actions 来源。

## 首次上传

先在 GitHub 网页新建一个**空仓库**，例如 `mealatlas`。不要勾选自动创建 README、`.gitignore` 或 License，因为本地已有这些文件。

然后在本项目目录运行：

```powershell
git add .
git commit -m "Initial release: MealAtlas"
git remote add origin https://github.com/<你的用户名>/mealatlas.git
git push -u origin main
```

也可以使用 GitHub CLI 一步创建并推送：

```powershell
gh auth login
gh repo create mealatlas --public --source=. --remote=origin --push
```

推送和创建公开仓库属于外部写入操作；Codex 会在你明确要求上传后，先确认仓库名和公开/私有范围，再执行。

## 启用在线网站

打开 GitHub 仓库：

1. 进入 **Settings → Pages**；
2. 在 **Build and deployment → Source** 选择 **GitHub Actions**；
3. 打开 **Actions**，等待 `Deploy to GitHub Pages` 变绿；
4. 访问 `https://<你的用户名>.github.io/mealatlas/`。

## 后续更新

每次本地修改并验证后：

```powershell
git add .
git commit -m "描述这次修改"
git push
```

推送到 `main` 后，现有 workflow 会自动测试、构建和更新 Pages 网站。

## 当前项目状态

- 本地 Git 仓库：已建立；
- 第一次 commit：尚未创建；
- GitHub remote：尚未绑定；
- GitHub Pages：尚未部署；
- 当前 `127.0.0.1:4173`：仅限本机、依赖本地服务窗口。
