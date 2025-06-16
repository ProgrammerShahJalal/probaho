import { anyObject } from "../../../common_types/object";

const { expect, test } = require('@jest/globals');
let server_url = 'http://localhost:5003';
let end_point = 'contact-messages';

// test_method(end_point, 'error 500', 500, {});

test_method(end_point + 'ss', 'url not found', 404, {});

test_method(end_point, 'validation check', 422, {});

test_method(end_point, 'data successfully fetched', 200, {
    orderByCol: 'id',
    orderByAsc: 'true',
    show_active_data: 'true',
    paginate: '10',
});

function test_method(end_point: string, title: string, tobe: number, body: anyObject) {
    if(!title) return;

    console.log(title + '\n');
    test(title, async () => {
        let url = `${server_url}/api/v1/${end_point}`;
        url += '?' + new URLSearchParams(body);

        return await fetch(url)
            .then((res) => res.json())
            .then((data) => {
                let expect_code = parseInt((data as any).status) || 404;
                expect(expect_code).toBe(tobe);
            });
    });
}
module.exports = test_method;
