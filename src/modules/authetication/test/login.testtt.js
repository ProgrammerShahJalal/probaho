const { expect, test } = require('@jest/globals');
const { app_config } = require('../../../../configs/app.config');

// test_method('auth/login', 'error 500', 500, {
//     email: 'user1@gmail.com',
//     password: '12345678',
// });

test_method('auth/login/submit', 'url not found', '404', {
    email: '',
    password: '',
});

test_method('auth/login', 'validation error', 422, {
    email: '',
    password: '',
});

test_method('auth/login', 'incorrecte email', 422, {
    email: 'sample@ex.com',
    password: '12345678',
});

test_method('auth/login', 'incorrecte password', 422, {
    email: 'user1@gmail.com',
    password: '232323',
});

test_method('auth/login', 'success', 201, {
    email: 'user1@gmail.com',
    password: '12345678',
});

function test_method(end_point, title, tobe, body) {
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
                expect(data.status).toBe(tobe);
            });
    });
}
