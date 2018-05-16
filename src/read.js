const db = require('./db')

const QUERIES = {
	get_non_friends: "select id from person where id not in \
					(select friend_id from friendship where person_id=$1) and \
					id not in (select person_id from friendship where friend_id=$1) \
					and id!=$1",
	get_friends: 'select friend_id from friendship where person_id=$1',
	get_people_for_search: "select * from person where name ~* $2 or id=$1"
}
// get_people_for_search sorgusunda isim girilmemisse $1 yerine - at

// Bu fonksiyon isme veya id'ye gore veritabanindan kisileri alip dondurur
async function searchForPeople(personId='', personName='-') {

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

			}
			
			console.log(res.rows)
			console.log(`Row count: ${res.rowCount}... first row:${res.rows[0]}`)
			
		}).catch(err => {
			console.log(err)
		})

	return searchResults
}
/*

// searchForPeople kullanimi
searchForPeople('', 'can').then(res => {

	res.forEach(e => {
		
		console.log(`${e.id} - ${e.name}`)
	})
})
*/