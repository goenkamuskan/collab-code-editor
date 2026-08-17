const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const PISTON_INTERNAL_URL = process.env.PISTON_URL || 'http://localhost:2000/api/v2/execute'

app.post('/execute', async (req, res) => {
  try {
    const response = await fetch(PISTON_INTERNAL_URL, {
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

app.listen(process.env.PORT || 3001, () => {
  console.log('🔧 Piston proxy running')
})