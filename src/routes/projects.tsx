import { json, type MetaFunction } from '@remix-run/cloudflare';
import { GitHubImportButton } from '~/components/git/GitHubImportButton';
import { useAuth } from '~/components/auth/WorkingAuthProvider';
import { useState, useEffect } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Code Launch – Projects' },
    { name: 'description', content: 'Manage, search, and launch your Code Launch projects.' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ];
};

export const loader = () => json({});

// Projects will be loaded from database
const sampleProjects: any[] = [];

function ProjectsGrid() {
  const { user } = useAuth();
  const [projects, setProjects] = useState(sampleProjects);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="panel rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <div className="flex items-center gap-2">
                <span className={`chip rounded-full px-2 py-1 text-xs ${
                  project.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-4">{project.description}</p>
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>{project.framework}</span>
              <span>{project.lastModified}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 bg-white/5 border-t border-white/10">
            <button 
              onClick={() => window.location.href = `/chat/${project.id}`}
              className="px-4 py-3 text-sm font-semibold rounded-none"
              style={{ backgroundColor: 'var(--mint)', color: 'var(--marine)' }}
            >
              Open
            </button>
            <button 
              onClick={() => window.location.href = `/preview/${project.id}`}
              className="px-4 py-3 text-sm text-white/70 hover:bg-white/10 border-l border-white/10 rounded-none"
            >
              Preview
            </button>
          </div>
        </div>
      ))}
      
      {projects.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="mx-auto h-16 w-16 grid place-items-center rounded-2xl font-extrabold mb-4" style={{ background: 'var(--sand)', color: 'var(--marine)' }}>
            CL
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-white/60 mb-4">Create your first project to get started</p>
          <a href="/" className="btn rounded-lg bg-[--mint] text-[--marine] px-4 py-2 text-sm font-semibold">
            Create Project
          </a>
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen text-white antialiased" style={{ background: 'var(--ink, #0B1020)' }}>
      {/* Top nav */}
      <header className="relative z-10 border-b border-white/10">
        <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <a className="inline-flex items-center gap-2 font-extrabold tracking-tight text-[--mint]" href="/">
            <span className="h-2.5 w-2.5 rounded-full bg-[--mint]"></span>
            <span className="text-lg sm:text-xl">Code Launch</span>
          </a>
          <ul className="hidden md:flex items-center gap-8 text-sm text-white/80">
            <li><a className="hover:text-white" href="/">Home</a></li>
            <li><a className="hover:text-white text-[--mint] font-semibold" href="/projects">Projects</a></li>
            <li><a className="hover:text-white" href="#">Docs</a></li>
          </ul>
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/70">مرحباً، {user.name || user.email}</span>
                <a href="/profile" className="w-8 h-8 bg-[--mint] rounded-full grid place-items-center text-[--marine] font-bold text-sm hover:scale-105 transition-transform cursor-pointer">
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </a>
              </div>
            ) : (
              <a href="/signin" className="btn rounded-full px-4 py-2 text-sm font-semibold" style={{ color: '#1E3A8A', backgroundColor: '#98FF98' }}>
                Sign in
              </a>
            )}
          </div>
        </nav>
      </header>

      {/* Ambient curve background */}
      <div className="absolute inset-x-0 bottom-[-20vh] h-[60vh] -z-10 ambient"></div>

      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Your Projects</h1>
            <p className="mt-2 text-white/70">Manage, search, and launch your Code Launch projects.</p>
          </div>
          <div className="flex items-center gap-2">
            <GitHubImportButton />
            <a href="/" className="btn rounded-lg bg-[--mint] text-[--marine] px-4 py-2 text-sm font-semibold">New Project</a>
          </div>
        </div>
      </section>

      {/* Projects Content */}
      <main className="mx-auto max-w-7xl px-6 pb-20">
        <ProjectsGrid />
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50">
          <p>© {new Date().getFullYear()} Code Launch</p>
          <div className="flex items-center gap-4">
            <a className="hover:text-white" href="/privacy">Privacy</a>
            <a className="hover:text-white" href="/terms">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}