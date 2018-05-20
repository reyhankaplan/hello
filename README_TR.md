# hello

Lojistik regresyon kullanılarak arkadaş öneri sistemi oluşturulması, 4. Mühendislik Projesi

## Genel Bakış

Backend uygulaması:

PostgreSQL veritabanı kullanır. (Veritabanını oluşturmak için `files/` dizininde script bulunmaktadır.).

Veritabanını, `npm run db:write` komutu ile, repo'nun `files/` dizinindeki veriler ile doldurur.

`http://localhost:3000` üzerinde çalışır.

İki çeşit get request'i cevaplar: 

Birincisi `/person?name=<person_name>&id=<person_id>` isminde <person_name> içeren veya <person_id>'sine sahip olan
kişileri response olarak gönderir.

İkincisi `/hello?id=<person_id>&iter=<iter_count>&step=<step_size>` belirtilen kişi için arkadaş önerileri ve
gradient descent ile hesaplanan katsayıları cevap olarak gönderir. `iter` ve `step` zorunlu değildir.

Her `/hello?...` request'leri için model ve test seti oluşturur, gradient descent ile katsayıları hesaplar 
(her aktivitenin arkadaşlıklarımıza olan etkilerini), ve test setinden en olası 10 arkadaş önerisini tahmin eder.

Request'lerde `id` parametresi gönderdiğimizde o id keskin bir değer olmalıdır, ancak `name` yani isim gönderdiğimizde
ismin içerisinde geçebilecek bir ifade de yeterli olabilir.

## Client

[ryhnnl/mpaos](https://github.com/ryhnnl/mpaos), React.js ile yazılmış client uygulaması.

## İndirme

Git clone: 

`git clone git@github.com:ryhnnl/hello.git`

Proje dizinine git:

`cd hello`

Paketleri indir:

`npm i`

## Çalıştırma

Server'ı çalıştırmak için:

`npm run start:dev`

## Veritabanı

files/ dizininde verilen script'in yardımı ile veritabanını oluştur.
.env dosyasını kendi veritabanına uyarla.
Verileri veritabanına yazmak için bu komutu çalıştır:

`npm run write:db`

## Veri Hakkında

Projede kullanılan veri dersi alan öğrencilerden alınmıştır. 15 adet aktiviteye 0 ile 10 arasında puanlar verilmiştir.
Ve dersi alan 10 arkadaş seçilmiştir.

Uygulama arkadaşlarımızı 1 ile, arkadaşımız olmayanların yarısını ise 0 ile etiketleyerek model oluşturur. Diğer yarım ise
test verisini oluşturur ve arkadaş önerileri onların arasından seçilir.
