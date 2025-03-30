// Google Sheets API'yi başlatma
function start() {
    gapi.client.init({
        'apiKey': 'YOUR_GOOGLE_API_KEY',
        'discoveryDocs': ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function() {
        console.log("Google Sheets API bağlantısı başarılı.");
    });
}

// Kullanıcı giriş işlemi
function login() {
    const userEmail = prompt("E-posta adresinizi girin:");
    checkPaymentStatus(userEmail);
}

// Kullanıcı ödeme durumu kontrolü
function checkPaymentStatus(userEmail) {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: 'A:B', // Ödeme bilgileri sütunu
    }).then(function(response) {
        const data = response.result.values;
        let paymentStatus = "Ödeme yapılmadı";
        
        data.forEach(function(row) {
            if (row[0] === userEmail) {
                paymentStatus = row[1]; // Ödeme durumu
            }
        });

        if (paymentStatus === "Ödeme Yapıldı") {
            showExamList();
        } else {
            alert("Önce ödeme yapmanız gerekiyor!");
        }
    });
}

// Sınav listesine yönlendirme
function showExamList() {
    document.getElementById("exams").style.display = "block";
}

// Ödeme işlemi
function processPayment() {
    const paymentStatus = prompt("Ödeme yapıldı mı? (Evet/Hayır)");

    if (paymentStatus.toLowerCase() === "evet") {
        const userEmail = prompt("E-posta adresinizi girin:");
        savePaymentStatus(userEmail);
    }
}

// Ödeme durumu kaydetme
function savePaymentStatus(userEmail) {
    const values = [
        [userEmail, "Ödeme Yapıldı"]
    ];
    const body = {
        values: values
    };

    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: 'A:B',
        valueInputOption: 'RAW',
        resource: body
    }).then((response) => {
        alert("Ödeme durumu kaydedildi!");
    });
}

// Sınav sayfasına gitme
function showExam(exam) {
    document.getElementById("exam-title").innerText = exam.toUpperCase();
    document.getElementById("exam-details").style.display = "block";
    setupCountdown(exam);
    setupProgress();
}

// Geri sayım başlatma
function setupCountdown(exam) {
    let countdownTime = 60 * 60; // 1 saat
    let countdownDisplay = document.getElementById("countdown-" + exam);
    countdownDisplay.innerText = formatTime(countdownTime);
    
    setInterval(function() {
        countdownTime--;
        countdownDisplay.innerText = formatTime(countdownTime);
    }, 1000);
}

// Zaman formatını düzenleme
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;
    return `${hours}:${minutes}:${secondsLeft}`;
}

// Kullanıcı ilerlemesini takip etme
function setupProgress() {
    let completedTopics = 0;
    const totalTopics = 10; // Her sınav için toplam konu sayısı
    document.getElementById("completed-topics").innerText = completedTopics;

    // Konu tamamlandığında ilerleme artacak
    document.querySelector("button").addEventListener("click", function() {
        if (completedTopics < totalTopics) {
            completedTopics++;
            document.getElementById("completed-topics").innerText = completedTopics;
        }
    });
}

// Ödeme sonrası erişim sayfası
function showAccessPage() {
    // Sadece ödeme yapan kullanıcılar erişebilecek
    alert("Erişiminiz onaylandı!");
}
