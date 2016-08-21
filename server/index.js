
import fs from 'fs';
import https from 'https';
import express from 'express';
import CryptoJS from "crypto-js";
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compress from 'compression';
import packageJson from './../package.json';
import {getUser} from './user';
import cookieSession from 'cookie-session';
import Main from './main';

import config from './config';
const http = express();
const port = process.env.PORT || config.web_port || packageJson.defaultWebPort;

http.use(compress());
//http.use('/', express.static(__dirname + '/../client'));
//http.set('views', __dirname + '/../client');
http.set('view engine', 'ejs');

http.use(bodyParser.urlencoded());
http.use(bodyParser.json());
http.use(cookieParser());
http.set('trust proxy', 1) // trust first proxy

http.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

new Main(http);

function isDesktop(req) {
	return req.headers.host.indexOf('localhost') !== -1;
}

http.get('/monitor/l7check', (req, res) => {
	res.send(200);
});

http.listen(port);

module.exports = {
  http: http
};
