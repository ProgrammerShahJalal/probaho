'use strict';

import { DoneFuncWithErrOrRes, FastifyPluginOptions } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';
import { env } from 'process';

const ftp = require('basic-ftp');
const fp = require('fastify-plugin');
const fs = require('node:fs');
const path = require('path');
let appDir = path.resolve(path.dirname(__dirname), '../');
appDir = path.resolve(appDir, 'public');

function ensureDirectoryExistence(filePath: String[] = []) {
    filePath.reduce((pre: string, i) => {
        pre += i;
        let folder = path.resolve(appDir, pre);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
        return i + '/';
    }, '');
}

async function uploadToFTP(filePath="") {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Optional, for logging
    try {
        // FTP server configuration
        await client.access({
            host: env.FTP_HOST,  // Replace with your FTP server host
            user: env.FTP_USER,        // Replace with your FTP username
            password: env.FTP_PASSWORD,    // Replace with your FTP password
            secure: false                // Set to true if using FTPS
        });

        const uploadDir = path.join('uploads');  // This is the part you want to strip
        const relativePath = filePath.split(uploadDir)[1]; // Get path after 'uploads'
        const ftpPath = relativePath.replace(/\\/g, '/');

        // Upload file
        const fileName = path.basename(filePath);
        const fileStream = fs.createReadStream(filePath);

        console.log(`Uploading ${fileName}...`);
        await client.uploadFrom(fileStream, `/app_files${ftpPath}`);  // Change the remote path as needed

        console.log('Upload successful');
    } catch (error) {
        console.error('Failed to upload file:', error);
    } finally {
        client.close();
    }
}

module.exports = fp(function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: () => void,
) {
    fastify.decorate(
        'upload',
        async function (
            file: { name: string; data: string },
            path_name: string = '',
        ): Promise<boolean> {
            try {
                if (!path_name) {
                    path_name =
                        'uploads/files/' +
                        parseInt((Math.random() * 100000).toString()) +
                        file.name;
                    ensureDirectoryExistence(['uploads', 'files']);
                } else {
                    let paths = path
                        .dirname(path.resolve(appDir, path_name))
                        .split(appDir)[1]
                        .split('\\');
                    paths.shift();
                    ensureDirectoryExistence(paths);
                }
                path_name = path_name.replace(/^\/|\/$/g, '') + '/';
                path_name = path.resolve(appDir, path_name);

                //upload into server path
                await fs.writeFileSync(path_name, file.data);

                //upload into ftp server
                // uploadToFTP(path_name);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
    );
    done();
});

declare module 'fastify' {
    export interface FastifyInstance {
        upload(
            file: { name: string; data: string },
            path_name: string,
        ): Promise<boolean>;
    }
}
