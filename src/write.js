/*
	Projenin ana dizininden
	npm run db:write
	komutu calıştırılarak, 
	ödev için verilen xlsx ve csv dosyalarındaki verilerin 
	PostgreSQL veritabanına yazılması sağlanır.
*/

// Veritabanı işlemleri için kullanılan db modülü (./db.js dosyası)
const db = require('./db')

// xlsx ve csv uzantılı dosyaları okumak icin kullanılan modül (npm ile yüklendi)
const Excel = require('exceljs')

// Dosyaların isimleri ve kullanılacak sorgular sabit tanımlanır
const xlsxStudentList = './files/ogrenciListesi.xlsx'
const csvStudentProfile = './files/ogrenciProfil.csv'
const csvStudentNetwork = './files/ogrenciNetwork.csv'

const QUERIES = {
	add_person: 'insert into person (id, name) values($1, $2)',
	add_profile: 'insert into profile \
						(id, i1, i2, i3, i4, i5, i6, i7, i8, i9, i10, i11, i12, i13, i14, i15) \
						values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)',
	add_friendship: 'INSERT INTO friendship \
						(person_id, friend_id) \
    					values ($1, $2);',
}

//----------------------------------------------------------------------------------------------------

// Process biterken bildirir
process.on('exit', (code) => {
  
  console.log(`About to exit with code: ${code}`);

});

// Aşağıdaki tanımlanan fonksiyonlar çağırılır ve yazma işlemi yapılır
readXlsxFileWriteToDB()
readCsvFileWriteToDBforFriendship()
readCsvFileWriteToDBforProfile()

//----------------------------------------------------------------------------------------------------

// Bu fonksiyon ogrenciListesi.xlsx dosyasındaki verileri okuyup 
// düzenleyerek veritabanına kaydeder

function readXlsxFileWriteToDB() {

	// XLSX dosyasını okumak icin workbook adında nesne olusturulur
	let workbook = new Excel.Workbook()

	// Bu nesne sayesinde ismini global sabit olarak tanımladığımız dosyayı okuyoruz
	workbook.xlsx.readFile(xlsxStudentList).then(
		() => {
			// Bu nesne bir excel kitabı gibi düşünülebilir
			// kitabın her sayfasını okumak icin eachSheet methodu kullanılır
			workbook.eachSheet(
				(worksheet, sheetId) => {
					// worksheet burada sayfayı temsil eder
					let rowCount = worksheet.rowCount
					// rowCount: veri olan son satırın numarası
					// bizim dosyamızda ilk satırda başlık var
					// yani 2 numarali satırdan okumaya başlıyoruz
					let startingIndex = 2

					// Her satıra erişmek için döngü
					while (startingIndex <= rowCount) {
						// 1. hücre okul numarası yani id
						// 2. hücre isim
						let row = worksheet.getRow(startingIndex)

						// PostgreSQL veritabanına veri eklenir
						db(
							{
								text:QUERIES.add_person,
								values: [
											String(row.getCell(1)),
											toUpperFirstLetter(String(row.getCell(2)))
										]
							}
						).then((res) => {
							if(res.rowCount == 1) {
								console.log('Person inserted...')
							}
						})
						.catch((err) => {
							console.log(`Error: ${err}`)
						})

						startingIndex++
					}

					console.log(
						`Row count: ${rowCount}.... Column count: ${worksheet.columnCount}`
					)
			})
	})
}

// Bu fonksiyon ogrenciNetwork.csv dosyasındaki verileri okur ve veritabanına kaydeder
function readCsvFileWriteToDBforFriendship() {

	workbook = new Excel.Workbook()

	workbook.csv.readFile(csvStudentNetwork).then((worksheet) => {
		// eachRow ile dosyanın satırları gezilir
		// includeEmpty: true ile boş olan satırları da kapsar
		worksheet.eachRow(
			{
				includeEmpty: false,
			},
			function(row, rowNumber) {
				// Satırın bütün hücrelerinde gezilir
				row.eachCell(
					{
						includeEmpty: false,
					},
					function(cell, colNumber) {

						if(colNumber == 1) {
							return
						}

						console.log(colNumber)
						console.log(`${row.getCell(1).value} ---> ${cell.value}`)
						// PostgreSQL veritabanına veri eklenir
						db(
							{
								text:QUERIES.add_friendship,
								values: [
											row.getCell(1).value,
											cell.value
										]
							}
						).then((res) => {
							if(res.rowCount == 1) {
								console.log('Friendship inserted...')
							}
						})
						.catch((err) => {
							console.log(`Error: ${err}`)
						})
					}
				)
			}
		)

		console.log(
			`Row count: ${worksheet.rowCount}.... Column count: ${worksheet.columnCount}`
		)
	})

}

// Bu fonksiyon ogrenciProfil.csv dosyasındaki verileri okur ve veritabanına kaydeder
function readCsvFileWriteToDBforProfile() {

	workbook = new Excel.Workbook()

	workbook.csv.readFile(csvStudentProfile).then((worksheet) => {
		// eachRow ile dosyanın satırları gezilir
		// includeEmpty: true ile bos olan satırları da kapsar
		worksheet.eachRow(
			{
				includeEmpty: false,
			},
			function(row, rowNumber) {
				// Satırın bütün hücrelerinde gezilir

				let cells = []
				row.eachCell(
					{
						includeEmpty: false,
					},
					function(cell, colNumber) {

						cells.push(cell.value)
					}
				)

				// PostgreSQL veritabanına veri eklenir
				db(
					{
						text:QUERIES.add_profile,
						values: cells
					}
				).then((res) => {
					if(res.rowCount == 1) {
						console.log('Profile inserted...')
					}
				})
				.catch((err) => {
					console.log(`Error: ${err}`)
				})
			}
		)

		console.log(
			`Row count: ${worksheet.rowCount}.... Column count: ${worksheet.columnCount}`
		)
	})

}

// Veritabanına kaydederken ilk harfleri büyük yapmak için kullanılan fonksiyon
function toUpperFirstLetter(expr) {
	expr = expr.toLocaleLowerCase()

	let names = expr.split(' ')

	names.forEach((element, index) => {
		names[index] = element.replace(
			element.charAt(0),
			element.charAt(0).toLocaleUpperCase()
		)
	})

	return names.join(' ')
}
