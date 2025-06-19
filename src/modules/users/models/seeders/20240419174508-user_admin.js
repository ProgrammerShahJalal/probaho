'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        let users = [];
        ['user1', 'user2', 'user3'].forEach(async (i) => {
            users.push({
                name: i,
                email: i + '@gmail.com',
                password:
                    '$2a$12$.aO5lxRR2qnICFEhMGaK8.aoAut89QnkhMn4hASjuvXfDA9StWAp6', // 12345678
                status: 1,
                created_at: '2024-02-01 11:45:01',
                updated_at: '2024-02-01 11:45:01',
            });
        });

        await queryInterface.bulkInsert('users', users, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', null, {});
    },
};
