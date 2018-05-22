# Elastigirl

![alt text](./image/superhero.jpg "Super hero")


A superhero module to get configuration from a remote JSON file, and update it without restart!

Usage:
```javascript
new Elastigirl({<OPTIONS>})
```

Options:


| name         | Description                                                                        |   type  | default value |
|--------------|------------------------------------------------------------------------------------|:-------:|--------------:|
| source       | where the file is located either a local file or url                               |  string |          null |
| intervalTime | Interval time between reloading                                                    | integer |         60000 |
| cacheLocal   | If ture the module will save the last json to temp folder and will load it on init | boolean |         false |

## Examples:

Use it with URL:
```javascript
const config1 = new Elastigirl({ source: 'https://jsonplaceholder.typicode.com/posts/1'})
  // It might take some time to finish the HTTP reuqest until them we will use default values
  setTimeout(() => {
    console.log(config1.get('userId', 'shoul not be printed'))
  }, 1000)

```

You can use it also with files:
```javascript
const config1 = new Elastigirl({ source: './package.json'})
  // It might take some time to read file until them we will use default values
  setTimeout(() => {
    console.log(config1.get('name', 'Node app'))
  }, 1000)

```

or just relay on defualt values from development:

** If you will use the package this way in production it will throw an exception
```javascript
const config1 = new Elastigirl({ })
  setTimeout(() => {
    console.log(config1.get('name', 'Node app'))
  }, 1000)

```

