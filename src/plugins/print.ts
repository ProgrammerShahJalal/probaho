'use strict';
import fp from 'fastify-plugin';
import {
    DoneFuncWithErrOrRes,
    FastifyInstance,
    FastifyPluginOptions,
} from 'fastify';

declare module 'fastify' {
    export interface FastifyInstance {
        /** 
         ``` js
            print(343);
            print([])
            print({},[],232,"asdf")
        ```
         */
        print(param: any): void;
    }
}

module.exports = fp(function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: () => void,
) {
    fastify.decorate('print', function (): void {
        console.log('\x1b[32m', '------------------', '\x1b[37m', '\n');

        var args = [...arguments];
        args.forEach((i) => {
            console.log('');
            console.log(i);
            console.log('');
        });

        console.log('\n', '\x1b[32m', '---------------', '\x1b[37m');
    });
    done();
});
