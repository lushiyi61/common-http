"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.http_serv_start = exports.app = void 0;
var common_log4js_1 = require("common-log4js");
var path_1 = require("path");
var logger = common_log4js_1.default.getLogger(path_1.basename(__filename));
///////////////////////////////////////////////////////
var Express = require("express");
var bodyParser = require("body-parser");
exports.app = Express();
exports.app.use(bodyParser.json());
function http_serv_start(http_ip, http_port) {
    logger.info("Http Service Running At:: %s:%s", http_ip, http_port);
    exports.app.listen(http_port, http_ip, function () {
        exports.app._router.stack.map(function (item) {
            if (item.route)
                logger.info('path: %s', item.route.path);
        });
    });
}
exports.http_serv_start = http_serv_start;
//设置跨域访问
exports.app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    req.body.client_ip = get_client_ip(req);
    logger.debug("[%s] %s => %s", req.method, req.path, JSON.stringify(req.body));
    next();
});
function get_client_ip(req) {
    var ipAddress;
    var headers = req.headers;
    var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
    forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = "";
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    if (ipAddress.indexOf("::ffff:") != -1) {
        ipAddress = ipAddress.substr(7);
    }
    return ipAddress;
}
