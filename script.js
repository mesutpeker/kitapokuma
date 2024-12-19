// Varsayılan kriterler
const defaultCriteria = [
    "1. Okuma\namacını\nbelirler",
    "2. Metni\nözetler",
    "3. Metnin\niletisini\nbelirler",
    "4. Kurgu ve\ngerçek unsurları\nayırt eder",
    "5. Görüşlerini\nöğretmen ve\narkadaşlarıyla\nkarşılaştırır",
    "6. Metni\nönceki metinlerle\nkarşılaştırır",
    "7. Çatışmalara\nalternatif\nçözümler üretir",
    "8. Çıkarım ve\nkanıtlar\noluşturur",
    "9. Metinle ilgili\ntartışma\nargümanları üretir",
    "10. Öğretici\nbir örnek metin\noluşturur"
];

let criteria = [...defaultCriteria]; // Aktif kriterleri sakla

// Global fonksiyonları önce tanımla
window.addStudent = function() {
    const nameInput = document.getElementById('studentName');
    const book1Input = document.getElementById('book1Points');
    const book2Input = document.getElementById('book2Points');

    const name = nameInput.value.trim();
    const book1Total = parseInt(book1Input.value);
    const book2Total = parseInt(book2Input.value);

    // Form validasyonu
    if (!name) {
        alert('Lütfen öğrenci adını giriniz');
        return;
    }

    if (!book1Total || book1Total < 0 || book1Total > 100) {
        alert('1. Kitap için lütfen 0-100 arası puan giriniz');
        return;
    }

    if (!book2Total || book2Total < 0 || book2Total > 100) {
        alert('2. Kitap için lütfen 0-100 arası puan giriniz');
        return;
    }

    // Aynı isimde öğrenci kontrolü
    if (students.some(student => student.name === name)) {
        alert('Bu isimde bir öğrenci zaten mevcut');
        return;
    }

    // Öğrenciyi ekle
    students.push({
        name,
        book1Scores: distributeCriteriaPoints(book1Total),
        book2Scores: distributeCriteriaPoints(book2Total)
    });

    // Tabloları güncelle ve kaydet
    updateTables();
    saveToLocalStorage();

    // Formları temizle
    nameInput.value = '';
    book1Input.value = '';
    book2Input.value = '';
};

window.editStudent = function(index) {
    const student = students[index];
    const popup = document.getElementById('editPopup');
    
    // Form alanlarını doldur
    document.getElementById('editStudentIndex').value = index;
    document.getElementById('editStudentName').value = student.name;
    document.getElementById('editBook1Points').value = student.book1Scores.reduce((a, b) => a + b, 0);
    document.getElementById('editBook2Points').value = student.book2Scores.reduce((a, b) => a + b, 0);
    
    // Popup'ı göster
    popup.style.display = 'flex';
};

window.closePopup = function() {
    document.getElementById('editPopup').style.display = 'none';
};

window.editCriteria = function() {
    const popup = document.getElementById('criteriaPopup');
    const inputsContainer = document.getElementById('criteriaInputs');
    inputsContainer.innerHTML = '';

    // Her kriter için bir textarea oluştur
    criteria.forEach((criterion, index) => {
        const group = document.createElement('div');
        group.className = 'criteria-input-group';
        
        const label = document.createElement('label');
        label.textContent = `Kriter ${index + 1}:`;
        
        const textarea = document.createElement('textarea');
        textarea.value = criterion.replace(/\n/g, ' ');
        textarea.id = `criterion${index}`;
        textarea.placeholder = `${index + 1}. kriter metnini girin`;
        
        group.appendChild(label);
        group.appendChild(textarea);
        inputsContainer.appendChild(group);
    });

    popup.style.display = 'flex';
};

window.saveCriteria = function() {
    // Tüm kriterleri textarealardan al
    criteria = Array.from({ length: 10 }, (_, i) => {
        const textarea = document.getElementById(`criterion${i}`);
        // Metni satırlara böl (her 2-3 kelimede bir)
        const words = textarea.value.trim().split(' ');
        let lines = [];
        let currentLine = [];
        let currentLength = 0;

        words.forEach(word => {
            if (currentLength + word.length > 15) { // Satır uzunluk limiti
                lines.push(currentLine.join(' '));
                currentLine = [word];
                currentLength = word.length;
            } else {
                currentLine.push(word);
                currentLength += word.length + 1;
            }
        });
        if (currentLine.length > 0) {
            lines.push(currentLine.join(' '));
        }
        return lines.join('\n');
    });

    // Kriterleri güncelle ve kaydet
    updateCriteriaDisplay();
    saveToLocalStorage();
    closeCriteriaPopup();
};

