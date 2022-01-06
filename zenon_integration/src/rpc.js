const config = require('./config');
import { RequestManager, HTTPTransport, Client } from "@open-rpc/client-js";

const transport = new HTTPTransport('http://' + config.nodeIp + ':' + config.httpPort);
const requestManager = new RequestManager([transport]);
const client = new Client(requestManager);
 
export const sendRpcRequest = async (method, params) => {
    var result = await client.request({method: method, params: params});
    return result;
};