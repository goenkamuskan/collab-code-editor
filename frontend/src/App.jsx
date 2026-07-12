import { useState } from 'react'
import Editor from '@monaco-editor/react'

const LANGUAGES = [
  { label: 'Python', value: 'python', starter: '# Write your Python code here\n\ndef main():\n    print("Hello, World!")\n\nmain()' },
  { label: 'JavaScript', value: 'javascript', starter: '// Write your JavaScript code here\n\nfunction main() {\n  console.log("Hello, World!");\n}\n\nmain();' },
  { label: 'C++', value: 'cpp', starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}' },
  { label: 'Java', value: 'java', starter: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
]

function App() {
  const [language, setLanguage] = useState(LANGUAGES[0])
  const [code, setCode] = useState(LANGUAGES[0].starter)

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    setCode(lang.starter)
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
          <span className="text-sm text-[#888]">room-abc123</span>
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
          value={code}
          onChange={(val) => setCode(val || '')}
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