window.closeCriteriaPopup = function() {
    document.getElementById('criteriaPopup').style.display = 'none';
};

window.saveEdit = function() {
    const index = parseInt(document.getElementById('editStudentIndex').value);
    const name = document.getElementById('editStudentName').value.trim();
    const book1Total = parseInt(document.getElementById('editBook1Points').value);
    const book2Total = parseInt(document.getElementById('editBook2Points').value);

    // Validasyon
    if (!name) {
        alert('Lütfen öğrenci adını giriniz');
        return;
    }

    if (!book1Total || book1Total < 0 || book1Total > 100) {
        alert('1. Kitap için lütfen 0-100 arası puan giriniz');
        return;
    }

    if (!book2Total || book2Total < 0 || book2Total > 100) {
        alert('2. Kitap için lütfen 0-100 arası puan giriniz');
        return;
    }

    // Aynı isimde başka öğrenci var mı kontrol et
    const nameExists = students.some((student, i) => i !== index && student.name === name);
    if (nameExists) {
        alert('Bu isimde bir öğrenci zaten mevcut');
        return;
    }

    // Öğrenci bilgilerini güncelle
    students[index] = {
        name,
        book1Scores: distributeCriteriaPoints(book1Total),
        book2Scores: distributeCriteriaPoints(book2Total)
    };

    // Tabloları güncelle ve kaydet
    updateTables();
    saveToLocalStorage();
    closePopup();
};

window.deleteStudent = function(index) {
    if (confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
        students.splice(index, 1);
        updateTables();
        saveToLocalStorage();
    }
};

window.clearTables = function() {
    if (confirm('Tüm öğrenci bilgileri silinecek. Emin misiniz?')) {
        students = [];
        updateTables();
        localStorage.clear(); // Tüm localStorage'ı temizle
        
        // Başlıkları varsayılan haline getir
        document.getElementById('mainTitle').value = "KARAMAN MESLEKİ VE TEKNİK ANADOLU LİSESİ TÜRK DİLİ VE EDEBİYATI KİTAP OKUMA ÖLÇEĞİ";
        document.getElementById('subTitle').value = "Okuma Becerileri Değerlendirme Kriterleri";
        document.getElementById('book1Title').value = "1. Kitap";
        document.getElementById('book2Title').value = "2. Kitap";
        updateTitles();
    }
};

window.printTables = function() {
    window.print();
};

// Öğrenci verilerini tutacak dizi
let students = [];

// Sayfa yüklendiğinde localStorage'dan verileri yükle
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateTitles();
    updateCriteriaDisplay();
});

// Input değişikliklerini dinle
document.getElementById('mainTitle').addEventListener('input', updateTitles);
document.getElementById('subTitle').addEventListener('input', updateTitles);
document.getElementById('book1Title').addEventListener('input', updateTitles);
document.getElementById('book2Title').addEventListener('input', updateTitles);

// Başlıkları güncelleme fonksiyonu
function updateTitles() {
    const mainTitle = document.getElementById('mainTitle').value;
    const subTitle = document.getElementById('subTitle').value;
    const book1Title = document.getElementById('book1Title').value;
    const book2Title = document.getElementById('book2Title').value;
    
    // Tüm ana başlıkları güncelle
    document.querySelectorAll('.main-title').forEach(title => {
        title.textContent = mainTitle;
    });

    // Tüm alt başlıkları güncelle
    document.querySelectorAll('.criteria-header').forEach(header => {
        header.textContent = subTitle;
    });

    // Kitap başlıklarını güncelle
    document.querySelector('.book1-title').textContent = book1Title;
    document.querySelector('.book2-title').textContent = book2Title;
}

