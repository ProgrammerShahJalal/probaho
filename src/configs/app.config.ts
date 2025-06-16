import { env } from 'process';
import { anyObject } from '../common_types/object';
require('dotenv').config();

const protocol = env.SERVER_PROTOCOL || 'http';
const host = env.SERVER_HOST || '127.0.0.1';
const port = env.SERVER_PORT || 5000;
const server_url = `${protocol}://${host}:${port}`;

const DBhost = encodeURIComponent(process?.env.DB_HOST || '');
const DBport = encodeURIComponent(process?.env.DB_PORT || '');
const DBuser = encodeURIComponent(process?.env.DB_USER || '');
const DBpass = encodeURIComponent(process?.env.DB_PASSWORD || '');
const DBdatabase = encodeURIComponent(process?.env.DB_DATABASE || '');
const DB_string = `mysql://${DBuser}:${DBpass}@${DBhost}:${DBport}/${DBdatabase}`;

/** 
```js 
{
    port, 
    server_url,
    DB_string,
}
```
*/

export const app_config = {
    port,
    server_url,
    DB_string,
    project_path: "",
} as anyObject;

export function config(key: string) {
    return app_config[key];
}
