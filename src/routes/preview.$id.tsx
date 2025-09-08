import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { useParams, useNavigate } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { useAuth } from '~/components/auth/WorkingAuthProvider';

export const meta: MetaFunction = () => {
  return [
    { title: 'Project Preview – Code Launch' },
    { name: 'description', content: 'Preview your CodeLaunch project in action.' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  return json({ projectId: params.id });
}

export default function ProjectPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading project data
    // In real app, this would fetch from database
    setTimeout(() => {
      setProject({
        id: id,
        name: `Project ${id}`,
        description: 'Flutter mobile application',
        status: 'active',
        framework: 'Flutter',
        lastModified: '2 hours ago',
        previewUrl: 'https://flutter-preview-demo.web.app' // Demo URL
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (!user) {
    return (
      <div className="min-h-screen text-white antialiased flex items-center justify-center" style={{ background: 'var(--ink, #0B1020)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-white/70 mb-6">Please sign in to preview projects.</p>
          <a href="/signin" className="btn rounded-lg px-6 py-3 font-semibold" style={{ backgroundColor: 'var(--mint)', color: 'var(--marine)' }}>
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen text-white antialiased flex items-center justify-center" style={{ background: 'var(--ink, #0B1020)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[--mint] mx-auto mb-4"></div>
          <p className="text-white/70">Loading project preview...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen text-white antialiased flex items-center justify-center" style={{ background: 'var(--ink, #0B1020)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-white/70 mb-6">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/projects')}
            className="btn rounded-lg px-6 py-3 font-semibold"
            style={{ backgroundColor: 'var(--mint)', color: 'var(--marine)' }}
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white antialiased" style={{ background: 'var(--ink, #0B1020)' }}>
      {/* Header */}
      <header className="border-b border-white/10">
        <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="inline-flex items-center gap-2 font-extrabold tracking-tight text-[--mint]">
              <span className="h-2.5 w-2.5 rounded-full bg-[--mint]"></span>
              <span className="text-lg sm:text-xl">Code Launch</span>
            </a>
            <span className="text-white/50">→</span>
            <span className="text-white/80">Preview: {project.name}</span>
          </div>
          <ul className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <li><a className="hover:text-white" href="/">Home</a></li>
            <li><a className="hover:text-white" href="/projects">Projects</a></li>
            <li><a className="hover:text-white" href="/profile">Profile</a></li>
          </ul>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/chat/${project.id}`)}
              className="btn rounded-lg px-4 py-2 text-sm font-semibold"
              style={{ backgroundColor: 'var(--mint)', color: 'var(--marine)' }}
            >
              Edit Project
            </button>
            <a href="/profile" className="w-8 h-8 bg-[--mint] rounded-full grid place-items-center text-[--marine] font-bold text-sm hover:scale-105 transition-transform">
              {user.name?.[0] || user.email[0].toUpperCase()}
            </a>
          </div>
        </nav>
      </header>

      {/* Project Info Bar */}
      <div className="bg-white/5 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-sm text-white/80">Live Preview</span>
              </div>
              <div className="text-sm text-white/50">
                {project.framework} • Last updated {project.lastModified}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn rounded-lg px-3 py-1.5 bg-white/10 hover:bg-white/15 text-xs">
                📱 Mobile View
              </button>
              <button className="btn rounded-lg px-3 py-1.5 bg-white/10 hover:bg-white/15 text-xs">
                💻 Desktop View
              </button>
              <button className="btn rounded-lg px-3 py-1.5 bg-white/10 hover:bg-white/15 text-xs">
                🔗 Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Frame */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
            {/* Preview Controls */}
            <div className="bg-white/5 border-b border-white/10 px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-black/30 rounded px-3 py-1 text-xs text-white/60 text-center">
                    {project.previewUrl}
                  </div>
                </div>
                <button className="text-white/50 hover:text-white text-sm">
                  ⟳
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="h-full bg-white">
              <iframe
                src={project.previewUrl}
                className="w-full h-full border-0"
                title="Project Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
              />
            </div>
          </div>

          {/* Preview Actions */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => window.open(project.previewUrl, '_blank')}
              className="btn rounded-lg px-6 py-3 bg-white/10 hover:bg-white/15"
            >
              🚀 Open in New Tab
            </button>
            <button
              onClick={() => navigate(`/chat/${project.id}`)}
              className="btn rounded-lg px-6 py-3 font-semibold"
              style={{ backgroundColor: 'var(--mint)', color: 'var(--marine)' }}
            >
              ✏️ Continue Development
            </button>
            <button className="btn rounded-lg px-6 py-3 bg-white/10 hover:bg-white/15">
              📤 Deploy Project
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-white/50 text-center">
          © {new Date().getFullYear()} Code Launch
        </div>
      </footer>
    </div>
  );
}
