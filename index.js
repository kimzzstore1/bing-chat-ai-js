const express = require('express')
const bing = require('./bing')
const app = express()
const port = process.env.PORT || 8000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({result: "Welcome"})
})

app.get('/chat', async (req, res) => {
  const question = req.query.question
  const result = await bing.bot(question)

  res.json({result: result})
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
