const Elstigirl = require('../index');
var nock = require('nock');

const sleep = (time) => new Promise((resolve, reject) => setTimeout(resolve, time))

nock('http://example.com')
  .get('/myjson.json')
  .times(2)
  .reply(200, {
    shouldBeTrue: true,
    shouldBeOne: 1,
  });

describe('Test elstigirl powers', () => {
  it('She can get a json from http', async () => {
    const elstigirl = new Elstigirl({ source: 'http://example.com/myjson.json' })
    await sleep(50)
    const shouldBeTrue = elstigirl.get('shouldBeTrue')
    expect(shouldBeTrue).toBeTruthy()
  })

  it('She can get json file', async () => {
    const elstigirl = new Elstigirl({ source: `${__dirname}/../package.json` })
    await sleep(50)
    const elastigirlName = elstigirl.get('name')
    expect(elastigirlName).toEqual('elastigirl')
  })

  it('Fails if no source if supplied in production', async () => {
    process.env.NODE_ENV = 'production'
    expect(() => new Elstigirl({})).toThrow()
    process.env.NODE_ENV = ''
  })

  it('Returns defualt value in case no source is supplid in dev', async () => {
    const elstigirl = new Elstigirl({})
    await sleep(50)
    const value = elstigirl.get('name', 'myValue')
    expect(value).toEqual('myValue')
  })

  it('Returns defualt value in case no source is supplid in dev', async () => {
    jest.useFakeTimers()
    const elstigirl = new Elstigirl({ source: 'http://example.com/myjson.json', intervalTime: 100 })

    expect(setInterval).toHaveBeenCalled()
  })


  it('No throw error if it has network error', async () => {
    jest.useFakeTimers()
    const elstigirl = new Elstigirl({ source: 'http://example.com/myjson2.json', intervalTime: 100 })

    expect(setInterval).toHaveBeenCalled()
  })
})