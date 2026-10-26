import { User, Office, Team, CompanyValue, Kudos, ComposerEvent, SlackMessage } from '../types';

export const INITIAL_OFFICES: Office[] = [
  { id: 'off-a', name: 'Office A (HCMC)', code: 'SGN', timezone: 'Asia/Ho_Chi_Minh' },
  { id: 'off-b', name: 'Office B (Da Nang)', code: 'DAD', timezone: 'Asia/Ho_Chi_Minh' },
  { id: 'off-c', name: 'Office C (Hanoi)', code: 'HAN', timezone: 'Asia/Ho_Chi_Minh' },
];

export const INITIAL_TEAMS: Team[] = [
  { id: 'team-fintech', name: 'Fintech Core', slack_channel_id: 'c-engineering', slack_channel_name: '#team-engineering' },
  { id: 'team-design', name: 'Design System & UX', slack_channel_id: 'c-design', slack_channel_name: '#team-design' },
  { id: 'team-mobile', name: 'Mobile Pod', slack_channel_id: 'c-engineering', slack_channel_name: '#team-engineering' },
  { id: 'team-cloud', name: 'Cloud & DevOps', slack_channel_id: 'c-engineering', slack_channel_name: '#team-engineering' },
  { id: 'team-ai', name: 'AI & Data Solutions', slack_channel_id: 'c-engineering', slack_channel_name: '#team-engineering' },
  { id: 'team-qa', name: 'QA & Automation', slack_channel_id: 'c-engineering', slack_channel_name: '#team-engineering' },
  { id: 'team-talent', name: 'Talent & Culture', slack_channel_id: 'c-general', slack_channel_name: '#general' },
  { id: 'team-client', name: 'Client Engagement', slack_channel_id: 'c-general', slack_channel_name: '#general' },
];

export const INITIAL_VALUES: CompanyValue[] = [
  { id: 'val-own-it', name: 'Own it', description: 'Taking extreme ownership, stepping up, and seeing commitments through to the end.', icon: '🔥', active: true },
  { id: 'val-client-first', name: 'Client first', description: 'Empathizing deeply with client outcomes and delighting our delivery partners.', icon: '🤝', active: true },
  { id: 'val-better-together', name: 'Better together', description: 'Generous collaboration, mentoring peers, and proactively breaking office silos.', icon: '✨', active: true },
  { id: 'val-keep-learning', name: 'Keep learning', description: 'Curiosity, sharing insights, experimenting boldly, and continuous growth.', icon: '🌱', active: true },
];

// Generate 120 realistic users
const FIRST_NAMES_VN = ['Linh', 'Minh', 'Huy', 'An', 'Trang', 'Bao', 'Cuong', 'Dung', 'Giang', 'Hoa', 'Khoa', 'Lam', 'Mai', 'Nam', 'Phuc', 'Quynh', 'Son', 'Thao', 'Tien', 'Uyen', 'Vinh', 'Xuan', 'Yen', 'Duc', 'Long', 'Khanh', 'Tam', 'Nhi', 'Hanh', 'Thanh', 'Tu', 'Tuan', 'Phong', 'Ha', 'Diep', 'Kien', 'Viet', 'Dat', 'Binh', 'Ngoc', 'Hung', 'Thang', 'Vy', 'Chau', 'Tri'];
const LAST_NAMES_VN = ['Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Phan', 'Vu', 'Vo', 'Dang', 'Bui', 'Do', 'Ho', 'Ngo', 'Duong', 'Dinh'];
const FIRST_NAMES_EN = ['Alex', 'Chris', 'David', 'Emma', 'Grace', 'James', 'Michael', 'Oliver', 'Rachel', 'Sarah', 'Thomas', 'Victoria'];
const LAST_NAMES_EN = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Jenkins'];

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
];

