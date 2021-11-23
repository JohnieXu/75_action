const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')

const CACHE_FILE = './.75_action/.data.json'
const CACHE_TIME = 1000 * 1000 * 60 * 60 * 24; // 缓存24h

function writeFile(json) {
  const p = path.resolve(process.cwd(), './data.json')
  fs.writeFileSync(p, JSON.stringify(json, null, 2))
}

function writeFileToHome(json) {
  const homeDir = require('os').homedir()
  const p = path.resolve(homeDir, CACHE_FILE)
  return mkdirp(path.dirname(p)).then(() => {
    fs.writeFileSync(p, JSON.stringify(json, null, 2))
  })
}

function getHomeFileJson() {
  const homeDir = require('os').homedir()
  const p = path.resolve(homeDir, CACHE_FILE)
  const jsonStr = fs.readFileSync(p)
  let json
  try {
    json = JSON.parse(jsonStr)
  } catch(e) {
    console.error(e)
    json = []
  }
  return json
}

function isCacheOutDate() {
  const p = path.resolve(require('os').homedir(), CACHE_FILE)
  if (!fs.existsSync(p)) {
    return true
  }
  const stat = fs.statSync(p)
  const lastModified = stat.mtime
  const now = new Date()
  return now - lastModified >= CACHE_TIME
}

module.exports = {
  writeFile,
  writeFileToHome,
  getHomeFileJson,
  isCacheOutDate
}
