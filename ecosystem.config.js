require('dotenv').config();

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF = 'origin/master',
} = process.env;

module.exports = {
  apps: [{
    name: 'mesto-backend',
    script: './dist/app.js',
  }],

  // Настройка деплоя
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: 'https://github.com/nadyakarandasheva/nodejs-mesto-backend.git',
      path: DEPLOY_PATH,
      'pre-deploy-local': `scp .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/`,
      'post-deploy': 'export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && npm i && npm run build',
    },
  },
};