export function generateSeedUsers(): User[] {
  const users: User[] = [];

  // Key demo personas
  users.push({
    id: 'usr-linh',
    name: 'Linh Nguyen',
    email: 'linh.nguyen@codelink.io',
    avatar: AVATARS[0],
    office_id: 'off-a', // HCMC
    team_id: 'team-fintech',
    manager_id: 'usr-huy',
    role: 'employee',
    active: true,
    job_title: 'Senior Frontend Developer',
  });

  users.push({
    id: 'usr-minh',
    name: 'Minh Tran',
    email: 'minh.tran@codelink.io',
    avatar: AVATARS[2],
    office_id: 'off-a', // HCMC
    team_id: 'team-fintech',
    manager_id: 'usr-huy',
    role: 'employee',
    active: true,
    job_title: 'Backend Engineer',
  });

  users.push({
    id: 'usr-huy',
    name: 'Huy Dang',
    email: 'huy.dang@codelink.io',
    avatar: AVATARS[7],
    office_id: 'off-a', // HCMC
    team_id: 'team-fintech',
    manager_id: 'usr-alex',
    role: 'manager',
    active: true,
    job_title: 'Engineering Manager (Fintech)',
  });

  users.push({
    id: 'usr-an',
    name: 'An Vo',
    email: 'an.vo@codelink.io',
    avatar: AVATARS[3],
    office_id: 'off-b', // Da Nang
    team_id: 'team-design',
    manager_id: 'usr-trang',
    role: 'employee',
    active: true,
    job_title: 'Product Designer',
  });

  users.push({
    id: 'usr-trang',
    name: 'Trang Pham',
    email: 'trang.pham@codelink.io',
    avatar: AVATARS[4],
    office_id: 'off-b', // Da Nang
    team_id: 'team-design',
    manager_id: 'usr-alex',
    role: 'manager',
    active: true,
    job_title: 'Head of Product Design',
  });

  users.push({
    id: 'usr-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@codelink.io',
    avatar: AVATARS[9],
    office_id: 'off-a', // HCMC
    team_id: 'team-talent',
    manager_id: 'usr-alex',
    role: 'admin',
    active: true,
    job_title: 'Head of People & Culture',
  });

  users.push({
    id: 'usr-tina',
    name: 'Tina Le',
    email: 'tina.le@codelink.io',
    avatar: AVATARS[8],
    office_id: 'off-c', // Hanoi
    team_id: 'team-talent',
    manager_id: 'usr-sarah',
    role: 'admin',
    active: true,
    job_title: 'Talent Operations Specialist',
  });

  users.push({
    id: 'usr-alex',
    name: 'Alex Miller',
    email: 'alex.miller@codelink.io',
    avatar: AVATARS[5],
    office_id: 'off-a',
    team_id: 'team-client',
    role: 'manager',
    active: true,
    job_title: 'Managing Director / CEO',
  });

  // Department managers
  const managers = [
    { id: 'usr-mgr-mobile', name: 'Bao Phan', team: 'team-mobile', office: 'off-a', title: 'Mobile Squad Lead' },
    { id: 'usr-mgr-cloud', name: 'David Brown', team: 'team-cloud', office: 'off-c', title: 'DevOps & SRE Lead' },
    { id: 'usr-mgr-ai', name: 'Hoa Tran', team: 'team-ai', office: 'off-a', title: 'AI Engineering Lead' },
    { id: 'usr-mgr-qa', name: 'Khoa Do', team: 'team-qa', office: 'off-b', title: 'QA Practice Lead' },
    { id: 'usr-mgr-client', name: 'Emma Davis', team: 'team-client', office: 'off-c', title: 'Client Partner' },
  ];

  managers.forEach((m, idx) => {
    users.push({
      id: m.id,
      name: m.name,
      email: `${m.name.toLowerCase().replace(' ', '.')}@codelink.io`,
      avatar: AVATARS[(idx + 6) % AVATARS.length],
      office_id: m.office,
      team_id: m.team,
      manager_id: 'usr-alex',
      role: 'manager',
      active: true,
      job_title: m.title,
    });
  });

  // Generate remaining up to exactly 120 users
  const totalNeeded = 120;
  let currentCount = users.length;
  const offices = ['off-a', 'off-b', 'off-c'];
  const teams = [
    'team-fintech', 'team-design', 'team-mobile', 'team-cloud',
    'team-ai', 'team-qa', 'team-talent', 'team-client'
  ];

  const managerMap: Record<string, string> = {
    'team-fintech': 'usr-huy',
    'team-design': 'usr-trang',
    'team-mobile': 'usr-mgr-mobile',
    'team-cloud': 'usr-mgr-cloud',
    'team-ai': 'usr-mgr-ai',
    'team-qa': 'usr-mgr-qa',
    'team-talent': 'usr-sarah',
    'team-client': 'usr-mgr-client',
  };

  const titles = [
    'Full-stack Engineer', 'Frontend Developer', 'Backend Developer',
    'Mobile Engineer', 'Cloud Architect', 'QA Analyst', 'Automation Tester',
    'UI/UX Designer', 'Data Engineer', 'Scrum Master', 'Technical Writer',
    'DevOps Specialist', 'Client Support Lead'
  ];

  for (let i = currentCount; i < totalNeeded; i++) {
    const isVn = i % 5 !== 0;
    const firstName = isVn
      ? FIRST_NAMES_VN[i % FIRST_NAMES_VN.length]
      : FIRST_NAMES_EN[i % FIRST_NAMES_EN.length];
    const lastName = isVn
      ? LAST_NAMES_VN[(i * 3) % LAST_NAMES_VN.length]
      : LAST_NAMES_EN[(i * 2) % LAST_NAMES_EN.length];
    const name = `${firstName} ${lastName}`;
    const office_id = offices[i % offices.length];
    const team_id = teams[(i * 2) % teams.length];
    const avatar = AVATARS[i % AVATARS.length];
    const job_title = titles[i % titles.length];

    users.push({
      id: `usr-gen-${i}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@codelink.io`,
      avatar,
      office_id,
      team_id,
      manager_id: managerMap[team_id] || 'usr-huy',
      role: 'employee',
      active: true,
      job_title,
    });
  }

  return users;
}

