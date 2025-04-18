const fs = require('fs');

module.exports.readVersion = function (contents) {
  const match = contents.match(/number: ['"](\d+\.\d+\.\d+)['"]/);
  return match ? match[1] : null;
};

module.exports.writeVersion = function (contents, version) {
  return contents.replace(
    /number: ['"](\d+\.\d+\.\d+)['"],/,
    `number: '${version}',`
  );
};
