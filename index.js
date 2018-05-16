const express = require('express')

const app = express()

app.get('/person', (req, res) => {
	res.send(`Hello ${req.query.name}!`)
})

app.listen(3000)