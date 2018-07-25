global.mocha = require("mocha");
global.chai = require("chai");
global.chaihttp = require("chai-http");
chai.use(chaihttp);
global.should = chai.should();
global.it = mocha.it;
global.describe = mocha.describe;

global.serverurl = "http://localhost:3501/api/v1.0";
global.token = "";