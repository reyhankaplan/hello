const express = require('express')

const findSuggestions = require('./src/hello')
const { searchInPeople } = require('./src/read.js')

const app = express()

app.get('/person', (req, res) => {

	let id = req.query.id || ''
	let name = req.query.name || '-'

	searchInPeople(id, name).then(r => {

		if(r.message) {
			res.send(r.message)
		}else {
			res.send(r)
		}

	})

})

app.get('/hello', (req, res) => {
	
	if(!req.query.id) {
		res.end('missing person id')
	}
	console.log(req.query.id)

	let iterCount = req.query.iter || 10000
	let stepSize = req.query.step || 0.001

	console.log(`Step size: ${stepSize}\nIteration count: ${iterCount}`)

	findSuggestions(req.query.id, iterCount, stepSize).then(r => {

		console.log(r)
		res.send(r)
	})
})

app.listen(3000)