import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 1. 开始生产构建 (vinext build)...');
execSync('npm run build', { stdio: 'inherit' });

console.log('⚙️ 2. 校准 Cloudflare Workers 生产配置 (wrangler.json)...');
const wranglerPath = path.resolve('dist/server/wrangler.json');
if (!fs.existsSync(wranglerPath)) {
  throw new Error('未找到 dist/server/wrangler.json，构建可能失败');
}

const config = JSON.parse(fs.readFileSync(wranglerPath, 'utf8'));
config.name = 'ielts-diary';
config.topLevelName = 'ielts-diary';
config.r2_buckets = [];
config.d1_databases = [{
  binding: 'DB',
  database_name: 'ielts-diary-db',
  database_id: '31e14c59-f641-416f-843d-ce5d988d2f89'
}];

fs.writeFileSync(wranglerPath, JSON.stringify(config, null, 2), 'utf8');
console.log('✅ 配置已校准为 ielts-diary 与 D1 生产数据库');

console.log('☁️ 3. 部署上线至 Cloudflare Workers 全球边缘...');
execSync('npx -y wrangler deploy --config dist/server/wrangler.json', { stdio: 'inherit' });
console.log('🎉 部署完成！访问：https://ielts-diary.yaemra531.workers.dev');
