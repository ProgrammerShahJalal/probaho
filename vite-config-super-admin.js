import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs/promises';
import tsconfigPaths from 'vite-tsconfig-paths';

let resolve = path.resolve;
/**

npm i vite @vitejs/plugin-react @reduxjs/toolkit @types/react @types/react-dom react react-dom react-redux react-router-dom

*/
var management_path = `super_admin`;
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    resolve: {
        alias: {
            src: path.resolve(
                `./public/management/${management_path}/index.tsx`,
            ),
        },
    },
    publicDir: false,
    build: {
        outDir: `./public/management_build/${management_path}`,
        manifest: false,
        sourcemap: true,
        rollupOptions: {
            input: resolve(
                __dirname,
                `./public/management/${management_path}/index.tsx`,
            ),
            output: {
                entryFileNames: `${management_path}.js`,
            },
        },
    },
    esbuild: {
        loader: 'tsx',
        include: /public\/management\/super_admin\/.*\.tsx?$/,
        exclude: [],
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                {
                    name: 'load-js-files-as-jsx',
                    setup(build) {
                        build.onLoad(
                            {
                                filter: /public\/management\/super_admin\/.*\.js$/,
                            },
                            async (args) => ({
                                loader: 'tsx',
                                contents: await fs.readFile(args.path, 'utf8'),
                            }),
                        );
                    },
                },
            ],
        },
    },
    define: {
        // _global: ({}),
        // process: {
        //     env: {},
        // }
    },
});