// Generate realistic Kudos messages (~400 kudos over the last 90 days)
const SAMPLE_MESSAGES = [
  {
    msg: "Huge props for jumping on the late-night staging deployment blocker right before client demo day. You stayed until midnight to ensure our release passed all regression tests without a hiccup!",
    val: 'val-own-it'
  },
  {
    msg: "Thank you for redesigning the onboarding flow on such short notice! The client stakeholders were blown away during the sprint review by the interactive prototype.",
    val: 'val-client-first'
  },
  {
    msg: "Exceptional patience mentoring our new junior developers on the async event consumer architecture. The entire squad leveled up their TypeScript and debugging skills thanks to your pairing sessions.",
    val: 'val-better-together'
  },
  {
    msg: "Thanks for stepping in to handle the critical client escalation while our lead was out sick. That demonstrated pure ownership, calm communication, and true leadership under pressure.",
    val: 'val-own-it'
  },
  {
    msg: "Incredible presentation at the engineering brown-bag lunch on Next.js Server Actions and caching nuances. You inspired three different project squads to modernize their client build pipelines!",
    val: 'val-keep-learning'
  },
  {
    msg: "Huge shoutout for catching that nasty concurrency race condition during QA regression before it hit production. You saved our enterprise client from potential data synchronization errors.",
    val: 'val-own-it'
  },
  {
    msg: "Fantastic cross-office collaboration between HCMC and Da Nang squads to deliver the unified design token system ahead of deadline. Seamless synergy and proactive async updates throughout!",
    val: 'val-better-together'
  },
  {
    msg: "Thank you for staying on after-hours to help us migrate the Postgres staging cluster with zero downtime. Your detailed runbook kept everyone calm and aligned during the entire maintenance window.",
    val: 'val-client-first'
  },
  {
    msg: "Appreciate the deep-dive code review and thoughtful architectural feedback on the GraphQL schema. It prevented technical debt and made our API contract much cleaner.",
    val: 'val-keep-learning'
  },
  {
    msg: "Thank you for organizing the hybrid team retrospective and making sure every remote engineer felt heard. The actionable retro boards have already improved our sprint velocity.",
    val: 'val-better-together'
  },
  {
    msg: "Brilliant work optimizing the mobile app cold start time by 45%. The client performance metrics in production jumped significantly and the customer feedback has been overwhelmingly positive!",
    val: 'val-client-first'
  },
  {
    msg: "Thank you for volunteering to draft the comprehensive security compliance documentation for the ISO audit. You took initiative when everyone else was swamped with sprint deliverables.",
    val: 'val-own-it'
  }
];

