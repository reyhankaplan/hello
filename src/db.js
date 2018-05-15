const { Pool } = require('pg')

// Bu fonksiyon PostgreSQL veritabanina sorgular gonderir ve cevaplari dondurur
// Promise dondurur

let db = (() => {
	const pool = new Pool()

	pool.on('error', (error) => {
		console.log(`[ERROR] :: pool :: ${error}`)
		throw new Error(`Pool error`)
	})
	return async (query) => {
		const client = await pool.connect()
		let response = null
		try {
			res = await client.query(query)
		} finally {
			client.release()
		}

		return res
	}
})()

/*
// ornek kullanimi
db(
 	`SELECT table_name FROM information_schema.tables\
    WHERE table_schema='public' AND table_type='BASE TABLE'`
 )
 	.then((res) => {
 		console.log(res)
 	})
 	.catch((err) => {
 		console.log(err)
 	})
 */

module.exports = db
