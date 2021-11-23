# 75_action

[![TEST](https://github.com/JohnieXu/75_action/actions/workflows/run.yml/badge.svg)](https://github.com/JohnieXu/75_action/actions/workflows/run.yml)

> 这是一个自动抓取奇舞周刊全部文章的脚本，支持使用 GitHub action 自动抓取

## 自动抓取

支持配置github action自动抓取数据，并保存抓取的数据到artifcat
## cli工具使用
### 随机返回一篇文章链接

```bash
npx 75_action random
```

### 随机返回n篇文章链接

```bash
npx 75_action random [n] // n为任意大于0的数（当总文章数小于n时返回全部文章链接）
```

### 手动刷新文章数据

```bash
npx 75_action fetch
```
