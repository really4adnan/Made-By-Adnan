// Define structured project types
interface Project {
  id: string;
  title: string;
  category: 'hackathon' | 'frontend' | 'design';
  badge: string;
  description: string;
  techStack: string[];
  linkUrl: string;
  linkLabel: string;
  isModal: boolean;
}

// Portfolio dataset
const projects: Project[] = [
  {
    id: "openflash",
    title: "OpenFlash",
    category: "hackathon",
    badge: "Top 10 Award Winner",
    description: "Engineered during Hackside Down Hackathon to streamline quick responses, structure creative concepts, and enhance mental workflows alongside teammates Sufian Ahmad and Rehan Kasim.",
    techStack: ["SaaS", "Web Dev", "Fast UI", "n8n / .xyz"],
    linkUrl: "https://tinyurl.com/openflash12",
    linkLabel: "Live Demo →",
    isModal: false
  },
  {
    id: "stardance-portfolio",
    title: "Interactive Portfolio (Made-By-Adnan)",
    category: "frontend",
    badge: "Personal Hub",
    description: "High-performance developer and designer showcase built for Hack Club Stardance, featuring live Hackatime tracking and a custom cream-and-maroon design system.",
    techStack: ["HTML5", "CSS Grid", "TypeScript", "WakaTime API"],
    linkUrl: "https://github.com/really4adnan/Made-By-Adnan",
    linkLabel: "GitHub Repo →",
    isModal: false
  },
  {
    id: "ui-color-grading",
    title: "High-Precision UI & Color Grading",
    category: "design",
    badge: "Visual Concept",
    description: "A design methodology balancing cream and deep maroon contrast ratios, vector geometry, typography scale, and accessible spatial hierarchy for developer interfaces.",
    techStack: ["UI/UX", "Vector Design", "Color Grading"],
    linkUrl: "#",
    linkLabel: "Inspect Details →",
    isModal: true
  }
];

// Render project cards dynamically
function renderProjects(filter: string = 'all'): void {
  const container = document.getElementById('projects-container');
  if (!container) return;

  const filtered = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  container.innerHTML = filtered.map(project => `
    <article class="project-card" data-category="${project.category}">
      <div class="card-header">
        <span class="card-type">${project.badge}</span>
        <h4>${project.title}</h4>
      </div>
      <p class="card-desc">${project.description}</p>
      <div class="card-tech">
        ${project.techStack.map(t => `<span>${t}</span>`).join('')}
      </div>
      <div class="card-links">
        ${project.isModal 
          ? `<button class="view-btn" data-title="${project.title}" data-desc="${project.description}">${project.linkLabel}</button>`
          : `<a href="${project.linkUrl}" target="_blank" rel="noopener">${project.linkLabel}</a>`
        }
      </div>
    </article>
  `).join('');

  attachModalListeners();
}

// Modal handling logic
function attachModalListeners(): void {
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const viewBtns = document.querySelectorAll<HTMLButtonElement>('.view-btn');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modal && modalTitle && modalBody) {
        modalTitle.textContent = btn.getAttribute('data-title') || 'Project Details';
        modalBody.textContent = btn.getAttribute('data-desc') || '';
        modal.style.display = 'flex';
      }
    });
  });
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  renderProjects('all');

  // Filter tab interactions
  const filterBtns = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';
      renderProjects(filterValue);
    });
  });

  // Close modal behavior
  const modal = document.getElementById('project-modal');
  const closeBtn = document.querySelector<HTMLElement>('.modal-close');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e: MouseEvent) => {
    if (e.target === modal && modal) {
      modal.style.display = 'none';
    }
  });
});