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

const ROOM_NAME = 'room-abc123' // TODO: generate/read this dynamically later (Milestone 6 territory)

function App() {
  const [language, setLanguage] = useState(LANGUAGES[0])
  const [connected, setConnected] = useState(false)

  // Refs, not state — these are long-lived objects (doc, provider, binding),
  // not values that should trigger a re-render when they change.
  const ydocRef = useRef(null)
  const providerRef = useRef(null)
  const bindingRef = useRef(null)

  // Create the Yjs doc + Hocuspocus connection ONCE when the app mounts.
  useEffect(() => {
    const ydoc = new Y.Doc()
    const provider = new HocuspocusProvider({
      url: 'ws://localhost:1234',
      name: ROOM_NAME,
      document: ydoc,
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
    })

    ydocRef.current = ydoc
    providerRef.current = provider

    // Cleanup when App unmounts: tear down in reverse order of creation.
    return () => {
      bindingRef.current?.destroy()
      provider.destroy()
      ydoc.destroy()
    }
  }, [])

  // Called by @monaco-editor/react once the actual Monaco editor instance exists.
  // This is where we bind Yjs to the editor's text model.
  const handleEditorMount = (editor) => {
    const ydoc = ydocRef.current
    const provider = providerRef.current

    // getText('monaco') creates (or reuses) a shared text type inside the doc,
    // named 'monaco'. Every client connecting to the same room + same name
    // shares this same text.
    const ytext = ydoc.getText('monaco')

    const binding = new MonacoBinding(
      ytext,
      editor.getModel(),
      new Set([editor]),
      provider.awareness, // powers live cursors later (Milestone 3) — harmless to pass now
    )

    bindingRef.current = binding
  }

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    // Content is no longer reset here — see explanation above.
    // Only the syntax-highlighting language changes for now.
  }

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-[#d4d4d4]">

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
          {/* Language selector */}
          <div className="flex bg-[#3e3e3e] rounded overflow-hidden">
            {LANGUAGES.map(lang => (
              <button
                key={lang.value}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-1 text-xs transition-colors ${
                  language.value === lang.value
                    ? 'bg-violet-600 text-white'
                    : 'text-[#888] hover:text-[#d4d4d4]'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Run button */}
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
  )
}

export default App