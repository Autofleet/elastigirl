const Elastigirl = require('../index')

const sleep = (time) => new Promise((resolve, reject) => setTimeout(resolve, time))

const e1 = async () => {
  console.log('Example 1')
  const config1 = new Elastigirl({ source: 'https://jsonplaceholder.typicode.com/posts/1', cacheLocal: false })
  await sleep(1000)
  console.log(config1.get('userId', 'shoul not be printed'))
}

const e2 = async () => {
  console.log('Example 2')
  const config2 = new Elastigirl({ source: `${__dirname}/../package.json` })
  console.log(config2.get('name', 'placeholder2'))
  console.log(config2.get('scripts.test'))
}

const e3 = async () => {
  console.log('Example 3')
  const config3 = new Elastigirl({})
  console.log(config3.get('name', 'placeholder - string'))
  console.log(config3.get('scripts.test', 5))
}

const eAll = async () => {
  await e1()
  await e2()
  await e3()
}

eAll()