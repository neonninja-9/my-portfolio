/**
 * @typedef {'language' | 'framework' | 'tool' | 'learning'} Category
 * @typedef {'advanced' | 'intermediate' | 'learning' | 'familiar' | 'beginner'} Proficiency
 *
 * @typedef {Object} SkillNode
 * @property {string} id - Unique identifier (kebab-case)
 * @property {string} label - Display name
 * @property {Category} category
 * @property {Proficiency} proficiency
 * @property {string} [note] - One-line description shown on click
 * @property {string[]} [relatedTo] - IDs of related nodes (drives link graph)
 */

/** @type {SkillNode[]} */
export const skills = [
  // ── Languages ──────────────────────────────────────────────
  {
    id: 'cpp',
    label: 'C++',
    category: 'language',
    proficiency: 'advanced',
    note: 'Primary language for DSA and competitive programming.',
    relatedTo: ['python'],
  },
  {
    id: 'python',
    label: 'Python',
    category: 'language',
    proficiency: 'advanced',
    note: 'Scripting, automation, and ML prototyping.',
    relatedTo: ['cpp', 'machine-learning'],
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    category: 'language',
    proficiency: 'intermediate',
    note: 'Full-stack web development with modern ES6+.',
    relatedTo: ['react', 'nodejs', 'express', 'vite', 'html-css'],
  },
  {
    id: 'html-css',
    label: 'HTML/CSS',
    category: 'language',
    proficiency: 'intermediate',
    note: 'Semantic markup, responsive layouts, and animations.',
    relatedTo: ['javascript', 'react', 'vite'],
  },
  {
    id: 'sql',
    label: 'SQL',
    category: 'language',
    proficiency: 'intermediate',
    note: 'Relational database queries and schema design.',
    relatedTo: ['rest-apis'],
  },
  {
    id: 'java',
    label: 'Java',
    category: 'language',
    proficiency: 'intermediate',
    note: 'Object-oriented programming and enterprise applications.',
    relatedTo: ['system-design'],
  },

  // ── Frameworks & Libraries ─────────────────────────────────
  {
    id: 'react',
    label: 'React',
    category: 'framework',
    proficiency: 'learning',
    note: 'Building this portfolio and learning component patterns.',
    relatedTo: ['javascript', 'vite', 'nodejs'],
  },
  {
    id: 'nodejs',
    label: 'Node.js',
    category: 'framework',
    proficiency: 'learning',
    note: 'Server-side JavaScript runtime.',
    relatedTo: ['javascript', 'express', 'rest-apis'],
  },
  {
    id: 'express',
    label: 'Express',
    category: 'framework',
    proficiency: 'learning',
    note: 'Minimal web framework for building REST APIs.',
    relatedTo: ['nodejs', 'javascript', 'rest-apis'],
  },
  {
    id: 'vite',
    label: 'Vite',
    category: 'framework',
    proficiency: 'familiar',
    note: 'Lightning-fast build tool powering this site.',
    relatedTo: ['react', 'javascript'],
  },
  {
    id: 'fastapi',
    label: 'FastAPI',
    category: 'framework',
    proficiency: 'intermediate',
    note: 'High performance web framework for building APIs with Python.',
    relatedTo: ['python', 'rest-apis'],
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    category: 'framework',
    proficiency: 'learning',
    note: 'React framework for production grade applications.',
    relatedTo: ['react', 'javascript'],
  },

  // ── Tools & Platforms ──────────────────────────────────────
  {
    id: 'git',
    label: 'Git',
    category: 'tool',
    proficiency: 'advanced',
    note: 'Version control for every project.',
    relatedTo: ['github', 'linux'],
  },
  {
    id: 'github',
    label: 'GitHub',
    category: 'tool',
    proficiency: 'advanced',
    note: 'Code hosting, CI/CD, and collaboration.',
    relatedTo: ['git', 'vscode'],
  },
  {
    id: 'linux',
    label: 'Linux',
    category: 'tool',
    proficiency: 'intermediate',
    note: 'Daily driver OS, shell scripting, and server management.',
    relatedTo: ['git', 'docker'],
  },
  {
    id: 'vscode',
    label: 'VS Code',
    category: 'tool',
    proficiency: 'advanced',
    note: 'Primary editor with extensive extension setup.',
    relatedTo: ['github', 'git'],
  },
  {
    id: 'docker',
    label: 'Docker',
    category: 'tool',
    proficiency: 'learning',
    note: 'Containerization basics and local dev environments.',
    relatedTo: ['linux', 'cloud-aws'],
  },
  {
    id: 'postgresql',
    label: 'PostgreSQL',
    category: 'tool',
    proficiency: 'intermediate',
    note: 'Advanced open source relational database.',
    relatedTo: ['sql', 'nodejs'],
  },
  {
    id: 'mysql',
    label: 'MySQL',
    category: 'tool',
    proficiency: 'intermediate',
    note: 'Popular open source relational database.',
    relatedTo: ['sql'],
  },
  {
    id: 'mongodb',
    label: 'MongoDB',
    category: 'tool',
    proficiency: 'intermediate',
    note: 'NoSQL database for flexible data models.',
    relatedTo: ['nodejs', 'express'],
  },
  {
    id: 'redis',
    label: 'Redis',
    category: 'tool',
    proficiency: 'learning',
    note: 'In-memory data structure store.',
    relatedTo: ['system-design', 'postgresql'],
  },
  {
    id: 'github-actions',
    label: 'GitHub Actions',
    category: 'tool',
    proficiency: 'intermediate',
    note: 'Automate software workflows and CI/CD.',
    relatedTo: ['github', 'ci-cd'],
  },
  {
    id: 'kubernetes',
    label: 'Kubernetes',
    category: 'tool',
    proficiency: 'learning',
    note: 'Container orchestration system.',
    relatedTo: ['docker', 'linux', 'system-design'],
  },

  // ── Currently Learning ─────────────────────────────────────
  {
    id: 'system-design',
    label: 'System Design',
    category: 'learning',
    proficiency: 'beginner',
    note: 'Scalability patterns, load balancers, and distributed systems.',
    relatedTo: ['cloud-aws', 'rest-apis'],
  },
  {
    id: 'machine-learning',
    label: 'Machine Learning',
    category: 'learning',
    proficiency: 'learning',
    note: 'Supervised learning, neural networks, and scikit-learn.',
    relatedTo: ['python'],
  },
  {
    id: 'cloud-aws',
    label: 'Cloud (AWS)',
    category: 'learning',
    proficiency: 'beginner',
    note: 'EC2, S3, Lambda — getting started with cloud infra.',
    relatedTo: ['docker', 'system-design'],
  },
  {
    id: 'rest-apis',
    label: 'REST APIs',
    category: 'learning',
    proficiency: 'learning',
    note: 'Designing and consuming RESTful web services.',
    relatedTo: ['express', 'nodejs', 'sql'],
  },
  {
    id: 'rest-api-design',
    label: 'API Design',
    category: 'learning',
    proficiency: 'intermediate',
    note: 'Best practices for designing scalable APIs.',
    relatedTo: ['rest-apis'],
  },
  {
    id: 'authentication',
    label: 'Auth (JWT/OAuth)',
    category: 'learning',
    proficiency: 'intermediate',
    note: 'Securing applications with modern authentication.',
    relatedTo: ['rest-apis', 'nodejs'],
  },
  {
    id: 'ci-cd',
    label: 'CI/CD',
    category: 'learning',
    proficiency: 'intermediate',
    note: 'Continuous Integration and Continuous Deployment.',
    relatedTo: ['github-actions', 'git'],
  },
  {
    id: 'agile-scrum',
    label: 'Agile/Scrum',
    category: 'learning',
    proficiency: 'intermediate',
    note: 'Iterative project management and development.',
    relatedTo: [],
  },
  {
    id: 'microservices',
    label: 'Microservices',
    category: 'learning',
    proficiency: 'learning',
    note: 'Structuring applications as independent services.',
    relatedTo: ['system-design', 'docker', 'kubernetes'],
  },
  {
    id: 'unit-testing',
    label: 'Unit Testing',
    category: 'learning',
    proficiency: 'intermediate',
    note: 'Testing individual units or components of a software.',
    relatedTo: ['javascript', 'python'],
  },
];

