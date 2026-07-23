import { useState, type CSSProperties } from 'react'
import './BuildingPanel.css'
import { ASSET_PATHS } from '../../data/assets'
import {
  CN_TOWER_IMAGE,
  EAST_TOWER_ONE_IMAGE,
  EAST_TOWER_TWO_IMAGE,
  ROGERS_CENTRE_IMAGE,
  WEST_TOWER_IMAGE,
  SKYLINE_IMAGE,
  type BuildingRegion,
} from '../../data/buildings'

type BuildingPanelProps = {
  building: BuildingRegion
  onClose: () => void
}

type BuildingPanelScene = {
  body?: string
  contactLinks?: ContactLink[]
  education?: EducationItem
  experienceItems?: ExperienceItem[]
  id: string
  imageSrc?: string
  kicker: string
  projectItems?: ProjectItem[]
  skillGroups?: SkillGroup[]
  title: string
}

type ContactLink = {
  label: string
  href: string
  iconPath?: string
  icon?: 'instagram'
}

type ContactIconStyle = CSSProperties & {
  '--contact-icon': string
}

type EducationItem = {
  degree: string
  school: string
  date: string
  description: string
}

type ExperienceItem = {
  role: string
  organization: string
  date: string
  location: string
  bullets: string[]
}

type ProjectItem = {
  title: string
  kind: string
  description: string
  technologies: string[]
  embedUrl?: string
  href?: string
}

type SkillGroup = {
  label: string
  items: string[]
}

const panelScenes: Record<string, BuildingPanelScene> = {
  'about-me': {
    body:
     'I’m a third-year Computer Systems Engineering student at Carleton University with an interest in full-stack development. I enjoy building web applications, APIs, automation tools, and other software projects, and I’m always looking for opportunities to learn new technologies by building them. \n\n I’m based in Toronto and am looking for software engineering internships in Toronto, Ottawa, or remote and hybrid roles.',

    education: {
      degree: 'Bachelor of Engineering, Computer Systems Engineering',
      school: 'Carleton University',
      date: 'Expected Apr 2029',
      description: 'Third-year computer systems engineering student focused on software engineering and full-stack development.',
    },
    id: 'about',
    imageSrc: CN_TOWER_IMAGE,
    kicker: 'Toronto, Ontario',
    title: 'About me',
  },
  projects: {
    id: 'projects',
    imageSrc: ROGERS_CENTRE_IMAGE,
    kicker: 'Selected work',
    projectItems: [
      {
        title: 'ClashRecruit',
        kind: 'Website',
        description:
          'A full-stack Clash of Clans recruitment platform for discovering and managing active clan listings online.',
        technologies: ['Python', 'Flask', 'Celery', 'MongoDB', 'JavaScript', 'React', 'AWS EC2'],
        embedUrl: 'https://clashrecruit.com',
        href: 'https://github.com/arkaazattar/ClashRecruit',
      },
      {
        title: 'CourseTrack',
        kind: 'CTRL-HACK-DEL 2.0 Hackathon',
        description:
          'A syllabus-to-calendar workflow that turns uploaded syllabi into reviewable event data and exportable .ics files.',
        technologies: ['Python', 'Flask', 'MongoDB', 'OpenRouter', 'Google Calendar API'],
        href: 'https://github.com/jonathanjia21/CourseTrack-for-CTRL-HACK-DEL-2.0-Hackathon',
      },
      {
        title: 'WatchDog',
        kind: '2nd Place Overall, Dev0 Hackathon',
        description:
          'A WebSocket-based security tool that streams device status, confirms threats, captures intruder snapshots, and supports remote lock commands.',
        technologies: ['Python', 'Kotlin', 'WebSockets', 'OpenCV'],
        href: 'https://github.com/Pythoneers-Dev-0-2025-2026/WatchDog',
      },
    ],
    title: 'Projects',
  },
  skills: {
    id: 'skills',
    imageSrc: WEST_TOWER_IMAGE,
    kicker: 'Tools and systems',
    skillGroups: [
      {
        label: 'Languages',
        items: ['Python', 'Java', 'C', 'JavaScript', 'TypeScript', 'Kotlin', 'HTML/CSS', 'Bash'],
      },
      {
        label: 'Frameworks',
        items: ['React', 'Vite', 'Flask', 'Celery', 'WebSockets'],
      },
      {
        label: 'Tools',
        items: ['Git', 'Docker', 'Linux', 'AWS EC2', 'MongoDB', 'Altium'],
      },
    ],
    title: 'Skills',
  },
  experience: {
    id: 'experience',
    experienceItems: [
      {
        role: 'Electrical Subteam Member',
        organization: 'Carleton Planetary Robotics Team',
        date: 'Sept 2025 - Apr 2026',
        location: 'Ottawa, ON',
        bullets: [
          'Redesigned the team robot control base station PCB in Altium, making the STM32-based board more modular and simplifying future hardware revisions.',
          'Collaborated with the electrical subteam on PCB design reviews, evaluating hardware changes and design tradeoffs for future revisions.',
        ],
      },
    ],
    imageSrc: EAST_TOWER_ONE_IMAGE,
    kicker: 'Background',
    title: 'Experience',
  },
  contact: {
    contactLinks: [
      {
        label: 'GitHub',
        href: 'https://github.com/arkaazattar',
        iconPath: ASSET_PATHS.icons.github,
      },
      {
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/arkaazattar',
        iconPath: ASSET_PATHS.icons.linkedin,
      },
      {
        label: 'Email',
        href: 'mailto:arkaazattar@gmail.com',
        iconPath: ASSET_PATHS.icons.email,
      },
      {
        label: 'Instagram',
        href: 'https://instagram.com/arkaazattar',
        icon: 'instagram',
      },
    ],
    id: 'contact',
    imageSrc: EAST_TOWER_TWO_IMAGE,
    kicker: 'Get in touch',
    title: 'Contact',
  },
}

