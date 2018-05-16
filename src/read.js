cont db = require('./db')

const QUERIES = {
	get_non_friends = "select id from person where id not in \
					(select friend_id from friendship where person_id='$1') and \
					id not in (select person_id from friendship where friend_id='$1') \
					and id!='$1'",
	get_friends = 'select friend_id from friendship where person_id=$1',
	get_people_for_search = "select * from person where name ~* '$1' or id='$2'"
}
// get_people_for_search sorgusunda isim girilmemisse $1 yerine - at
