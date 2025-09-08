import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from '@remix-run/react';
import ignore from 'ignore';
import { useGit } from '~/lib/hooks/useGit';
import { useChatHistory } from '~/lib/persistence';
import type { Message } from 'ai';
import { detectProjectCommands, createCommandsMessage, escapeBoltTags } from '~/utils/projectCommands';
import { generateId } from '~/utils/fileUtils';

const IGNORE_PATTERNS = [
  'node_modules/**',
  '.git/**',
  '.github/**',
  '.vscode/**',
  'dist/**',
  'build/**',
  '.next/**',
  'coverage/**',
  '.cache/**',
  '.idea/**',
  '**/*.log',
  '**/.DS_Store',
  '**/npm-debug.log*',
  '**/yarn-debug.log*',
  '**/yarn-error.log*',
  '**/*lock.json',
  '**/*lock.yaml',
];

interface GitHubImportButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function GitHubImportButton({ className = '', children }: GitHubImportButtonProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const { ready, gitClone } = useGit();
  const { importChat } = useChatHistory();
  const navigate = useNavigate();

  const handleImport = async (url: string) => {
    if (!ready || !importChat) {
      toast.error('Git service not ready');
      return;
    }

    // Validate GitHub URL
    const githubUrlPattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+$/;
    if (!githubUrlPattern.test(url.trim())) {
      toast.error('Please enter a valid GitHub repository URL');
      return;
    }

    setIsImporting(true);
    setShowDialog(false);

    try {
      const ig = ignore().add(IGNORE_PATTERNS);
      const { workdir, data } = await gitClone(url);

      const filePaths = Object.keys(data).filter((filePath) => !ig.ignores(filePath));
      const textDecoder = new TextDecoder('utf-8');

      const MAX_FILE_SIZE = 100 * 1024; // 100KB per file
      const MAX_TOTAL_SIZE = 500 * 1024; // 500KB total
      let totalSize = 0;
      const skippedFiles: string[] = [];
      const fileContents = [];

      for (const filePath of filePaths) {
        const { data: content, encoding } = data[filePath];
        const fileContent = encoding === 'utf8' 
          ? content 
          : content instanceof Uint8Array 
            ? textDecoder.decode(content) 
            : '';

        if (fileContent) {
          const fileSize = new Blob([fileContent]).size;
          
          if (fileSize > MAX_FILE_SIZE) {
            skippedFiles.push(`${filePath} (too large: ${Math.round(fileSize / 1024)}KB)`);
            continue;
          }

          if (totalSize + fileSize > MAX_TOTAL_SIZE) {
            skippedFiles.push(`${filePath} (size limit reached)`);
            continue;
          }

          fileContents.push({
            path: filePath,
            content: fileContent,
          });
          totalSize += fileSize;
        }
      }

      if (fileContents.length === 0) {
        toast.error('No valid files found in repository');
        return;
      }

      // Detect project commands
      const commands = await detectProjectCommands(fileContents);
      const commandsMessage = createCommandsMessage(commands);

      // Create files message
      const filesMessage: Message = {
        role: 'assistant',
        content: `Successfully imported repository: ${url}

${skippedFiles.length > 0 
  ? `\nSkipped files (${skippedFiles.length}):
${skippedFiles.map((f) => `- ${f}`).join('\n')}\n` 
  : ''
}
<boltArtifact id="imported-files" title="Imported GitHub Repository" type="bundled">
${fileContents
  .map(
    (file) =>
      `<boltAction type="file" filePath="${file.path}">
${escapeBoltTags(file.content)}
</boltAction>`,
  )
  .join('\n')}
</boltArtifact>`,
        id: generateId(),
        createdAt: new Date(),
      };

      const messages = [filesMessage];
      if (commandsMessage) {
        messages.push(commandsMessage);
      }

      // Import the chat and navigate to it
      const repoName = url.split('/').pop() || 'GitHub Project';
      await importChat(`${repoName}`, messages);
      
      toast.success(`Successfully imported ${repoName}`);
      
      // Navigate to the new chat
      navigate('/chat/new');
      
    } catch (error) {
      console.error('Error importing GitHub repository:', error);
      toast.error(`Failed to import repository: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      handleImport(repoUrl.trim());
    }
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        disabled={isImporting}
        className={`btn rounded-lg bg-white/10 hover:bg-white/15 px-4 py-2 text-sm font-semibold transition-all ${className} ${
          isImporting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isImporting ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Importing...
          </div>
        ) : (
          children || 'Import from GitHub'
        )}
      </button>

      {/* Import Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[--ink] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Import from GitHub</h3>
              <button
                onClick={() => setShowDialog(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="repo-url" className="block text-sm font-semibold text-white/85 mb-2">
                  Repository URL
                </label>
                <input
                  id="repo-url"
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[--mint] focus:ring-2 focus:ring-[--mint]/20"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-white font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!repoUrl.trim()}
                  className="flex-1 px-4 py-2 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#98FF98', color: '#1E3A8A' }}
                >
                  Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
