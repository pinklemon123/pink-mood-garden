# Pink Mood Garden

一个粉色系的小网页应用，集成心情日历、匿名小纸条与爱心点击特效，并具备 PWA 离线体验。

[线上示例](https://pink-mood-garden.vercel.app)（如能访问）

## 主要功能
- **心情日历**：点击日历中的日期即可选择今日心情并显示每日语录。
- **匿名小纸条**：在本地浏览器保存留言，支持导出/导入 JSON 文件。
- **点击爱心特效**：页面任意位置点击会飘出爱心或花瓣。
- **PWA 支持**：可离线访问并支持安装到主屏幕。

![心情图片示例](assets/img/mood1.png)

## 使用方式
1. 进入页面后，在“心情日历”中浏览或记录你的心情。
2. 在“匿名小纸条”输入框中写下想说的话，点击“放上墙”即可张贴在右侧。
3. 可通过“导出 JSON”或“导入 JSON”按钮备份或恢复你的纸条数据。

## 本地运行
由于 Service Worker 需要在 HTTP(S) 环境下工作，请使用本地静态服务器运行：

```bash
git clone <repository-url>
cd pink-mood-garden

# 方式一：使用 Node
npx serve .

# 方式二：使用 Python
python3 -m http.server 8080
```

然后在浏览器访问 `http://localhost:3000`（或 `http://localhost:8080`）。

## 部署
项目为纯静态页面，可部署到任意静态托管平台（如 GitHub Pages、Vercel 等）。以 Vercel 为例：

```bash
npm i -g vercel
vercel
```

部署后即可通过生成的域名访问。https://pink-mood-garden.vercel.app/