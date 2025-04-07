const express = require('express');
const path = require('path');

const staticMiddleware = express.static(path.join(__dirname, '../../public'));

module.exports = staticMiddleware;