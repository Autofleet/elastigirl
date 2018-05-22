const os = require('os')
const axios = require('axios')
const adapter = require('axios/lib/adapters/http')
const fs = require('fs-extra')
const _ = require('lodash')
const debug = require('debug')('elastigirl')

class Elastigirl {
  constructor(options) {
    this.options = Object.assign({}, Elastigirl.defaultOptions, options)

    if (this.options.source) {
      this.hasValidSource = true
      this.httpLoad = this.options.source.substring(0, 4).toLowerCase() === 'http'
      if (this.options.cacheLocal) {
        this.loadConfigFromTemp()
      }
      this.loadConfigs()

      setInterval(() => this.loadConfigs(), this.options.intervalTime)
    } else if (process.env.NODE_ENV === 'production') {
      throw new Error('Cant run withot source in production mode')
    } else {
      console.warn('Runing without source - values will be loaded from placeholders')
    }
  }

  async loadConfigs(mustLoad = false) {
    if (this.httpLoad) {
      return this.loadConfigFromRemote()
    } else {
      return this.loadConfigFromFile()
    }
  }

  async loadConfigFromRemote() {
    try {
      const response = await axios.get(this.options.source, { adapter })
      debug('Loaded from http', response.data)
      this.saveData(response.data)
      return response.data
    } catch(error) {
      console.warn('Network error while loading', error)
      return false
    }
  }

  async loadConfigFromFile() {
    try {
      const data = await fs.readJson(this.options.source)
      this.saveData(data)
      debug('Loaded from file', data)
      return data
    } catch (error) {
      console.warn('Error while loading file', error)
    }
  }

  async loadConfigFromTemp() {
    try {
      this.tempData = await fs.readJson(this.tempFileName())
      debug('Loaded from temp', this.tempData, this.tempFileName())
    } catch (error) {
      debug('No temp file')
    }
  }

  saveData(data) {
    this.data = data

    if (this.options.cacheLocal) {
      fs.writeJson(this.tempFileName(), this.data)
    }
  }

  tempFileName() {
    const fileName = this.options.source.replace(/[\/,:,.]/g, '_')
    return `${os.tmpdir()}/${fileName}.json`
  }

  get(key, defaultValue) {
    return _.get(this.data || this.tempData || {}, key, defaultValue)
  }
}

Elastigirl.defaultOptions = {
  source: null,
  intervalTime: 60000,
  cacheLocal: true,
}

module.exports = Elastigirl