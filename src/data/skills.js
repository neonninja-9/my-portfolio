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