// ── Visual constants ─────────────────────────────────────────
// These use the same accent colors defined in index.css

/** Category → hex color (matches site palette) */
export const CATEGORY_COLORS = {
  language: '#8b5cf6',   // --accent-purple
  framework: '#3b82f6',  // --accent-blue
  tool: '#06b6d4',       // --accent-cyan
  learning: '#ec4899',   // --accent-pink
};

/** Category → human-readable label */
export const CATEGORY_LABELS = {
  language: 'Languages',
  framework: 'Frameworks',
  tool: 'Tools',
  learning: 'Learning',
};

/** Proficiency → node radius in px (larger = more proficient) */
export const PROFICIENCY_RADIUS = {
  advanced: 28,
  intermediate: 22,
  familiar: 18,
  learning: 16,
  beginner: 14,
};

/**
 * Build link array from skills' relatedTo fields.
 * Each link is { source: id, target: id }. De-duplicated so A→B doesn't
 * also produce B→A.
 * @param {SkillNode[]} nodes
 * @returns {{ source: string, target: string }[]}
 */
export function buildLinks(nodes) {
  const seen = new Set();
  const links = [];
  for (const node of nodes) {
    if (!node.relatedTo) continue;
    for (const targetId of node.relatedTo) {
      const key = [node.id, targetId].sort().join('--');
      if (!seen.has(key)) {
        seen.add(key);
        links.push({ source: node.id, target: targetId });
      }
    }
  }
  return links;
}
