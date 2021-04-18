import log4js from "common-log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import Express = require("express");
import bodyParser = require("body-parser");
export const app = Express();


app.use(bodyParser.json());
export function http_serv_start(http_ip: string, http_port: number) {
    logger.info("Http Service Running At:: %s:%s", http_ip, http_port);
    app.listen(http_port, http_ip, () => {
        app._router.stack.map((item: { route: { path: any; }; }) => {
            if (item.route) logger.info('path: %s', item.route.path);
        })
    });
}

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    req.body.client_ip = get_client_ip(req);
    logger.debug("[%s] %s => %s", req.method, req.path, JSON.stringify(req.body))
    next();
});


function get_client_ip(req: any): string {
    let ipAddress: string;
    const headers = req.headers;
    const forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
    forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = "";
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    if (ipAddress.indexOf("::ffff:") != -1) {
        ipAddress = ipAddress.substr(7);
    }
    return ipAddress;
}
