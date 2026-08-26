import SftpClient from 'ssh2-sftp-client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SFTP_CONFIG = {
  host: process.env.SFTP_HOST || '51.178.124.249',
  port: parseInt(process.env.SFTP_PORT || '22', 10),
  username: process.env.SFTP_USER || 'roostkit',
  password: process.env.SFTP_PASSWORD || 'F!VA9b;2l8i8Kb',
  readyTimeout: 15000,
};

const LOCAL_SERVER_DIR = path.resolve(__dirname, '..', 'server');
const REMOTE_TARGET_DIR = '/home/roostkit/public_html/fc.roostkit.site';

async function deploy() {
  const sftp = new SftpClient();

  console.log('🚀 Starting Haviji Sho backend SFTP deployment...');
  console.log(
    `📡 Connecting to ${SFTP_CONFIG.host}:${SFTP_CONFIG.port} as user '${SFTP_CONFIG.username}'...`
  );

  try {
    await sftp.connect(SFTP_CONFIG);
    console.log('✓ SFTP connection established!');

    // Ensure remote directory exists
    const dirExists = await sftp.exists(REMOTE_TARGET_DIR);
    if (!dirExists) {
      console.log(`Creating remote directory ${REMOTE_TARGET_DIR}...`);
      await sftp.mkdir(REMOTE_TARGET_DIR, true);
    }

    console.log(
      `📤 Uploading files from local [${LOCAL_SERVER_DIR}] to remote [${REMOTE_TARGET_DIR}]...`
    );

    // Upload server directory recursively
    const uploadResult = await sftp.uploadDir(
      LOCAL_SERVER_DIR,
      REMOTE_TARGET_DIR,
      {
        filter: (localPath) => {
          const basename = path.basename(localPath);
          // Exclude unwanted files
          if (
            basename.startsWith('.git') ||
            basename === 'node_modules' ||
            basename.endsWith('.DS_Store')
          ) {
            return false;
          }
          return true;
        },
      }
    );

    console.log(`✓ Uploaded ${uploadResult} items successfully!`);

    // Verify remote listing
    const remoteFiles = await sftp.list(REMOTE_TARGET_DIR);
    console.log('📂 Remote deployed files/folders:');
    remoteFiles.forEach((file) => {
      console.log(`  ${file.type === 'd' ? '📁' : '📄'} ${file.name}`);
    });

    console.log('\n🎉 Backend deployment completed successfully!');
    console.log('🌐 Live Service URL: https://fc.roostkit.site/');
  } catch (err) {
    console.error('❌ Deployment failed:', err);
    process.exit(1);
  } finally {
    await sftp.end();
  }
}

deploy();
