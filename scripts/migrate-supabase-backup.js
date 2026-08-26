const fs = require('fs');
const path = require('path');

// Tiers mapping as per SPEC-GAMIFICATION.md
function getTierLevel(coins) {
  if (coins >= 50) return 'havij_tala';
  if (coins >= 40) return 'havij_khah';
  if (coins >= 30) return 'havij_baz';
  if (coins >= 20) return 'havij_joo';
  if (coins >= 10) return 'havij_doost';
  return 'havij_neshan';
}

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
}

function runMigration() {
  const backupsDir = path.join(__dirname, '..', 'backups');
  const srcDataDir = path.join(__dirname, '..', 'src', 'data');

  if (!fs.existsSync(backupsDir)) {
    console.error('backups/ directory not found');
    process.exit(1);
  }

  const membersRaw = fs.readFileSync(path.join(backupsDir, 'members.json'), 'utf8');
  const memberStatsRaw = fs.readFileSync(path.join(backupsDir, 'member_stats.json'), 'utf8');
  const activityLogRaw = fs.readFileSync(path.join(backupsDir, 'activity_log.json'), 'utf8');
  const eventsRaw = fs.readFileSync(path.join(backupsDir, 'events.json'), 'utf8');

  const members = JSON.parse(membersRaw || '[]');
  const memberStats = JSON.parse(memberStatsRaw || '[]');
  const activityLogs = JSON.parse(activityLogRaw || '[]');
  const events = JSON.parse(eventsRaw || '[]');

  // Index stats by member UUID & telegram_id
  const statsByMemberId = {};
  const statsByTgId = {};
  memberStats.forEach(stat => {
    if (stat.id) statsByMemberId[stat.id] = stat;
    if (stat.telegram_id) statsByTgId[stat.telegram_id] = stat;
  });

  // Build mapped users
  const mappedUsers = [];
  const idMap = new Map(); // old UUID -> new auto-increment ID
  let currentUserId = 1;

  members.forEach(m => {
    const stat = statsByMemberId[m.id] || statsByTgId[m.telegram_id] || {};
    const coins = stat.points_total ?? 0;
    const tier = getTierLevel(coins);

    // Split display_name into first_name and last_name if available
    let firstName = m.display_name || m.username || `User_${m.telegram_id}`;
    let lastName = null;
    if (firstName.includes(' ')) {
      const parts = firstName.split(' ');
      firstName = parts[0];
      lastName = parts.slice(1).join(' ');
    }

    const userRecord = {
      id: currentUserId,
      old_uuid: m.id,
      telegram_id: m.telegram_id,
      username: m.username || null,
      first_name: firstName,
      last_name: lastName,
      email: null,
      job_title: m.expertise || null,
      bio: m.bio || null,
      avatar_url: m.photo_url || null,
      coins_balance: coins,
      tier_level: tier,
      is_public: m.is_public !== false ? 1 : 0,
      is_restricted: 0,
      rules_accepted_at: m.charter_accepted_at || m.created_at || null,
      created_at: m.created_at || new Date().toISOString(),
      updated_at: m.updated_at || new Date().toISOString(),
    };

    idMap.set(m.id, currentUserId);
    mappedUsers.push(userRecord);
    currentUserId++;
  });

  // Build mapped activities
  const mappedActivities = [];
  let activityId = 1;
  activityLogs.forEach(act => {
    const userId = idMap.get(act.member_id) || idMap.get(act.created_by);
    if (!userId) return;

    let actionType = 'COMMUNITY_ACTION';
    if (act.activity_type === 'quality_message') actionType = 'USEFUL_REPLY';
    else if (act.activity_type === 'profile_complete') actionType = 'ONBOARDING_COMPLETED';
    else if (act.activity_type === 'event_register') actionType = 'MEET_ATTENDANCE';

    mappedActivities.push({
      id: activityId++,
      user_id: userId,
      admin_telegram_id: act.meta?.awarded_by_telegram_id || null,
      action_type: actionType,
      coins_amount: act.points || 0,
      meta_reference: act.meta?.telegram_message_id ? `tg_msg_${act.meta.telegram_message_id}` : (act.meta?.event_id ? `event_${act.meta.event_id}` : null),
      description: JSON.stringify(act.meta || {}),
      created_at: act.created_at || new Date().toISOString()
    });
  });

  // Generate SQL output
  let sql = `-- Haviji Sho Database Seed Script
-- Generated from Supabase Backup on ${new Date().toISOString()}
-- Target Database: roostkit_frontchapter (MySQL 8.0+)

USE \`roostkit_frontchapter\`;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE \`activity_logs\`;
TRUNCATE TABLE \`attendances\`;
TRUNCATE TABLE \`events\`;
TRUNCATE TABLE \`users\`;
SET FOREIGN_KEY_CHECKS = 1;

-- Seed Users
`;

  mappedUsers.forEach(u => {
    sql += `INSERT INTO \`users\` (\`id\`, \`telegram_id\`, \`username\`, \`first_name\`, \`last_name\`, \`email\`, \`job_title\`, \`bio\`, \`avatar_url\`, \`coins_balance\`, \`tier_level\`, \`is_public\`, \`is_restricted\`, \`rules_accepted_at\`, \`created_at\`, \`updated_at\`)
VALUES (${u.id}, ${u.telegram_id}, ${escapeSql(u.username)}, ${escapeSql(u.first_name)}, ${escapeSql(u.last_name)}, ${escapeSql(u.email)}, ${escapeSql(u.job_title)}, ${escapeSql(u.bio)}, ${escapeSql(u.avatar_url)}, ${u.coins_balance}, ${escapeSql(u.tier_level)}, ${u.is_public}, ${u.is_restricted}, ${escapeSql(u.rules_accepted_at)}, ${escapeSql(u.created_at)}, ${escapeSql(u.updated_at)})
ON DUPLICATE KEY UPDATE \`coins_balance\` = VALUES(\`coins_balance\`), \`tier_level\` = VALUES(\`tier_level\`);
`;
  });

  if (mappedActivities.length > 0) {
    sql += `\n-- Seed Activity Logs\n`;
    mappedActivities.forEach(a => {
      sql += `INSERT INTO \`activity_logs\` (\`id\`, \`user_id\`, \`admin_telegram_id\`, \`action_type\`, \`coins_amount\`, \`meta_reference\`, \`description\`, \`created_at\`)
VALUES (${a.id}, ${a.user_id}, ${a.admin_telegram_id || 'NULL'}, ${escapeSql(a.action_type)}, ${a.coins_amount}, ${escapeSql(a.meta_reference)}, ${escapeSql(a.description)}, ${escapeSql(a.created_at)});\n`;
    });
  }

  // Write SQL file
  const sqlPath = path.join(backupsDir, 'seed_havij_database.sql');
  fs.writeFileSync(sqlPath, sql, 'utf8');
  console.log(`✓ Generated SQL seed file: ${sqlPath}`);

  // Write Frontend Seed Data (JSON) for static resilience
  const frontendMembersPath = path.join(srcDataDir, 'seed_members.json');
  fs.writeFileSync(frontendMembersPath, JSON.stringify(mappedUsers, null, 2), 'utf8');
  console.log(`✓ Generated Frontend Seed JSON: ${frontendMembersPath}`);
  console.log(`✓ Total migrated members: ${mappedUsers.length}, activity records: ${mappedActivities.length}`);
}

runMigration();
