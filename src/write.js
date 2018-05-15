/**
 *
 *	Projenin ana dizininden
 *	npm run db:write
 *	komutu calistirilarak, 
 *	dosyalardaki verilerin PostgreSQL veritabanina yazilmasi saglanir
 *	Veritabaninin baglanti bilgileri .env dosyasindadir
 *
 **/

const db = require('./db')
// Veritabanina sorgu gonderen ayri bir javascript dosyasinda yazilan modul
const Excel = require('exceljs')
// xlsx ve csv uzantili dosyalari okumak icin kullanilan hazir modul

const xlsxStudentList = './files/ogrenciListesi.xlsx'
const csvStudentProfile = './files/ogrenciProfil.csv'
const csvStudentNetwork = './files/ogrenciNetwork.csv'

// db baglantisini denedim exceljs'i de denedim
// ikisi ile veriyi db'ye atacagim

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

// Yapilacak islem kalmadiginda process biterken bitttigini logla
process.on('exit', (code) => {
  
  console.log(`About to exit with code: ${code}`);

});

// Asagida yazilan fonksiyonlar cagirilarak veriler veri tabanina yazilir
readXlsxFileWriteToDB()
readCsvFileWriteToDBforFriendship()
readCsvFileWriteToDBforProfile()

//----------------------------------------------------------------------------------------------------

// Bu fonksiyon ogrenciListesi.xlsx dosyasindaki verileri okuyup 
// duzenleyerek veritabanina kaydeder

function readXlsxFileWriteToDB() {

	// XLSX dosyasini okumak icin workbook adinda nesne olusturuyoruz
	let workbook = new Excel.Workbook()

	// Bu nesne sayesinde ismini global sabit olarak tanimladigimiz dosyayi okuyoruz
	workbook.xlsx.readFile(xlsxStudentList).then(
		() => {
			// Bu nesne bir excel kitabi gibi dusunulebilir
			// kitabin her sayfasini okumak icin eachSheet methodu kullaniliyor
			workbook.eachSheet(
				(worksheet, sheetId) => {
					// worksheet burada sayfayi temsil ediyor
					let rowCount = worksheet.rowCount
					// rowCount: veri olan son satirin numarasi
					// bizim dosyamizda ilk satirda baslik var
					// yani 2 numarali satirdan okumaya baslayacagiz
					let startingIndex = 2

					// Her satira erismek icin dongu
					while (startingIndex <= rowCount) {
						// 1. hucre okul numarasi yani id
						// 2. hucre isim
						let row = worksheet.getRow(startingIndex)
/*
						// Console'a isimlerin yazilmasi
						console.log(
							`|oo| ${String(
								row.getCell(1)
							)}\t ${toUpperFirstLetter(
								String(row.getCell(2))
							)}`
						)
*/
						// PostgreSQL veritabanina veri ekleniyor
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


// Bu fonksiyon ogrenciNetwork.csv dosyasindaki verileri okur ve veriabanina kaydeder
function readCsvFileWriteToDBforFriendship() {

	workbook = new Excel.Workbook()

	workbook.csv.readFile(csvStudentNetwork).then((worksheet) => {
		// eachRow ile dosyanin satirlari gezilir
		// includeEmpty: true ile bos olan satirlari da kapsar
		worksheet.eachRow(
			{
				includeEmpty: false,
			},
			function(row, rowNumber) {
				// Satirin butun hucrelerinde gezilir
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
						// PostgreSQL veritabanina veri ekleniyor
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
function readCsvFileWriteToDBforProfile() {

	workbook = new Excel.Workbook()

	workbook.csv.readFile(csvStudentProfile).then((worksheet) => {
		// eachRow ile dosyanin satirlari gezilir
		// includeEmpty: true ile bos olan satirlari da kapsar
		worksheet.eachRow(
			{
				includeEmpty: false,
			},
			function(row, rowNumber) {
				// Satirin butun hucrelerinde gezilir

				let cells = []
				row.eachCell(
					{
						includeEmpty: false,
					},
					function(cell, colNumber) {

						cells.push(cell.value)
					}
				)

				// PostgreSQL veritabanina veri ekleniyor
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
