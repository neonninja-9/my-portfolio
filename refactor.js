import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.match(/\.(js|jsx|ts|tsx)$/)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = getAllFiles(srcDir);

// Define map of old imports (regex) to new imports
const replacements = [
  // CSS files
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?Hero\.css['"]/g, replace: "'@/sections/Hero/Hero.css'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/ui\/)?HeroTerminal\.css['"]/g, replace: "'@/sections/Hero/HeroTerminal.css'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/ui\/)?HeroBackground\.css['"]/g, replace: "'@/sections/Hero/HeroBackground.css'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?About\.css['"]/g, replace: "'@/sections/About/About.css'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?TechStack\.css['"]/g, replace: "'@/sections/TechStack/TechStack.css'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?Projects\.css['"]/g, replace: "'@/sections/Projects/Projects.css'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?ProjectCard\.css['"]/g, replace: "'@/sections/Projects/ProjectCard.css'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/ui\/)?RotationalProjects\.css['"]/g, replace: "'@/sections/Projects/RotationalProjects.css'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?Timeline\.css['"]/g, replace: "'@/sections/Timeline/Timeline.css'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?Contact\.css['"]/g, replace: "'@/sections/Contact/Contact.css'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/ui\/)?header-2\.css['"]/g, replace: "'@/components/layout/Header.css'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?Footer\.css['"]/g, replace: "'@/components/layout/Footer.css'" },
  { pattern: /['"](\.\/|\.\.\/)*index\.css['"]/g, replace: "'@/styles/index.css'" },

  // JS/JSX/TSX files
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?Hero['"]/g, replace: "'@/sections/Hero/Hero'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/ui\/)?HeroTerminal['"]/g, replace: "'@/sections/Hero/HeroTerminal'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/ui\/)?HeroTypewriter['"]/g, replace: "'@/sections/Hero/HeroTypewriter'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/ui\/)?HeroBackground['"]/g, replace: "'@/sections/Hero/HeroBackground'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?About['"]/g, replace: "'@/sections/About/About'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?TechStack['"]/g, replace: "'@/sections/TechStack/TechStack'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?TechStackGraph['"]/g, replace: "'@/sections/TechStack/TechStackGraph'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?Projects['"]/g, replace: "'@/sections/Projects/Projects'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?ProjectCard['"]/g, replace: "'@/sections/Projects/ProjectCard'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/ui\/)?RotationalProjects['"]/g, replace: "'@/sections/Projects/RotationalProjects'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/ui\/)?StackedProjects['"]/g, replace: "'@/sections/Projects/StackedProjects'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?Timeline['"]/g, replace: "'@/sections/Timeline/Timeline'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/ui\/)?radial-timeline['"]/g, replace: "'@/sections/Timeline/radial-timeline'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?Contact['"]/g, replace: "'@/sections/Contact/Contact'" },
  
  { pattern: /['"](\.\/|\.\.\/)*(components\/ui\/)?header-2['"]/g, replace: "'@/components/layout/Header'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?Footer['"]/g, replace: "'@/components/layout/Footer'" },
  
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?Loader['"]/g, replace: "'@/components/shared/Loader'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?ThemeSwitch['"]/g, replace: "'@/components/shared/ThemeSwitch'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?SocialCard['"]/g, replace: "'@/components/shared/SocialCard'" },

  { pattern: /['"](\.\/|\.\.\/)*(components\/)?ParticleCanvas['"]/g, replace: "'@/components/ui/ParticleCanvas'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/)?GlowButton['"]/g, replace: "'@/components/ui/GlowButton'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/ui\/)?button['"]/g, replace: "'@/components/ui/Button'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/ui\/)?menu-toggle-icon['"]/g, replace: "'@/components/ui/MenuToggleIcon'" },
  
  { pattern: /['"](\.\/|\.\.\/)*(hooks\/)?useScrollHeader['"]/g, replace: "'@/hooks/useScrollHeader'" },
  { pattern: /['"](\.\/|\.\.\/)*(hooks\/)?useScrollReveal['"]/g, replace: "'@/hooks/useScrollReveal'" },
  { pattern: /['"](\.\/|\.\.\/)*(components\/ui\/)?use-scroll['"]/g, replace: "'@/hooks/useScroll'" },
  
  { pattern: /['"](\.\/|\.\.\/)*(data\/)?projects['"]/g, replace: "'@/data/projects'" },
  { pattern: /['"](\.\/|\.\.\/)*(data\/)?skills['"]/g, replace: "'@/data/skills'" },
  { pattern: /['"](\.\/|\.\.\/)*(data\/)?socialLinks['"]/g, replace: "'@/data/socialLinks'" },
  { pattern: /['"](\.\/|\.\.\/)*(data\/)?techStack['"]/g, replace: "'@/data/techStack'" },
  { pattern: /['"](\.\/|\.\.\/)*(data\/)?timeline['"]/g, replace: "'@/data/timeline'" },
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  for (const { pattern, replace } of replacements) {
    content = content.replace(pattern, replace);
  }
  
  // Specific catch for @/components/ui/button to Button
  content = content.replace(/@\/components\/ui\/button/g, "@/components/ui/Button");
  content = content.replace(/@\/components\/ui\/menu-toggle-icon/g, "@/components/ui/MenuToggleIcon");

  // Specific catch for ui/header-2 to layout/Header
  content = content.replace(/header-2\.css/g, "Header.css");
  content = content.replace(/Header\.css\.css/g, "Header.css"); // fix accidental double .css

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated imports in ${path.relative(srcDir, file)}`);
  }
}