// Kriterleri tablolarda göster
function updateCriteriaDisplay() {
    ['criteriaRow1', 'criteriaRow2'].forEach(rowId => {
        const row = document.getElementById(rowId);
        row.innerHTML = ''; // Mevcut kriterleri temizle
        
        criteria.forEach(criterion => {
            const th = document.createElement('th');
            th.innerHTML = criterion;
            row.appendChild(th);
        });
    });
}

// Puanları kriterlere dağıtma fonksiyonu
function distributeCriteriaPoints(totalPoints) {
    const criteriaCount = 10;
    // Her kritere başlangıçta 5 puan ver
    const scores = Array(criteriaCount).fill(5);
    let remainingPoints = totalPoints - (5 * criteriaCount);

    if (remainingPoints < 0) {
        // Eğer toplam puan 50'den azsa, her kritere en az 5 vermek mümkün değil.
        // Bu durumda eldekileri 5'er 5'er verip bitiriyoruz (geri kalan 0 olur).
        const adjustedScores = Array(criteriaCount).fill(0);
        let pointsToDistribute = totalPoints;
        for (let i = 0; i < criteriaCount && pointsToDistribute >= 5; i++) {
            adjustedScores[i] = 5;
            pointsToDistribute -= 5;
        }
        return adjustedScores;
    }

    // Kalan puanları 5'er 5'er, 10 puanı geçmeyecek şekilde dağıt
    while (remainingPoints >= 5) {
        // Hala 10'dan az puanı olan kriterleri bul
        const availableIndices = scores
            .map((score, index) => ({ index, score }))
            .filter(c => c.score < 10)
            .map(c => c.index);

        if (availableIndices.length === 0) break;

        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        scores[randomIndex] += 5; // 5 puan ekle
        remainingPoints -= 5;
    }

    return scores;
}

// Tabloları güncelleme
function updateTables() {
    updateTable('book1TableBody', 'book1Scores');
    updateTable('book2TableBody', 'book2Scores');
}

// Tek bir tabloyu güncelleme
function updateTable(tableId, scoresKey) {
    const tbody = document.getElementById(tableId);
    if (!tbody) return;

    tbody.innerHTML = '';
    
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        
        // Öğrenci adı
        row.innerHTML = `<td>${student.name}</td>`;
        
        // Kriter puanları
        student[scoresKey].forEach(score => {
            row.innerHTML += `<td>${score}</td>`;
        });
        
        // Toplam puan ve işlem butonları
        const total = student[scoresKey].reduce((a, b) => a + b, 0);
        
        row.innerHTML += `
            <td>${total}</td>
            <td class="no-print">
                <button onclick="editStudent(${index})" class="edit-btn">Düzenle</button>
                <button onclick="deleteStudent(${index})" class="delete-btn">Sil</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// LocalStorage'a kaydetme
function saveToLocalStorage() {
    try {
        localStorage.setItem('students', JSON.stringify(students));
        localStorage.setItem('mainTitle', document.getElementById('mainTitle').value);
        localStorage.setItem('subTitle', document.getElementById('subTitle').value);
        localStorage.setItem('book1Title', document.getElementById('book1Title').value);
        localStorage.setItem('book2Title', document.getElementById('book2Title').value);
        localStorage.setItem('criteria', JSON.stringify(criteria));
    } catch (error) {
        console.error('Veriler kaydedilirken hata oluştu:', error);
    }
}

// LocalStorage'dan yükleme
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('students');
        const mainTitle = localStorage.getItem('mainTitle');
        const subTitle = localStorage.getItem('subTitle');
        const book1Title = localStorage.getItem('book1Title');
        const book2Title = localStorage.getItem('book2Title');
        const savedCriteria = localStorage.getItem('criteria');
        
        if (saved) {
            students = JSON.parse(saved);
            updateTables();
        }
        
        if (mainTitle) document.getElementById('mainTitle').value = mainTitle;
        if (subTitle) document.getElementById('subTitle').value = subTitle;
        if (book1Title) document.getElementById('book1Title').value = book1Title;
        if (book2Title) document.getElementById('book2Title').value = book2Title;
        if (savedCriteria) {
            criteria = JSON.parse(savedCriteria);
        }
        updateTitles();
    } catch (error) {
        console.error('Veriler yüklenirken hata oluştu:', error);
        localStorage.removeItem('students');
        students = [];
        criteria = [...defaultCriteria];
    }
}