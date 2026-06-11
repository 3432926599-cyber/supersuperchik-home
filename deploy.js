const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const { resolve } = require('path');

// 读取 .env
const envPath = resolve(__dirname, '.env');
const env = {};
try {
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .forEach(line => {
      const [k, ...v] = line.split('=');
      env[k.trim()] = v.join('=').trim();
    });
} catch {
  console.error('❌ 缺少 .env 文件');
  process.exit(1);
}

// 从 Git 或目录名推断项目名
let project;
try {
  const remote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
  project = remote.split('/').pop().replace('.git', '');
} catch {
  project = resolve(__dirname).split(/[\\/]/).pop().toLowerCase().replace(/\s+/g, '-');
}

console.log(`🚀 部署项目: ${project}`);
console.log();

// 执行 wrangler deploy
const cmd = `npx wrangler pages deploy . --project-name=${project} --branch=main`;
try {
  execSync(cmd, {
    env: { ...process.env, ...env },
    stdio: 'inherit',
    cwd: __dirname,
  });
  console.log(`\n✅ 上线成功！https://${project}.pages.dev`);
} catch {
  // 项目不存在则创建
  console.log('📦 项目不存在，自动创建...');
  const create = `npx wrangler pages project create ${project} --production-branch=main`;
  execSync(create, { env: { ...process.env, ...env }, stdio: 'inherit', cwd: __dirname });
  execSync(cmd, { env: { ...process.env, ...env }, stdio: 'inherit', cwd: __dirname });
  console.log(`\n✅ 上线成功！https://${project}.pages.dev`);
}
