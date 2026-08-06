import { useState, useEffect } from 'react';
import DriftWall from '@/components/ui/DriftWall';
import '@/sections/TechStack/TechStack.css';

const skillItems = [
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg', title: 'C++' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', title: 'Python' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', title: 'JavaScript' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg', title: 'HTML5' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg', title: 'CSS3' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg', title: 'Java' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg', title: 'SQL' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', title: 'React' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', title: 'Node.js' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg', title: 'Express' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg', title: 'Vite' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg', title: 'FastAPI' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg', title: 'Next.js' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg', title: 'Git' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', title: 'GitHub' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg', title: 'Linux' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg', title: 'VS Code' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', title: 'Docker' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg', title: 'PostgreSQL' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', title: 'MySQL' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg', title: 'MongoDB' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg', title: 'Redis' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg', title: 'GitHub Actions' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg', title: 'Kubernetes' },
  { image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', title: 'AWS' },
];

export default function TechStack() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="tech-stack" className="techstack section-container">
      <h2 className="techstack__heading">
        Tech <span className="gradient-text-accent">Stack</span>
      </h2>
      <p className="techstack__desc">
        The tools and technologies I work with every day.
      </p>
      <div style={{ height: isMobile ? 300 : 600, width: '100%', maxWidth: 1200, margin: '0 auto', overflow: 'hidden' }}>
        <DriftWall
          items={skillItems}
          columns={isMobile ? 3 : 5}
          tileWidth={isMobile ? 90 : 180}
          tileHeight={isMobile ? 60 : 120}
          gap={isMobile ? 8 : 16}
          tilt={14}
          turn={-12}
          perspective={1200}
          depth={100}
          speed={isMobile ? 20 : 36}
          direction="up"
          variance={0.4}
          parallax={0.5}
          lift={56}
          fade={isMobile ? 0.3 : 0.55}
          dim={0.5}
          grayscale={true}
          overlayColor="#060010"
        />
      </div>
    </section>
  );
}
