import { anyObject } from "../../../common_types/object";

const { expect, test } = require('@jest/globals');
const { app_config } = require('../../../configs/app.config');
let end_point = 'contact-messages/destroy';

// test_method(end_point, 'error 500', 500, {});

test_method(end_point + 's', 'destroy url not found', 404, {});

test_method(end_point, 'field validation check', 422, {});

test_method(end_point, 'data successfully deleted', 200, {
    id: 1,
});

test_method(end_point, 'data not found', 404, {
    id: 99999999999,
});

function test_method(end_point: string, title: string, tobe: number, body: anyObject) {
    if(!title) return;

    console.log(title + '/n');
    test(title, async () => {
        let url = `${app_config.server_url}/api/v1/${end_point}`;
        return await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/Json',
            },
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((data) => {
                expect(parseInt((data as anyObject).status)).toBe(tobe);
            });
    });
}
module.exports = test_method;
