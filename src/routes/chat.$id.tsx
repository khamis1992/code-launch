import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { toast } from 'react-toastify';
import { SpeechRecognitionButton } from '~/components/chat/SpeechRecognition';
import { ColorSchemeDialog } from '~/components/ui/ColorSchemeDialog';
import { McpTools } from '~/components/chat/MCPTools';
import { IconButton } from '~/components/ui/IconButton';
import { SmartPromptAnalyzer } from '~/lib/services/smartPromptAnalyzer';
import { AutoModelSelector } from '~/lib/services/autoModelSelector';
import { GuidedConversationService } from '~/lib/services/guidedConversationService';
import { SmartTemplateService } from '~/lib/services/smartTemplateService';
import { HybridPreview } from '~/components/workbench/HybridPreview';

export const meta: MetaFunction = () => {
  return [
    { title: 'Code Launch – Studio' },
    { name: 'description', content: 'AI-powered development studio for building applications with real-time preview.' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  return json({ id: args.params.id });
}

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [isListening, setIsListening] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [imageDataList, setImageDataList] = useState<string[]>([]);
  const [designScheme, setDesignScheme] = useState<any>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [transcript, setTranscript] = useState('');
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('claude-sonnet-4-20250514');
  const [autoMode, setAutoMode] = useState(true);
  const showWorkbench = useStore(workbenchStore.showWorkbench);
  const files = useStore(workbenchStore.files);
  const hasFiles = Object.keys(files).length > 0;

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        setTranscript(transcript);
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error(`Speech recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  // File upload handler
  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const base64Image = e.target?.result as string;
          setUploadedFiles([...uploadedFiles, file]);
          setImageDataList([...imageDataList, base64Image]);
          toast.success('File uploaded successfully!');
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  };

  // Speech recognition handlers - Original functionality
  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      toast.success('Listening started...');
    } else {
      toast.error('Speech recognition not supported in this browser');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      toast.info('Listening stopped');
    }
  };

  // Smart prompt analysis
  const analyzePrompt = async (prompt: string) => {
    if (!prompt.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = SmartPromptAnalyzer.analyzePrompt(prompt);
      const modelSelection = AutoModelSelector.selectModel(analysis);
      
      // Auto-select optimal model
      if (autoMode && modelSelection.selectedModel !== selectedModel) {
        setSelectedModel(modelSelection.selectedModel);
        toast.success(`تم اختيار ${modelSelection.selectedModel} تلقائياً لأفضل نتائج`);
      }
      
      // Generate smart suggestions
      const suggestions = SmartPromptAnalyzer.generateGuidedQuestions(analysis);
      setSmartSuggestions(suggestions.slice(0, 3));
      
      // Show analysis result
      if (analysis.appType) {
        toast.info(`تم اكتشاف: تطبيق ${analysis.appType} - جاري التحضير...`);
      }
      
    } catch (error) {
      console.error('Error analyzing prompt:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Enhanced prompt handler with smart analysis
  const handleEnhancePrompt = async () => {
    if (!input.trim()) {
      toast.warning('اكتب وصف التطبيق أولاً');
      return;
    }
    
    await analyzePrompt(input);
    toast.success('تم تحليل وتحسين الطلب!');
  };

  // Auto-analyze when user types
  useEffect(() => {
    if (input.length > 20) { // Analyze when user has typed enough
      const debounceTimer = setTimeout(() => {
        analyzePrompt(input);
      }, 1000);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [input]);

  // File manager handler
  const handleFileManager = () => {
    // Toggle file tree or open file browser
    toast.info('File manager opened');
  };

  return (
    <div className="min-h-screen text-white antialiased" style={{ background: 'var(--ink, #0B1020)' }}>
      {/* Studio Header */}
      <header className="relative z-10 border-b border-white/10">
        <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <a className="inline-flex items-center gap-2 font-extrabold tracking-tight text-[--mint]" href="/">
            <span className="h-2.5 w-2.5 rounded-full bg-[--mint]"></span>
            <span className="text-lg sm:text-xl">Code Launch</span>
          </a>
          <ul className="hidden md:flex items-center gap-8 text-sm text-white/80">
            <li><a className="hover:text-white" href="/">Home</a></li>
            <li><a className="hover:text-white" href="/projects">Projects</a></li>
            <li><a className="hover:text-white" href="/profile">Profile</a></li>
            <li><a className="hover:text-white" href="#">Docs</a></li>
          </ul>
          <div className="flex items-center gap-2">
            <a className="btn rounded-full px-4 py-2 text-sm font-semibold text-[--marine] bg-[--mint]" href="/">New Project</a>
            <a href="/profile" className="w-8 h-8 bg-[--mint] rounded-full grid place-items-center text-[--marine] font-bold text-sm hover:scale-105 transition-transform cursor-pointer ml-2">
              U
            </a>
          </div>
        </nav>
      </header>

      {/* Ambient Background */}
      <div className="absolute inset-x-0 bottom-[-20vh] h-[60vh] -z-10 ambient"></div>

      {/* Studio Layout */}
      <main className="mx-auto max-w-[1400px] px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Assistant Panel */}
        <section className="panel rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Assistant</h2>
            <span className="chip rounded-full px-3 py-1 text-xs text-white/75">Flutter • Supabase</span>
          </div>

          {/* Steps/Tasks List */}
          <ol className="mt-5 space-y-4">
            <li className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Check compatibility</h3>
                <span className="text-[10px] text-white/60">auto</span>
              </div>
              <p className="mt-1 text-sm text-white/70">
                Ensuring your project uses compatible Flutter & package versions.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div className="chip rounded-lg px-3 py-2">Flutter: 3.22.x ✓</div>
                <div className="chip rounded-lg px-3 py-2">Riverpod: ^2.5 ✓</div>
                <div className="chip rounded-lg px-3 py-2">go_router: ^14 ✓</div>
                <div className="chip rounded-lg px-3 py-2">supabase_flutter: ^2 ✓</div>
              </div>
            </li>

            <li className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Fixes & scripts</h3>
                <span className="text-[10px] text-white/60">suggested</span>
              </div>
              <p className="mt-1 text-sm text-white/70">Recommended commands to clean & rebuild safely.</p>
              <pre className="mt-3 rounded-lg bg-black/50 p-3 text-[12px] leading-6 overflow-auto">
flutter clean
flutter pub get
dart run build_runner build -d
flutter run
              </pre>
            </li>

            <li className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Changes</h3>
                <span className="text-[10px] text-white/60">diff</span>
              </div>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <div className="chip rounded-lg px-3 py-2">/lib/router/app_router.dart</div>
                <div className="chip rounded-lg px-3 py-2">/lib/features/customers/...</div>
                <div className="chip rounded-lg px-3 py-2">/lib/core/theme/colors.dart</div>
                <div className="chip rounded-lg px-3 py-2">/test/widget/customers_test.dart</div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button className="btn rounded-lg bg-[--mint] text-[--marine] px-4 py-2 text-sm font-semibold">Apply All</button>
                <button className="btn rounded-lg bg-white/10 hover:bg-white/15 px-4 py-2 text-sm">Review Diff</button>
              </div>
            </li>
          </ol>

          {/* Main Chat Interface - Full Integration */}
          <div className="mt-6 h-[400px] rounded-xl bg-black/20 border border-white/10 overflow-hidden">
            <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
          </div>

          {/* Enhanced Prompt Box */}
          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2 text-white/80">Prompt</label>
            <div className="rounded-2xl bg-black/30 p-3 ring-1 ring-white/10">
              <textarea 
                rows={3} 
                placeholder="Describe the screen you want to build..."
                className="w-full bg-transparent outline-none placeholder:text-white/40 text-sm resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
              
              {/* Action Buttons Row */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Color Scheme Dialog */}
                  <ColorSchemeDialog designScheme={designScheme} setDesignScheme={setDesignScheme} />
                  
                  {/* MCP Tools */}
                  <McpTools />
                  
                  {/* Attachment Button */}
                  <IconButton title="Upload file" className="transition-all" onClick={handleFileUpload}>
                    <div className="i-ph:paperclip text-xl"></div>
                  </IconButton>

                  {/* AI/Brain Button - Enhance Prompt */}
                  <IconButton
                    title="Enhance prompt"
                    disabled={input.length === 0}
                    className="transition-all"
                    onClick={handleEnhancePrompt}
                  >
                    <div className="i-ph:star text-xl"></div>
                  </IconButton>

                  {/* Microphone Button - Original Component */}
                  <SpeechRecognitionButton
                    isListening={isListening}
                    onStart={startListening}
                    onStop={stopListening}
                    disabled={false}
                  />

                  {/* Folder/Files Button */}
                  <IconButton title="File Manager" className="transition-all" onClick={handleFileManager}>
                    <div className="i-ph:folder text-xl"></div>
                  </IconButton>
                </div>

                <div className="flex items-center gap-2">
                  <button className="btn rounded-lg bg-white/10 hover:bg-white/15 px-3 py-1.5 text-sm">Dry-Run</button>
                  <button className="btn rounded-lg bg-[--mint] text-[--marine] px-4 py-1.5 text-sm font-semibold">Generate</button>
                </div>
              </div>

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div className="mt-3 p-2 bg-white/5 rounded-lg">
                  <div className="text-xs text-white/60 mb-2">Uploaded Files:</div>
                  <div className="flex flex-wrap gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white/10 rounded px-2 py-1 text-xs">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                        </svg>
                        <span className="text-white/70">{file.name}</span>
                        <button 
                          onClick={() => {
                            setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
                            setImageDataList(imageDataList.filter((_, i) => i !== index));
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Smart Suggestions */}
              {smartSuggestions.length > 0 && (
                <div className="mt-3 p-3 bg-[--mint]/10 rounded-lg border border-[--mint]/20">
                  <div className="text-xs text-[--mint] mb-2 font-semibold">💡 اقتراحات ذكية لتحسين طلبك:</div>
                  <div className="space-y-2">
                    {smartSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(input + ' ' + suggestion)}
                        className="block w-full text-left text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded px-2 py-1 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Auto Mode Toggle */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="auto-mode"
                    checked={autoMode}
                    onChange={(e) => setAutoMode(e.target.checked)}
                    className="accent-[--mint]"
                  />
                  <label htmlFor="auto-mode" className="text-xs text-white/70">
                    🤖 النمط التلقائي (يختار أفضل نموذج ذكي)
                  </label>
                </div>
                {selectedModel && (
                  <div className="text-xs text-[--mint]">
                    النموذج: {selectedModel.includes('claude') ? 'Claude 4-Sonnet' : 'DeepSeek V3'}
                  </div>
                )}
              </div>

              {/* Quick Commands */}
              <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
                <span className="chip rounded-full px-2 py-1">/مطعم</span>
                <span className="chip rounded-full px-2 py-1">/متجر</span>
                <span className="chip rounded-full px-2 py-1">/تطبيق</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Workbench Panel */}
        <section className="panel rounded-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-4 text-sm text-white/70">
              <button 
                className={`tab px-2 pb-2 ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                Preview
              </button>
              <button 
                className={`tab px-2 pb-2 ${activeTab === 'code' ? 'active' : ''}`}
                onClick={() => setActiveTab('code')}
              >
                Code
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn rounded-full px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/15">Open Emulator</button>
              <button className="btn rounded-full px-3 py-1.5 text-xs font-semibold text-[--marine] bg-[--mint]">Publish</button>
            </div>
          </div>

          {/* Hybrid Preview Content */}
          <div className="relative flex-1" style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))' }}>
            <HybridPreview 
              initialPrompt={input}
              onEngineChange={(engine) => {
                console.log('Preview engine changed to:', engine);
              }}
            />
          </div>

          {/* Footer Strip */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-white/10 text-xs text-white/60">
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white">Help Center</a>
              <a href="#" className="hover:text-white">Join Community</a>
            </div>
            <span>© {new Date().getFullYear()} Code Launch</span>
          </div>
        </section>
      </main>
    </div>
  );
}
