const { getRelatedPeople, getProfile, getPerson } = require('./read.js')

const { gradientDescent, possiblity } = require('./regression.js')

/*
	Bu dosyada diğer dosyalarda yazılan fonksiyonlar kullanılarak parçalar birleştirilmiş
	ve arkadaş önerilerini döndüren fonksiyon export edilmiştir.
*/

// Bu fonksiyon veritabanından verileri okur ve verisetini oluşturur.
async function createDataSets(personId) {

	let person
	let model = []
	let testSet = []

	// Kişinin veritabanında varlığı kontrol edilir

	await
	getPerson(personId).then(res => {
		person = res
	})

	// veritabanında böyle biri yoksa undefined döner
	if(!person) {
		console.log(`there is no one with given id`)
		return 
	}

	// Kişinin arkadaşı olan ve olmayan kişiler bulunur

	await 
	getRelatedPeople(personId).then(res => {

		// Arkadaşların tamamı modele eklenir
		res.friends.forEach(e => {

			model.push({id: e.friend_id, y:1})	
		})
		
		// Arkadaşı olmayan kişilerin yarısı modele yarısı test setine eklenir
		res.nonfriends.forEach((e, index, arr) => {

			if(index < arr.length/2) {
				
				model.push({id: e.id, y:0})				
			}else {

				testSet.push({id: e.id})
			}
		})
	})

	// Modeldeki kişilerin profil bilgileri de modele eklenir
	for(let i = 0; i < model.length; i++) {
		
		await getProfile(model[i].id).then(res => {

			model[i].x = res.values
		})
	}

	// Test verisindeki kişilerin profil bilgileri test setine eklenir
	for(let i = 0; i < testSet.length; i++) {

		await getProfile(testSet[i].id).then(res => {

			testSet[i].x = res.values
		})
	}

	// model ve test seti döndürülür
	return {model, testSet}
}

// Bu fonksiyonda verilen parametrelere göre arkadaş önerileri döndürülür
async function findSuggestions(personId, iterCount=1000, stepSize=0.01) {

	let data

	// Veri seti oluşturulur
	await 
	createDataSets(personId)
	.then(res => {

		data = res

	})

	// Kişi bulunamadığında mesaj döndürür
	if(!data) {

		return {message: 'person not found with the id'}
	}

	// Katsayılar hesaplanır
	let f = gradientDescent(data.model, iterCount, stepSize, 15)

	// Test seti arkadaş olma olasılığını hesaplayan fonksiyona gönderilir
	data.testSet.forEach(e => {
		e.p = possiblity(e.x, f, 15)
	})

	// Test seti p değerlerine göre sıralanır
	await bubbleSort(data.testSet)

	// Test setinden olasılığı yüksek olan ilk 10 kişi öneri olarak alınır
	let suggestions = data.testSet.slice(0, 10)

	// Önerilen kişilerin isimleri eklenir
	for(let i = 0; i < suggestions.length; i++) {

		await getPerson(suggestions[i].id).then(res => {
			suggestions[i].name = res.name
		})
	}
	// Öneriler ve katsayılar döndürülür
	return {suggestions, f}
}
/*

// Örnek kullanımı:

findSuggestions('2014123024', 100, 0.01).then(res => {
	console.log(res.f)
	console.log(res.suggestions)
})

*/

// Test setini sıralamak için kullanılan asenkron fonksiyon
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