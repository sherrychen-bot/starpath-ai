# StarPath AI · by StarWise

AI驱动的美本升学画像工具。

## 部署步骤（约10分钟）

### 1. 上传到 GitHub
- 打开 github.com → New repository
- 名字填 `starpath-ai`，选 Private（推荐）
- 把这个文件夹里的所有文件上传

### 2. 部署到 Vercel
- 打开 vercel.com，用 GitHub 账号登录
- 点 "Add New Project" → 选 `starpath-ai` 仓库
- Framework 选 **Vite**（会自动识别）
- 点开 **Environment Variables**，添加：
  ```
  Name:  VITE_ANTHROPIC_API_KEY
  Value: sk-ant-xxxxxxxx（你的 Anthropic API Key）
  ```
- 点 Deploy

### 3. 完成
- Vercel 自动构建，约1分钟
- 得到链接：`starpath-ai.vercel.app`
- 可以在 Vercel 设置里绑定自定义域名，如 `app.starwise-edu.com`

## 获取 Anthropic API Key
- 打开 console.anthropic.com
- Settings → API Keys → Create Key
- 复制 `sk-ant-` 开头的字符串

## 本地开发
```bash
npm install
cp .env.example .env
# 在 .env 里填入你的 API Key
npm run dev
```
