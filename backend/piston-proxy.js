const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.post('/execute', async (req, res) => {
  try {
    const response = await fetch('http://localhost:2000/api/v2/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    })
    const data = await response.json()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => {
  console.log('🔧 Piston proxy running on http://localhost:3001')
})