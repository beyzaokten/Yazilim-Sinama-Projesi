const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL bağlantı bilgileri
const pool = new Pool({
    user: 'postgres', // PostgreSQL kullanıcı adınız
    host: 'localhost',
    database: 'kullaniciVeritabani', // PostgreSQL veritabanı adınız
    password: 'sgaftabs', // PostgreSQL şifreniz
    port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ana giriş sayfasını göster
app.get('/', (req, res) => {
    res.render('anaGiris.ejs'); // anaGiris.ejs dosyasını render et
});



app.post('/selectUserType', (req, res) => {
    const userType = req.body.userType;

    // Kullanıcı tipine göre yönlendirme
    if (userType === 'customer') {
        res.render('isVerenKayit.ejs'); // Müşteri sayfasını servis et
    } else if (userType === 'jobseeker') {
        res.render('isArayanKayit.ejs'); // İş Arayan sayfasını servis et
    } else {
        res.status(400).send('Bilinmeyen kullanıcı tipi'); // Hatalı istek (bad request) durumunu döndür
    }
});


// Kayıt işlemini gerçekleştir
app.post('/submit', (req, res) => {
    const { isim, soyisim, email, sifre, ulke } = req.body;

    // PostgreSQL'ye bağlan
    pool.connect((err, client, done) => {
        if (err) {
            console.error('PostgreSQL bağlantı hatası:', err);
            res.status(500).send('Sunucu hatası');
            return;
        }

        console.log('PostgreSQL\'ye bağlanıldı');

        // Veriyi ekle
        const query = 'INSERT INTO kullanicilar (isim, soyisim, email, sifre, ulke) VALUES ($1, $2, $3, $4, $5)';
        const values = [isim, soyisim, email, sifre, ulke];

        client.query(query, values, (err, result) => {
            done(); // PostgreSQL bağlantısını serbest bırak

            if (err) {
                console.error('Veri ekleme hatası:', err);
                res.status(500).send('Sunucu hatası');
                return;
            }

            console.log('Veri başarıyla eklendi');
            res.status(200).send('Kayıt başarıyla eklendi');
        });
    });
});

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor`);
});
