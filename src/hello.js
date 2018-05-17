const { getRelatedPeople, getProfile, getPerson } = require('./read.js')

const { gradientDescent, possiblity } = require('./regression.js')

async function createDataSets(personId) {

	let person
	let model = []
	let testSet = []

	await
	getPerson(personId).then(res => {
		person = res
	})

	// veritabaninda boyle biri yoksa undefined doner

	if(!person) {
		console.log(`there is no one with given id`)
		return 
	}

	await 
	getRelatedPeople(personId).then(res => {

		res.friends.forEach(e => {

			model.push({id: e.friend_id, y:1})
			// console.log(`Hello, my friend... ${e.friend_id}`)	
		})
		
		res.nonfriends.forEach((e, index, arr) => {

			if(index < arr.length/2) {
				
				model.push({id: e.id, y:0})				
			}else {

				testSet.push({id: e.id})
			}

			// console.log(`Hello, man... ${e.id}`)	
		})
	})

	for(let i = 0; i < model.length; i++) {
		
		await getProfile(model[i].id).then(res => {

			model[i].x = res.values
		})
	}

	for(let i = 0; i < testSet.length; i++) {

		await getProfile(testSet[i].id).then(res => {

			testSet[i].x = res.values
		})
	}
	// console.log('-------------------------MODEL--------------------------------------------')
	// console.log('--------------------------------------------------------------------------')
	// console.log(model)
	// console.log('--------------------------------------------------------------------------')
	// console.log('-------------------------TEST-SET-----------------------------------------')
	// console.log(testSet)

	return {model, testSet}

}

// Verilen kisi id'sine gore arkadas onerilerini bulur
async function findSuggestions(personId, iterCount=100, stepSize=0.01) {

	let data

	await 
	createDataSets(personId)
	.then(res => {

		data = res

	})


	if(!data) {

		return {message: 'person not found with the id'}
	}

	let f = gradientDescent(data.model, iterCount, stepSize, 15)
	// console.log(f)

	data.testSet.forEach(e => {
		e.p = possiblity(e.x, f, 15)
		// console.log(`${e.id} ${e.p}`)
	})

	await bubbleSort(data.testSet)

	// console.log(data.testSet)

	let suggestions = data.testSet.slice(0, 10)

	for(let i = 0; i < suggestions.length; i++) {

		await getPerson(suggestions[i].id).then(res => {
			suggestions[i].name = res.name
		})
	}

	return {suggestions, f}
}
/*
findSuggestions('2014123024', 100, 0.01).then(res => {
	console.log(res.f)
	console.log(res.suggestions)
})
*/
async function bubbleSort(set) {

	for(let i = 0; i < set.length; i++) {

		for (let j = i+1; j < set.length; j++) {

			if(set[i].p < set[j].p) {

				let tmp = set[i]
				set[i] = set[j]
				set[j] = tmp
			}
		}
	}

	return set
	
}

module.exports = findSuggestions