export default function BuildingPanel({ building, onClose }: BuildingPanelProps) {
  const panelScene = panelScenes[building.id]

  return (
    <div className="building-panel" onClick={onClose}>
      {panelScene && (
        <BuildingPanelSceneContent building={building} onClose={onClose} scene={panelScene} />
      )}
    </div>
  )
}

function BuildingPanelSceneContent({
  building,
  onClose,
  scene,
}: {
  building: BuildingRegion
  onClose: () => void
  scene: BuildingPanelScene
}) {
  const [isCatSleeping, setIsCatSleeping] = useState(false)

  return (
    <section className={`building-panel-section building-panel-section-${scene.id}`}>
      {scene.imageSrc && (
        <>
          <img
            className="building-panel-image building-panel-image-visual"
            src={scene.imageSrc}
            alt=""
            aria-hidden="true"
          />
          <svg
            className="building-panel-image building-panel-image-outline"
            viewBox={`0 0 ${SKYLINE_IMAGE.width} ${SKYLINE_IMAGE.height}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <path
              className="building-panel-outline building-panel-outline-backdrop"
              d={building.mapPath}
            />
            <path
              className="building-panel-outline building-panel-outline-accent"
              d={building.mapPath}
            />
          </svg>
          <svg
            className="building-panel-image building-panel-image-hit"
            viewBox={`0 0 ${SKYLINE_IMAGE.width} ${SKYLINE_IMAGE.height}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <path
              className="building-panel-image-hit-area"
              d={building.mapPath}
              onClick={(event) => event.stopPropagation()}
            />
          </svg>
        </>
      )}
      <div className="building-panel-card" onClick={(event) => event.stopPropagation()}>
        <button
          className="building-panel-card-close-button"
          type="button"
          aria-label="Close panel"
          onClick={onClose}
        ></button>
        {scene.id === 'about' && (
          <button
            className="building-panel-cat-button"
            type="button"
            aria-label={isCatSleeping ? 'Wake cat' : 'Put cat to sleep'}
            onClick={(event) => {
              event.stopPropagation()
              setIsCatSleeping((currentValue) => !currentValue)
            }}
          >
            <img
              src={isCatSleeping ? ASSET_PATHS.misc.sleepCat : ASSET_PATHS.misc.sitCat}
              alt=""
              aria-hidden="true"
            />
          </button>
        )}
        <p className="building-panel-kicker">{scene.kicker}</p>
        <h2>{scene.title}</h2>
        {scene.body && (
          <div className="building-panel-body">
            {scene.body.split('\n\n').map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}
        {scene.education && (
          <article className="building-panel-education" aria-label="Education">
            <div className="building-panel-education-heading">
              <h3>{scene.education.degree}</h3>
              <span>{scene.education.date}</span>
            </div>
            <p className="building-panel-education-school">{scene.education.school}</p>
            <p>{scene.education.description}</p>
          </article>
        )}
        {scene.projectItems && (
          <div className="building-panel-projects" aria-label="Projects">
            {scene.projectItems.map((project) => (
              <article className="building-panel-project" key={project.title}>
                <div className="building-panel-project-heading">
                  <h3>{project.title}</h3>
                  <span>{project.kind}</span>
                </div>
                <p>{project.description}</p>
                {project.embedUrl && (
                  <iframe
                    className="building-panel-project-frame"
                    src={project.embedUrl}
                    title={`${project.title} preview`}
                    loading="lazy"
                  />
                )}
                <ul>
                  {project.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
                {project.href && (
                  <a
                    className="building-panel-project-link"
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      className="building-panel-project-link-icon"
                      style={{
                        '--contact-icon': `url(${ASSET_PATHS.icons.github})`,
                      } as ContactIconStyle}
                      aria-hidden="true"
                    />
                    GitHub
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
        {scene.skillGroups && (
          <div className="building-panel-skills" aria-label="Resume skills">
            {scene.skillGroups.map((group) => (
              <section className="building-panel-skill-group" key={group.label}>
                <h3>{group.label}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
        {scene.experienceItems && (
          <div className="building-panel-experience" aria-label="Club experience">
            {scene.experienceItems.map((item) => (
              <article className="building-panel-experience-item" key={item.organization}>
                <div className="building-panel-experience-heading">
                  <h3>{item.role}</h3>
                  <span>{item.date}</span>
                </div>
                <p className="building-panel-experience-meta">
                  {item.organization} / {item.location}
                </p>
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
        {scene.contactLinks && (
          <div className="building-panel-contact-links" aria-label="Contact links">
            {scene.contactLinks.map((link) => (
              <a
                className="building-panel-contact-link"
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                key={link.label}
              >
                {link.iconPath ? (
                  <span
                    className="building-panel-contact-link-icon"
                    style={{ '--contact-icon': `url(${link.iconPath})` } as ContactIconStyle}
                    aria-hidden="true"
                  />
                ) : (
                  <InstagramIcon />
                )}
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="17" cy="7" r="1.2" />
    </svg>
  )
}
