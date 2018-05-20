/*
	Oluşturulan veri seti taslağı:
	data: [
				{
					id: kisi id 
					x: [(0-10), (0-10), ...]
					y: etiket (1|0) 
				},
		 ...]
*/

/*
	Verilen pseudo kodu örnek alınarak yazılan gradientDescent fonksiyonu.
 	İterasyon sayısını, adım boyutunu, özellik sayısını ve verisetini parametre olarak alır.
 	Yukarıdaki veri seti taslağına göre açıklarsak,
 	her bir x değerinin y etiket değerine etkisini gösteren katsayıları döndürür.
*/
function gradientDescent(data, maxIterCount=1000, stepSize=0.01, attributeCount=15) {

	let N = data.length
	let factors = Array(attributeCount+1).fill(1) 
	// 16 tane birden olusan array
	// Katsayilarin baslangic degerleri birdir

	for(let t = 0; t < maxIterCount; t++ ) {

		let parenthesis = 0

		let newFactors = Array(attributeCount+1).fill(1)
		
		for( let i = 0; i < N; i++ ) {

			parenthesis += possiblity(data[i].x, factors, attributeCount) - data[i].y

		}

		newFactors[0] = factors[0] - stepSize * (1 / N) * parenthesis

		for( let j = 0; j < attributeCount; j++ ) {

			parenthesis = 0

			for( let i = 0; i < N; i++ ) {

				parenthesis += (possiblity(data[i].x, factors, attributeCount) - data[i].y) * data[i].x[j]

			}			

			newFactors[ j + 1 ] = factors[j + 1] - stepSize * (1 / N) * parenthesis
		}

		factors = newFactors
	}

	return factors
}

/*
	dataVector: xi'ler, yani kişinin her bir özellik için verdiği 1-10 arasındaki puanlardır
	factors: katsayılar, sayısı xi'lerin sayısından bir fazla
	Verilen dökümanda formülü verilen, arkadaşlık olasılığını hesaplayan fonksiyon
*/
function possiblity(dataVector, factors, attributeCount=15) {

	let tempSum = factors[0]

	for (let i = 0; i < attributeCount; i++) {

		tempSum += dataVector[i] * factors[i+1]
	}

	return (1 / (1 + Math.exp(-tempSum)))
}

/*
// Modülün uydurulan bir verisetinde örnek kullanımı

let f =	gradientDescent(
			[
				{
					id: '0',
					x: [4, 5, 0, 3, 4, 7],
					y: 1,
				},
				{
					id: '1',
					x: [3, 6, 1, 4, 5, 6],
					y: 1,
				},
				{
					id: '2',
					x: [5, 6, 1, 4, 5, 6],
					y: 1,
				},
				{
					id: '3',
					x: [3, 4, 0, 2, 3, 8],
					y: 0,
				},
				{
					id: '4',
					x: [8, 2, 6, 9, 8, 9],
					y: 0,
				},
				{
					id: '5',
					x: [0, 1, 1, 8, 9, 6],
					y: 0,
				},
			],
			10000,
			0.01,
			6
		)

console.log(`Sonuc: ${possiblity([0, 1, 1, 8, 9, 6], f, 6)}`)
console.log(`Sonuc: ${possiblity([2, 3, 1, 6, 7, 9], f, 6)}`)
console.log(`Sonuc: ${possiblity([4, 5, 0, 3, 4, 7], f, 6)}`)

*/

module.exports = {gradientDescent, possiblity}