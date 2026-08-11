import { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { MonacoBinding } from 'y-monaco'

const LANGUAGES = [
  { label: 'Python', value: 'python', starter: '# Write your Python code here\n\ndef main():\n    print("Hello, World!")\n\nmain()' },
  { label: 'JavaScript', value: 'javascript', starter: '// Write your JavaScript code here\n\nfunction main() {\n  console.log("Hello, World!");\n}\n\nmain();' },
  { label: 'C++', value: 'cpp', starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}' },
  { label: 'Java', value: 'java', starter: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
]

const ROOM_NAME = 'room-test1'

function App() {
  const [language, setLanguage] = useState(LANGUAGES[0])
  const [connected, setConnected] = useState(false)
  const [files, setFiles] = useState({})       // { fileId: { name, language } }
  const [activeFileId, setActiveFileId] = useState(null)

  const languageRef = useRef(language)
  const ydocRef = useRef(null)
  const providerRef = useRef(null)
  const bindingRef = useRef(null)
  const editorRef = useRef(null)
  const yFilesRef = useRef(null)

  useEffect(() => {
    languageRef.current = language
  }, [language])

  // Connect once
  useEffect(() => {
    const ydoc = new Y.Doc()
    const provider = new HocuspocusProvider({
      url: 'ws://localhost:1234',
      name: ROOM_NAME,
      document: ydoc,
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
    })

    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    provider.awareness.setLocalStateField('user', {
      name: `User-${Math.floor(Math.random() * 1000)}`,
      color: randomColor,
    })

    const yFiles = ydoc.getMap('files')
    yFilesRef.current = yFiles

    const syncFilesToState = () => {
      setFiles({ ...yFiles.toJSON() })
    }
    yFiles.observe(syncFilesToState)

    provider.on('synced', () => {
      if (yFiles.size === 0) {
        // First person in the room — create a default file.
        const id = `file-${Date.now()}`
        yFiles.set(id, { name: 'main.py', language: 'python' })
        ydoc.getText(`file:${id}`).insert(0, LANGUAGES[0].starter)
        setActiveFileId(id)
      } else {
        setActiveFileId(Object.keys(yFiles.toJSON())[0])
      }
      syncFilesToState()
    })

    ydocRef.current = ydoc
    providerRef.current = provider

    return () => {
      yFiles.unobserve(syncFilesToState)
      bindingRef.current?.destroy()
      provider.destroy()
      ydoc.destroy()
    }
  }, [])

  // Rebind editor whenever the active file changes
  useEffect(() => {
    if (!activeFileId || !editorRef.current || !ydocRef.current) return

    bindingRef.current?.destroy()

    const ydoc = ydocRef.current
    const ytext = ydoc.getText(`file:${activeFileId}`)
    const fileMeta = files[activeFileId]
    if (fileMeta) {
      const lang = LANGUAGES.find(l => l.value === fileMeta.language) || LANGUAGES[0]
      setLanguage(lang)
    }

    bindingRef.current = new MonacoBinding(
      ytext,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      providerRef.current.awareness,
    )
  }, [activeFileId, files])

  const handleEditorMount = (editor) => {
    editorRef.current = editor
  }

  const handleNewFile = () => {
    const name = prompt('File name (e.g. utils.js):')
    if (!name) return
    const ext = name.split('.').pop()
    const langMap = { py: 'python', js: 'javascript', cpp: 'cpp', java: 'java' }
    const lang = langMap[ext] || 'javascript'

    const id = `file-${Date.now()}`
    const yFiles = yFilesRef.current
    yFiles.set(id, { name, language: lang })
    setActiveFileId(id)
  }

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-[#d4d4d4]">

      {/* Sidebar */}
      <div className="w-48 bg-[#252526] border-r border-[#3e3e3e] flex flex-col flex-shrink-0">
        <div className="flex items-center justify-between px-3 h-9 text-xs font-medium text-[#888] uppercase tracking-wide">
          Files
          <button onClick={handleNewFile} className="text-[#888] hover:text-white text-base leading-none">+</button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {Object.entries(files).map(([id, file]) => (
            <div
              key={id}
              onClick={() => setActiveFileId(id)}
              className={`px-3 py-1.5 text-sm cursor-pointer truncate ${
                activeFileId === id ? 'bg-[#37373d] text-white' : 'text-[#ccc] hover:bg-[#2a2d2e]'
              }`}
            >
              {file.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-11 bg-[#2d2d2d] border-b border-[#3e3e3e] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-violet-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <span className="text-sm font-medium text-[#d4d4d4]">CollabCode</span>
            <span className="text-[#555] text-sm">•</span>
            <span className="text-sm text-[#888]">{ROOM_NAME}</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
              title={connected ? 'Connected' : 'Disconnected'}
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <path d="M2 1l7 4-7 4V1z"/>
              </svg>
              Run
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={language.value}
            onMount={handleEditorMount}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16 },
              fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
            }}
          />
        </div>
      </div>

    </div>
  )
}

export default App