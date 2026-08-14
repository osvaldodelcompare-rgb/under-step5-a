const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const examplePath = path.join(__dirname, '..', '.env.example');
const exampleTxtPath = path.join(__dirname, '..', 'env.example.txt');

if (fs.existsSync(envPath)) {
  process.exit(0);
}

if (fs.existsSync(examplePath)) {
  fs.copyFileSync(examplePath, envPath);
  console.log('[ensure-env] .env created from .env.example');
  process.exit(0);
}

if (fs.existsSync(exampleTxtPath)) {
  fs.copyFileSync(exampleTxtPath, envPath);
  console.log('[ensure-env] .env created from env.example.txt');
  process.exit(0);
}

// Last resort: neither example file survived the upload (e.g. dotfiles
// stripped when dragging a folder into github.com). Write safe local
// defaults directly so the app still boots against docker-compose services.
const fallback = `NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

JWT_SECRET=super_secret_dev_key_change_me
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=super_secret_refresh_dev_key_change_me
JWT_REFRESH_EXPIRES_IN=30d

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres_dev_password
DB_DATABASE=underground_db
DB_SYNCHRONIZE=true
DB_LOGGING=true

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadminpassword
MINIO_BUCKET_NAME=underground-media

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

FCM_PROJECT_ID=
FCM_CLIENT_EMAIL=
FCM_PRIVATE_KEY=
`;

fs.writeFileSync(envPath, fallback);
console.log('[ensure-env] .env.example was missing — generated .env with local defaults');
