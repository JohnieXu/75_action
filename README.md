# 75_action

[![TEST](https://github.com/JohnieXu/75_action/actions/workflows/run.yml/badge.svg)](https://github.com/JohnieXu/75_action/actions/workflows/run.yml)
[![FETCH](https://github.com/JohnieXu/75_action/actions/workflows/fetch.yml/badge.svg)](https://github.com/JohnieXu/75_action/actions/workflows/fetch.yml)

> 这是一个自动抓取奇舞周刊全部文章的脚本，支持 GitHub Action 自动抓取和CLI工具使用

自动抓取为每天0/8/16点执行，抓取完成后生成的文章数据存到了 Action 的 artifact 中，下载得到`artifact.zip`解压后的`data.json`就是抓取的数据

## CLI使用

> 抓取到的数据本地缓存在home目录`.75_action/.data.json`中，缓存有效期24h

1.随机返回一篇文章链接

```bash
npx 75_action random
```

2.随机返回n篇文章链接

```bash
npx 75_action random n // n为任意大于0的数（当总文章数小于n时返回全部文章链接）
```

3.手动更新文章数据

> 强制不走本地缓存，抓取数据成功后会写入本地缓存

```bash
npx 75_action fetch
```
