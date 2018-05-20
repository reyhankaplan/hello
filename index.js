const express = require('express')
const cors = require('cors')

const findSuggestions = require('./src/hello')
const { searchInPeople } = require('./src/read.js')

const app = express()

app.use(cors())

app.get('/person', (req, res) => {

	let id = req.query.id || ''
	let name = req.query.name || '-'

	searchInPeople(id, name).then(r => {

		if(r.message) {
			res.send(r)
		}else {
			res.send(r)
		}

	})

})

app.get('/hello', (req, res) => {
	
	if(!req.query.id) {
		res.end({message: 'missing person id'})
	}

	let iterCount = req.query.iter || 1000
	let stepSize = req.query.step || 0.01

	findSuggestions(req.query.id, iterCount, stepSize).then(r => {

		res.send(r)
	})
})

app.listen(3000)