export function generateSeedKudos(users: User[]): { kudos: Kudos[]; composerEvents: ComposerEvent[] } {
  const kudosList: Kudos[] = [];
  const composerEvents: ComposerEvent[] = [];
  const now = new Date();

  // Reserve ~20% of users who have received 0 kudos in the last 30 days
  // (so our "Not recognised in 30 days" list is populated and realistic!)
  const unrecognisedUsers = users.slice(users.length - 24); // 24 users (~20%)
  const eligibleReceivers = users.slice(0, users.length - 24);

  // Seed target: ~400 kudos across 90 days
  // Distribution: ~45% in the last 30 days, ~55% between 30 and 90 days ago
  const totalKudos = 390;

  for (let i = 0; i < totalKudos; i++) {
    const isRecent30d = i < 185; // ~185 in last 30 days
    const daysAgo = isRecent30d
      ? Math.floor(Math.random() * 29)
      : Math.floor(Math.random() * 60) + 30;

    const kudosDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000) - Math.floor(Math.random() * 40000000));
    
    // Choose giver from all users
    const giver = users[Math.floor(Math.random() * users.length)];
    
    // Choose 1 or 2 recipients from eligibleReceivers
    // Make sure recipient != giver
    let potentialReceivers = eligibleReceivers.filter(u => u.id !== giver.id);
    if (potentialReceivers.length === 0) potentialReceivers = users.filter(u => u.id !== giver.id);

    const recipientCount = Math.random() < 0.15 ? 2 : 1;
    const recipients: string[] = [];
    const r1 = potentialReceivers[Math.floor(Math.random() * potentialReceivers.length)];
    recipients.push(r1.id);
    if (recipientCount === 2) {
      const remaining = potentialReceivers.filter(u => u.id !== r1.id);
      if (remaining.length > 0) {
        recipients.push(remaining[Math.floor(Math.random() * remaining.length)].id);
      }
    }

    const sample = SAMPLE_MESSAGES[i % SAMPLE_MESSAGES.length];
    const valueTag = Math.random() < 0.85 ? sample.val : undefined; // ~85% have value tag

    // Visibility: ~70% team, ~25% company, ~5% private
    const randVis = Math.random();
    const visibility: 'team' | 'company' | 'private' = randVis < 0.70 ? 'team' : randVis < 0.95 ? 'company' : 'private';

    const composeMs = Math.floor(Math.random() * 25000) + 12000; // 12s - 37s (median ~20s)

    const kudosId = `kudos-seed-${i}`;

    const reactions: Record<string, string[]> = {};
    if (visibility !== 'private') {
      const reactionTypes = ['👏', '🔥', '❤️', '🙌', '🚀'];
      const numReactions = Math.floor(Math.random() * 4);
      for (let r = 0; r < numReactions; r++) {
        const emoji = reactionTypes[r];
        const reactingUsers = [
          users[Math.floor(Math.random() * users.length)].id,
          users[Math.floor(Math.random() * users.length)].id,
        ];
        reactions[emoji] = Array.from(new Set(reactingUsers));
      }
    }

    const replies: Kudos['replies'] = [];
    if (visibility !== 'private' && Math.random() < 0.3) {
      const replier = users[Math.floor(Math.random() * users.length)];
      replies.push({
        id: `rep-${i}-1`,
        user_id: replier.id,
        message: 'So well deserved! Huge kudos for making this happen.',
        created_at: new Date(kudosDate.getTime() + 1800000).toISOString(),
      });
    }

    kudosList.push({
      id: kudosId,
      giver_id: giver.id,
      recipient_ids: recipients,
      message: sample.msg,
      value_id: valueTag,
      visibility,
      channel_id: visibility === 'company' ? 'c-kudos' : 'c-engineering',
      source: i % 4 === 0 ? 'shortcut' : i % 5 === 0 ? 'app_home' : 'slash',
      compose_ms: composeMs,
      created_at: kudosDate.toISOString(),
      reactions,
      replies,
    });

    // Also record composer event
    composerEvents.push({
      id: `ev-${i}`,
      user_id: giver.id,
      opened_at: new Date(kudosDate.getTime() - composeMs).toISOString(),
      sent: true,
      kudos_id: kudosId,
    });
  }

  // Add some abandoned composer events (~25% drop-off -> ~75% completion rate)
  for (let j = 0; j < 130; j++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const evDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    const randomUser = users[Math.floor(Math.random() * users.length)];
    composerEvents.push({
      id: `ev-abandoned-${j}`,
      user_id: randomUser.id,
      opened_at: evDate.toISOString(),
      sent: false,
    });
  }

  // Ensure Linh gave a recent kudos to Minh for demo purposes
  const demoKudosDate = new Date(now.getTime() - 15 * 60 * 1000); // 15 mins ago
  kudosList.unshift({
    id: 'kudos-demo-recent',
    giver_id: 'usr-linh',
    recipient_ids: ['usr-minh'],
    message: 'Thanks for diagnosing and fixing the auth token refresh loop in staging so quickly today. The client demo went off without a hitch!',
    value_id: 'val-own-it',
    visibility: 'company',
    channel_id: 'c-kudos',
    source: 'shortcut',
    source_message_id: 'msg-seed-1',
    source_message_preview: 'Hey team, staging auth token refresh is fixed now. Ready for client demo.',
    compose_ms: 14500,
    created_at: demoKudosDate.toISOString(),
    reactions: {
      '🔥': ['usr-huy', 'usr-an'],
      '👏': ['usr-sarah'],
    },
    replies: [
      {
        id: 'rep-demo-1',
        user_id: 'usr-huy',
        message: 'Great teamwork both! That token issue was subtle.',
        created_at: new Date(demoKudosDate.getTime() + 300000).toISOString(),
      }
    ],
  });

  return { kudos: kudosList, composerEvents };
}

