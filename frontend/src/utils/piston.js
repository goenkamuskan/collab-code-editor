const PISTON_URL = 'http://localhost:3001/execute'
const PISTON_LANG_MAP = {
  python: { language: 'python', version: '3.12.0' },
  javascript: { language: 'javascript', version: '20.11.1' },
  cpp: { language: 'c++', version: '10.2.0' },
  java: { language: 'java', version: '15.0.2' },
}

export async function runCode(language, code) {
  const config = PISTON_LANG_MAP[language]
  if (!config) throw new Error(`Unsupported language: ${language}`)

  const res = await fetch(PISTON_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: config.language,
      version: config.version,
      files: [{ content: code }],
    }),
  })

  if (!res.ok) throw new Error(`Piston API error: ${res.status}`)
  return res.json()
}