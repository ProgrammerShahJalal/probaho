#!/bin/bash

echo ""
echo "users seed start"
API_URL="http://127.0.0.1:5002/api/v1/users?orderByCol=id&orderByAsc=true&show_active_data=true&paginate=10&page=0"
response=$(curl -s "$API_URL")
npx sequelize-cli db:seed:all --config src/configs/db.json --seeders-path src/modules/auth_management/user_management/models/seeders
echo "users seed end"
echo ""

echo ""
echo "contact message seed start"
API_URL="http://127.0.0.1:5002/api/v1/contact-message?orderByCol=id&orderByAsc=true&show_active_data=true&paginate=10&page=0"
response=$(curl -s "$API_URL")
npx sequelize-cli db:seed:all --config src/configs/db.json --seeders-path src/modules/extra/contact_message/models/seeders
echo "contact message seed end"
echo ""

echo ""
echo "error-trace seed start"
API_URL="http://127.0.0.1:5002/api/v1/error-trace?orderByCol=id&orderByAsc=true&show_active_data=true&paginate=10&page=0"
response=$(curl -s "$API_URL")
# npx sequelize-cli db:seed:all --config src/configs/db.json --seeders-path src/modules/app_management/error_trace/models/seeders
echo "error-trace seed end"
echo ""

