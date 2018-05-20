const db = require('./db')

// Veritabanı sorguları sabit olarak tanımlanır
const QUERIES = {
	get_non_friends: "select id from person where id not in \
					(select friend_id from friendship where person_id=$1) and \
					id not in (select person_id from friendship where friend_id=$1) \
					and id!=$1",
	get_friends: 'select friend_id from friendship where person_id=$1',
	get_people_for_search: "select * from person where name ~* $2 or id=$1",
	get_profile: "select * from profile where id=$1",
	get_person: "select * from person where id=$1",
}

// Bu fonksiyon isme veya id'ye gore veritabanından kişileri okur ve döndürür
// Uygulamada id (okul numarası) veya isme göre arama kısmında kullanılır
async function searchInPeople(personId='', personName='-') {

	let searchResults = []

	await 
	db(
		{
			text:QUERIES.get_people_for_search, 
			values:[personId, personName]
		}
		).then(res => {

			if(res.rowCount > 0) {

				searchResults = res.rows

			} else {
				searchResults = {message: 'there is no person with given id or name'}
			}
			
		}).catch(err => {
			console.log(err)
		})

	return searchResults
}
/*

// Örnek kullanımı:

searchInPeople('', 'can').then(res => {

	res.forEach(e => {
		
		console.log(`${e.id} - ${e.name}`)
	})
})

*/

// Bu fonksiyon id'si verilen kişinin arkadaşlarını ve arkadaşı olmayanları getirir
async function getRelatedPeople(personId) {
	let friends = []
	let nonfriends = []

	await 
	db(
		{
			text:QUERIES.get_friends, 
			values:[personId]
		}
		).then(res => {

			if(res.rowCount > 0) {

				friends = res.rows

			}

		}).catch(err => {
			console.log(err)
		})

	await 
	db(
		{
			text:QUERIES.get_non_friends, 
			values:[personId]
		}
		).then(res => {

			if(res.rowCount > 0) {

				nonfriends = res.rows

			}
			
		}).catch(err => {
			console.log(err)
		})

	return {friends, nonfriends}
}
/*

// Örnek Kullanımı:

getRelatedPeople('2014123024').then(res => {

	res.friends.forEach(e => {

		console.log(`Hello, my friend... ${e.friend_id}`)	
	})
	
	res.nonfriends.forEach(e => {

		console.log(`Hello, man... ${e.id}`)	
	})
})

*/
// Bu fonksiyon verilen id'ye göre kişinin profilini döndürür
async function getProfile(personId) {

	let profile = {id: personId, values:[]}

	await 
	db(
		{
			text:QUERIES.get_profile, 
			values:[personId]
		}
		).then(res => {

			if(res.rowCount > 0) {
				
				let obj = Object.assign({}, res.rows[0])

				delete obj.id

				for(let property in obj) {

					profile.values.push(obj[property])
				}
			}
			
			
		}).catch(err => {
			console.log(err)
		})	

	return profile
}
/*

// Örnek kullanımı:

getProfile('2014123024').then(res => {

	console.log(res)
})

*/

// Bu fonksiyon id'ye göre kişiyi döndürür
async function getPerson(personId) {

	let person
	
	await 
	db(
		{
			text:QUERIES.get_person, 
			values:[personId]
		}
		).then(res => {

			if(res.rowCount > 0) {

				person = res.rows[0]

			}

		}).catch(err => {
			console.log(err)
		})

	return person
}
/*

// Örnek kullanımı:

getPerson('2014123024').then(res => {
	console.log(res)
})

*/

module.exports = { searchInPeople, getRelatedPeople, getProfile, getPerson }
