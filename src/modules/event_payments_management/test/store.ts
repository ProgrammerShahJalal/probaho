import { anyObject } from "../../../common_types/object";

const { expect, test } = require('@jest/globals');
let server_url = 'http://localhost:5003';
let end_point = 'contact-messages/store';

// test_method(end_point, 'error 500', 500, {});

test_method(end_point + '/store-fraud', 'url not found', 404, {});

test_method(end_point, 'field validation check', 422, {});

test_method(end_point, 'data successfully created', 201, {
    full_name: 'user4',
    email: 'user4@gmail.com'
});

async function test_method(end_point: string, title: string, tobe: number, body: anyObject) {
    if (!title) return;
    console.log(title + '\n');
    test(title, async () => {
        let url = `${server_url}/api/v1/${end_point}`;
        return await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/Json',
            },
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((data) => {
                expect(parseInt((data as any).status)).toBe(tobe);
            });
    });
}
module.exports = test_method;
