import React, { useState, useEffect } from 'react';
import { supabaseSQL } from '../data/dbSchema';
import { projectFilesTree, FileNode } from '../data/projectFiles';
import { Database, FolderTree, Terminal, Copy, Check, ChevronRight, ChevronDown, Play, FileText, Code2, BarChart2 } from 'lucide-react';
import AnalyticalDashboard from './AnalyticalDashboard';

export default function DevWorkspace() {
  const [activePalette, setActivePalette] = useState(() => {
    return localStorage.getItem('personalpessoal_accent_palette') || 'laranja';
  });

  useEffect(() => {
    const syncTheme = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setActivePalette(customEvent.detail);
      }
    };
    window.addEventListener('personalpessoal_palette_changed', syncTheme);
    return () => window.removeEventListener('personalpessoal_palette_changed', syncTheme);
  }, []);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'supabase' | 'folder' | 'terminal'>('dashboard');
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '# Terminal de Inicialização - PersonalPessoal Mobile',
    '# Clique no botão verde de play ao lado dos comandos para simular a execução.',
    '# Isso ajudará a entender o fluxo de criação do seu app real!'
  ]);
  const [executedCommands, setExecutedCommands] = useState<Record<string, boolean>>({});

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render Folder Tree Nodes
  const FileTreeNode = ({ node, depth = 0 }: { node: FileNode; depth: number; key?: React.Key }) => {
    const [isOpen, setIsOpen] = useState(depth < 2); // Open root and app folder by default
    const isFolder = node.type === 'folder';

    const handleSelect = () => {
      if (node.code || node.description) {
        setSelectedFile(node);
      }
      if (isFolder) {
        setIsOpen(!isOpen);
      }
    };

    return (
      <div className="select-none font-mono text-sm">
        <div
          onClick={handleSelect}
          style={{ paddingLeft: `${depth * 16}px` }}
          className={`flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors ${
            selectedFile?.name === node.name
              ? 'bg-accent/10 text-accent border-l-2 border-accent'
              : 'hover:bg-zinc-800/40 text-zinc-300'
          }`}
        >
          {isFolder ? (
            <span className="text-zinc-500">
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          ) : (
            <span className="w-3.5" />
          )}

          <span className={isFolder ? 'text-amber-400 font-semibold' : 'text-zinc-300'}>
            {isFolder ? '📁' : '📄'} {node.name}
          </span>
          <span className="text-xs text-zinc-500 truncate max-w-xs hidden md:inline">
            — {node.description}
          </span>
        </div>

        {isFolder && isOpen && node.children && (
          <div className="border-l border-zinc-800 ml-3.5 my-0.5">
            {node.children.map((child, idx) => (
              <FileTreeNode key={idx} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Terminal commands definition
  const cliCommands = [
    {
      id: 'step1',
      title: '1. Criar novo app Expo com TypeScript',
      command: 'npx create-expo-app gymdemocra-mobile -t expo-template-blank-typescript',
      mockResult: [
        '✔ Creating Expo app in gymdemocra-mobile...',
        '✔ Installing dependencies...',
        '✔ TypeScript configuration generated.',
        '🚀 Project gymdemocra-mobile created successfully!',
        '💡 Run: cd gymdemocra-mobile'
      ]
    },
    {
      id: 'step2',
      title: '2. Entrar na pasta e instalar o Supabase Client e dependências cruciais',
      command: 'cd gymdemocra-mobile && npm install @supabase/supabase-js @react-native-async-storage/async-storage lucide-react-native',
      mockResult: [
        'added 14 packages, and audited 845 packages in 4s',
        '✔ Installed @supabase/supabase-js',
        '✔ Installed @react-native-async-storage/async-storage (Required for keeping user logged in!)',
        '✔ Installed lucide-react-native (For beautiful standard icons)'
      ]
    },
    {
      id: 'step3',
      title: '3. Instalar Expo Router para Navegação por Abas (Tabs)',
      command: 'npx expo install expo-router react-native-safe-area-context react-native-screens expo-status-bar',
      mockResult: [
        '✔ Aligning peer dependencies for Expo SDK...',
        '✔ Installed expo-router and router requirements!',
        '💡 Configure app.json to enable routing scheme: "scheme": "gymdemocra"'
      ]
    },
    {
      id: 'step3_5',
      title: '3.5 Instalar biblioteca de Google Sign-In nativo',
      command: 'npx expo install @react-native-google-signin/google-signin',
      mockResult: [
        '✔ Installing @react-native-google-signin/google-signin...',
        '✔ Config plugin registrado automaticamente para Expo Prebuild!',
        '💡 Info: Este plugin permite integrar o Google Sign-In nativo de forma extremamente limpa e profissional.'
      ]
    },
    {
      id: 'step4',
      title: '4. Instalar e Configurar Tailwind CSS (NativeWind)',
      command: 'npm install nativewind@2.0.11 && npm install -D tailwindcss@3.3.2',
      mockResult: [
        '✔ Installed nativewind and tailwindcss.',
        '💡 Next Steps:',
        '  1. Run "npx tailwindcss init" to create tailwind.config.js',
        '  2. Update tailwind.config.js content paths',
        '  3. Add nativewind/babel plugin to babel.config.js'
      ]
    },
    {
      id: 'step5',
      title: '5. Iniciar o servidor de desenvolvimento do Expo',
      command: 'npx expo start',
      mockResult: [
        'Starting project at /workspace/gymdemocra-mobile',
        'Developer tools running on http://localhost:8081',
        '',
        '› Press a for Android emulator',
        '› Press i for iOS simulator',
        '› Press w for web preview',
        '› Press r to reload app',
        '',
        'Logs connected. Ready to test onboarding and workout flow!'
      ]
    }
  ];

  const runTerminalCommand = (cmdId: string, commandText: string, results: string[]) => {
    setExecutedCommands(prev => ({ ...prev, [cmdId]: true }));
    setTerminalOutput(prev => [
      ...prev,
      `\n$ ${commandText}`,
      ...results,
      '✔ Concluído com sucesso!'
    ]);
  };

  const clearTerminal = () => {
    setTerminalOutput(['# Console limpo. Pronto para novos comandos.']);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-full shadow-2xl">
      {/* Header Tabs */}
      <div className="bg-zinc-950 border-b border-zinc-800 p-4 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 block"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500 block"></span>
          <span className="w-3 h-3 rounded-full bg-green-500 block"></span>
          <span className="text-zinc-400 font-mono text-xs ml-2">Console do Arquiteto Sênior</span>
        </div>

        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium font-sans transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-accent text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <BarChart2 size={14} />
            Dashboard Analítico
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium font-sans transition-colors ${
              activeTab === 'supabase'
                ? 'bg-accent text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Database size={14} />
            Banco de Dados (SQL)
          </button>
          <button
            onClick={() => setActiveTab('folder')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium font-sans transition-colors ${
              activeTab === 'folder'
                ? 'bg-accent text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <FolderTree size={14} />
            Estrutura de Pastas
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium font-sans transition-colors ${
              activeTab === 'terminal'
                ? 'bg-accent text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Terminal size={14} />
            Guia de Inicialização
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-220px)] min-h-[500px]">
        {activeTab === 'dashboard' && (
          <AnalyticalDashboard />
        )}

        {activeTab === 'supabase' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 font-sans">
                <Database className="text-accent" />
                Esquema PostgreSQL pronto para Supabase
              </h2>
              <p className="text-zinc-400 text-sm mt-1 font-sans">
                Abaixo está o script SQL projetado para garantir alto desempenho, segurança e consistência relacional.
                Ele cria as tabelas de <code className="text-accent">usuarios</code>, <code className="text-accent">exercicios</code> (catálogo pré-populado), <code className="text-accent">fichas_treino</code> e <code className="text-accent">treino_exercicios</code>.
              </p>
            </div>

            {/* Architecture Explanations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  Garantia de Integridade Relacional
                </h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans">
                  As chaves estrangeiras utilizam <code className="text-zinc-300">ON DELETE CASCADE</code>. Se um usuário deletar sua conta, suas fichas de treinos e históricos de exercícios são limpos imediatamente, evitando lixo órfão no Supabase.
                </p>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  Row Level Security (RLS) Ativo
                </h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans">
                  Segurança em nível de linha do PostgreSQL. As tabelas estão blindadas: usuários só podem ver ou editar seus próprios treinos e perfis de peso. O catálogo de exercícios é de leitura pública.
                </p>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  Índices de Performance Criados
                </h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans">
                  Índices criados nas colunas <code className="text-zinc-300">usuario_id</code> e <code className="text-zinc-300">ficha_treino_id</code> para garantir carregamentos em milissegundos dentro da academia, mesmo sob conexões móveis fracas (3G/4G).
                </p>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  Sincronização com Supabase Auth
                </h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans">
                  Inclui um Trigger automático (<code className="text-zinc-300">on_auth_user_created</code>) que cria um perfil correspondente no banco de dados assim que o usuário se cadastra no Auth do Supabase.
                </p>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 md:col-span-2 space-y-1.5">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  Configuração de Google OAuth + Supabase Auth
                </h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans">
                  Para habilitar o login nativo do Google com segurança no Supabase Auth:
                </p>
                <ol className="list-decimal list-inside text-xs text-zinc-450 space-y-1 ml-1 font-sans">
                  <li>Acesse o <strong className="text-zinc-300">Google Cloud Console</strong> e crie uma credencial de <strong className="text-zinc-300">ID do cliente OAuth (Aplicativo da Web)</strong>.</li>
                  <li>No painel do seu projeto <strong className="text-zinc-300">Supabase</strong>, vá em <strong className="text-accent">Authentication ➔ Providers ➔ Google</strong>.</li>
                  <li>Ative o provedor e insira o seu <strong className="text-zinc-300">Web Client ID</strong> e o <strong className="text-zinc-300">Client Secret</strong>.</li>
                  <li>Na sua aplicação móvel, utilize o método <code className="text-accent font-mono">supabase.auth.signInWithIdToken()</code> enviando o ID Token nativo retornado pelo Google Sign-In no celular. Isso evita popups e redirecionamentos web confusos para o atleta!</li>
                </ol>
              </div>
            </div>

            {/* SQL Block with copy button */}
            <div className="relative">
              <div className="absolute right-4 top-4 z-10 flex gap-2">
                <button
                  onClick={() => copyToClipboard(supabaseSQL)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white p-2 rounded-lg text-xs font-semibold flex items-center gap-1 border border-zinc-700 transition-colors"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  {copied ? 'Copiado!' : 'Copiar SQL'}
                </button>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 overflow-x-auto max-h-[350px]">
                <pre className="text-xs font-mono text-zinc-300 leading-relaxed whitespace-pre">
                  {supabaseSQL}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'folder' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 font-sans">
                <FolderTree className="text-accent" />
                Estrutura de Pastas Recomendada (Expo SDK 51+)
              </h2>
              <p className="text-zinc-400 text-sm mt-1 font-sans">
                Uma arquitetura limpa focada em modularidade usando o <code className="text-accent">Expo Router (File-based Navigation)</code>.
                Clique nas pastas e arquivos para ver seus detalhes e modelos de código prontos.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* File tree browser */}
              <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-xl p-4 min-h-[300px]">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 font-sans">
                  Navegador do Projeto
                </h3>
                <div className="space-y-1">
                  <FileTreeNode node={projectFilesTree} depth={0} />
                </div>
              </div>

              {/* Code/Info Viewer */}
              <div className="lg:col-span-7 flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 font-mono">
                    <Code2 size={14} className="text-accent" />
                    {selectedFile ? selectedFile.name : 'Selecione um Arquivo'}
                  </span>
                  {selectedFile?.code && (
                    <button
                      onClick={() => copyToClipboard(selectedFile.code || '')}
                      className="text-zinc-400 hover:text-white hover:bg-zinc-800 p-1.5 rounded transition-colors text-xs flex items-center gap-1"
                    >
                      <Copy size={12} />
                      Copiar Código
                    </button>
                  )}
                </div>

                <div className="p-4 flex-1">
                  {selectedFile ? (
                    <div className="space-y-4">
                      <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80">
                        <h4 className="text-xs font-bold text-accent font-sans">FUNÇÃO/DETALHE DO ARQUITETO:</h4>
                        <p className="text-sm text-zinc-300 mt-1 font-sans leading-relaxed">{selectedFile.description}</p>
                      </div>

                      {selectedFile.code ? (
                        <div>
                          <h4 className="text-xs font-semibold text-zinc-500 mb-2 font-sans">ESBOÇO INICIAL DE IMPLEMENTAÇÃO:</h4>
                          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 overflow-x-auto max-h-[300px]">
                            <pre className="text-xs font-mono text-zinc-300 leading-relaxed whitespace-pre">
                              {selectedFile.code}
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <p className="text-sm text-zinc-500 font-sans">Este diretório organiza múltiplos arquivos e subpastas.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <FolderTree size={36} className="text-zinc-700 mb-2" />
                      <p className="text-sm text-zinc-400 font-sans font-medium">Selecione qualquer arquivo na árvore ao lado</p>
                      <p className="text-xs text-zinc-500 font-sans mt-1">Veja a função técnica e o template de código sugerido.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 font-sans">
                <Terminal className="text-accent" />
                Comandos de Inicialização (Passo a Passo)
              </h2>
              <p className="text-zinc-400 text-sm mt-1 font-sans">
                Siga esta sequência lógica de comandos no terminal do seu computador para gerar o aplicativo com Expo e as chaves de conexão integradas.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Commands List */}
              <div className="lg:col-span-5 space-y-3">
                {cliCommands.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 hover:border-zinc-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 font-sans">{item.title}</h4>
                      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 flex items-center justify-between mt-2">
                        <code className="text-xs font-mono text-accent truncate select-all">{item.command}</code>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-900">
                      <button
                        onClick={() => copyToClipboard(item.command)}
                        className="text-[10px] text-zinc-500 hover:text-white flex items-center gap-1 font-sans"
                      >
                        <Copy size={11} /> Copiar comando
                      </button>
                      <button
                        onClick={() => runTerminalCommand(item.id, item.command, item.mockResult)}
                        className={`text-[11px] font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition-all ${
                          executedCommands[item.id]
                            ? 'bg-zinc-800 text-green-500 cursor-default'
                            : 'bg-green-600 hover:bg-green-500 text-zinc-950 font-semibold'
                        }`}
                        disabled={executedCommands[item.id]}
                      >
                        {executedCommands[item.id] ? (
                          <>✔ Executado</>
                        ) : (
                          <>
                            <Play size={10} fill="currentColor" /> Simular no Terminal
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Terminal Simulator Console */}
              <div className="lg:col-span-7 flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden h-[400px]">
                <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-zinc-400 flex items-center gap-1.5">
                    <Terminal size={14} className="text-green-500" />
                    bash - terminal@gymdemocra-arch
                  </span>
                  <button
                    onClick={clearTerminal}
                    className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-2 py-1 rounded transition-colors font-sans"
                  >
                    Limpar Terminal
                  </button>
                </div>
                <div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-green-400 space-y-1.5 leading-relaxed bg-black/90">
                  {terminalOutput.map((line, idx) => (
                    <div
                      key={idx}
                      className={
                        line.startsWith('$')
                          ? 'text-white font-bold mt-2'
                          : line.startsWith('#')
                          ? 'text-zinc-500 font-sans italic'
                          : line.startsWith('✔')
                          ? 'text-green-400 font-semibold'
                          : 'text-zinc-300'
                      }
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
