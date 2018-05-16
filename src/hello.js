const { getRelatedPeople, getProfile, getPerson } = require('./read.js')

const { gradientDescent, possiblity } = require('./regression.js')

async function createDataSets(personId) {

	let model = []
	let testSet = []

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

createDataSets('2014123024').then(res => {

	let f = gradientDescent(res.model, 100, 0.001, 15)
	console.log(f)

	res.testSet.forEach(e => {
		e.p = possiblity(e.x, f, 15)
		//console.log(`${e.id} ${e.p}`)
	})

	res.testSet.sort((a,b) =>b.p > a.p)
	console.log(res.testSet)

	let suggestions = res.testSet.slice(undefined, 10)

	suggestions.forEach(e => {

		getPerson(e.id).then(res => {
			console.log(res)
		})
	})

})
