const { Pool } = require('pg')

/*
	Bu fonksiyon PostgreSQL veritabanı ile iletişim kurmak için
	Pool nesnesi oluşturur ve o nesne üzerinden sorgular göndermeyi
	sonuçları almayı sağlar
	Veritabanı bağlantı bilgileri .env dosyası içerisindedir 
*/
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
// Örnek kullanımı:
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
