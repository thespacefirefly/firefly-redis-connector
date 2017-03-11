const monet = require('monet');

class RedisDb {
  constructor({url}) {
    this.url = url
    this.redisCli = null
  }

  on(eventName, doSomeThing) {
    this.redisCli.on(eventName, doSomeThing)
  }

  initialize(args) {
    return new Promise((resolve, reject) => {
      try {
        this.redisCli = require("redis").createClient({
          url: this.url
        });
        resolve(this)
      } catch (error) {
        reject(error)
      }
    })
  }

  set(key, value) {
    return new Promise((resolve, reject) => {
      try {
        this.redisCli.set(key, value)
        resolve(monet.Maybe.fromNull(value))
      } catch (error) {
        reject(error)
      }
    })
  }

  get(key) {
    return new Promise((resolve, reject) => {
      try {
        let result = this.redisCli.get(key) 
        resolve(monet.Maybe.fromNull(result))
      } catch (error) {
        reject(error)
      }
    })    
  }

  del(key) {
    return new Promise((resolve, reject) => {
      try {
        this.get(key).then(data => {
          this.redisCli.del(key)
          resolve(data)
        })
      } catch (error) {
        reject(error)
      }
    })      
  }

  keys(predicate) { //⚠️ predicate is a closure ⚠️ so for Redis, eg: predicate = `() => "*hi:*"`
    return new Promise((resolve, reject) => {
      try {
        let pattern = predicate()
        pattern !== undefined
        ? resolve(this.redisCli.keys(pattern))
        : resolve(this.redisCli.keys())
      } catch (error) {
        reject(error)
      }
    })      
  }
  
}

module.exports = RedisDb