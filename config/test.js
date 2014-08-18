var path = require('path');

module.exports = {
  port: 1337,
  root: path.join(__dirname, "../test/fixtures"),
  temp: path.join(__dirname, "../test/temp/cortex-build"),
  uid: 0,
  gid: 0
}