export function generateInitialSlackMessages(users: User[], kudos: Kudos[]): SlackMessage[] {
  const messages: SlackMessage[] = [];
  const now = new Date();

  // Realistic background messages for channels
  messages.push({
    id: 'msg-seed-1',
    channel_id: 'c-engineering',
    author_id: 'usr-minh',
    content: 'Hey team, staging auth token refresh is fixed now. Ready for client demo.',
    created_at: new Date(now.getTime() - 3600000).toISOString(),
    reactions: { '🙌': ['usr-linh', 'usr-huy'] },
    replies: [],
  });

  messages.push({
    id: 'msg-seed-2',
    channel_id: 'c-engineering',
    author_id: 'usr-huy',
    content: 'Reminder: Sprint retro is today at 4:30 PM. Please populate your retro cards in advance!',
    created_at: new Date(now.getTime() - 7200000).toISOString(),
    reactions: { '👍': ['usr-linh', 'usr-minh', 'usr-bao'] },
    replies: [],
  });

  messages.push({
    id: 'msg-seed-3',
    channel_id: 'c-design',
    author_id: 'usr-an',
    content: 'Design tokens v2.1 are published in Figma! Check the new color palette tokens for dark mode.',
    created_at: new Date(now.getTime() - 14400000).toISOString(),
    reactions: { '🎨': ['usr-trang', 'usr-linh'] },
    replies: [],
  });

  messages.push({
    id: 'msg-seed-4',
    channel_id: 'c-general',
    author_id: 'usr-sarah',
    content: 'Welcome everyone to the new quarter! Don\'t forget to submit your learning stipend requests.',
    created_at: new Date(now.getTime() - 86400000).toISOString(),
    reactions: { '🎉': ['usr-minh', 'usr-an', 'usr-tina'] },
    replies: [],
  });

  // Convert recent public kudos to Slack messages in their respective channels
  const recentPublicKudos = kudos.filter(k => k.visibility !== 'private').slice(0, 30);
  recentPublicKudos.forEach((k) => {
    const giver = users.find(u => u.id === k.giver_id);
    const recNames = k.recipient_ids.map(id => users.find(u => u.id === id)?.name || 'Someone').join(', ');
    const channel = k.visibility === 'company' ? 'c-kudos' : (k.channel_id || 'c-engineering');

    messages.push({
      id: `msg-kudos-${k.id}`,
      channel_id: channel,
      author_id: 'bot-kudos',
      content: `🎉 ${giver?.name || 'Someone'} thanked ${recNames}!\n\n"${k.message}"`,
      created_at: k.created_at,
      kudos_id: k.id,
      reactions: k.reactions || {},
      replies: k.replies ? k.replies.map(r => ({
        id: r.id,
        author_id: r.user_id,
        content: r.message,
        created_at: r.created_at,
      })) : [],
    });
  });

  // Bot DMs for recent kudos
  kudos.slice(0, 15).forEach(k => {
    const giver = users.find(u => u.id === k.giver_id);
    k.recipient_ids.forEach(recId => {
      const recipient = users.find(u => u.id === recId);
      // Recipient DM
      messages.push({
        id: `dm-rec-${k.id}-${recId}`,
        channel_id: `dm-${recId}`,
        target_user_id: recId,
        author_id: 'bot-kudos',
        content: `🎉 You received kudos from ${giver?.name || 'a teammate'}!\n\n"${k.message}"\n\nVisibility: ${k.visibility.toUpperCase()}`,
        created_at: k.created_at,
        kudos_id: k.id,
        is_dm: true,
        reactions: {},
        replies: [],
      });

      // Manager DM
      if (recipient?.manager_id && recipient.manager_id !== k.giver_id) {
        const mgr = users.find(u => u.id === recipient.manager_id);
        messages.push({
          id: `dm-mgr-${k.id}-${recipient.manager_id}`,
          channel_id: `dm-${recipient.manager_id}`,
          target_user_id: recipient.manager_id,
          author_id: 'bot-kudos',
          content: `🌟 Your report ${recipient.name} received kudos from ${giver?.name}!\n\n"${k.message}"\n\n💡 Tip: Consider acknowledging this accomplishment in your next 1:1 with ${recipient.name}.`,
          created_at: k.created_at,
          kudos_id: k.id,
          is_dm: true,
          reactions: {},
          replies: [],
        });
      }
    });
  });

  return messages;
}
