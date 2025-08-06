function initTasksTable() {
  if (!$.fn.DataTable.isDataTable('#tasksTable')) {
      
    tasksTable = $('#tasksTable').DataTable({
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/tr.json"
      },
      dom: 'f<t>lip',
      pageLength: 10,
      responsive: true,
      order: [],
      columnDefs: [{ orderable: false, targets: 1 }]
    });
  } else {
    tasksTable = $('#tasksTable').DataTable();
  }
}

function aktiflestirTooltipVeSil(target) {
   // alert("aktifleştir fonk çalıştı");
  $(target).find('[data-bs-toggle="tooltip"]').tooltip();
  $(target).find('.sil-btn').on('click', function (e) {
    if (!confirm('Bu görevi silmek istediğinize emin misiniz?')) {
      e.preventDefault();
    }
  });
}


let tamamlananlar = 0;  


  function control(tamamlananSayi2){
      tamamlananlar = tamamlananSayi2;
 
  }

function guncelleScoreBar() {
  const toplamTaskSayisi = document.querySelectorAll('#task-body tr').length;
  const toplamGorevler = tamamlananlar + toplamTaskSayisi;

  const yuzdelik = toplamGorevler > 0 
    ? Math.round((tamamlananlar / toplamGorevler) * 100) 
    : 0;
  


  const progressBar = document.getElementById('scoreProgress');
  if (progressBar) {
    progressBar.style.width = `${yuzdelik}%`;
    progressBar.setAttribute('aria-valuenow', yuzdelik);
    progressBar.textContent = `Görevlerini %${yuzdelik} oranında tamamladın!`;
  }

  const emojiSpan = document.getElementById("emojiDurum");
  if (emojiSpan) {
    if (yuzdelik === 0) emojiSpan.textContent = "😴";
    else if (yuzdelik < 25) emojiSpan.textContent = "😐";
    else if (yuzdelik < 50) emojiSpan.textContent = "🙂";
    else if (yuzdelik < 75) emojiSpan.textContent = "😎";
    else if (yuzdelik < 100) emojiSpan.textContent = "🔥";
    else emojiSpan.textContent = "🏆";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  guncelleScoreBar();

  const taskBody = document.getElementById('task-body');
  if (taskBody) {
    const observer = new MutationObserver(guncelleScoreBar);
    observer.observe(taskBody, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
  }
});
let uyari ="";
function uyarii(a){

 uyari = a;
}
function sendCommand() {
    //alert("Komut gönderiliyor...");
  const inputElem = document.getElementById('commandInput');
  const input = inputElem.value.trim();

  if (!input) return;

  const responseElem = document.getElementById('commandResponse');
  responseElem.innerText = "⏳ Gönderiliyor...";
  uyarii();

 
 

  fetch('/komut', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ command: input })
  })
  .then(async res => {
    if (!res.ok) throw new Error(`HTTP hata: ${res.status}`);
    const contentType = res.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      responseElem.innerText = `✅ Cevap: ${data.message || 'Başarılı'}`;
    } else {
      const text = await res.text();
      responseElem.innerText = `✅ Cevap: ${text}`;
    }

    inputElem.value = "";

    setTimeout(() => {
      location.reload();
    }, 800);
  })
  .catch(err => {
    responseElem.innerText = "❌ Bir hata oluştu.";
    console.error("HATA:", err);
    
  });

  
}
function acModal(e) {
  const modal = document.getElementById('gorevModal');
  modal.style.display = 'block';

  // Modal’ın konumunu tıklanan yerin biraz sağına/altına ayarla
  modal.style.left = (e.clientX + 15) + 'px';
  modal.style.top = (e.clientY + 15) + 'px';
}

 function selamMesajiFunc(displayName) {
  const selamElem = document.getElementById("selamMesajii");
  const saat = new Date().getHours();
  let selam = "Merhaba";
  let iconHtml = "";

  if (saat >= 5 && saat < 12) {
    selam = "Günaydın";
    iconHtml = '<i class="bi bi-sun-fill" style="color: orange; margin-right: 6px;"></i>';
  } else if (saat >= 12 && saat < 18) {
    selam = "İyi günler";
    iconHtml = '<i class="bi bi-cloud-sun-fill" style="color: gold; margin-right: 6px;"></i>';
  } else if (saat >= 18 && saat < 23) {
    selam = "İyi akşamlar";
    iconHtml = '<i class="bi bi-cloud-sunset-fill" style="color: tomato; margin-right: 6px;"></i>';
  } else {
    selam = "İyi geceler";
    iconHtml = '<i class="bi bi-moon-fill" style="color: lightblue; margin-right: 6px;"></i>';
  }

  selamElem.innerHTML = `${iconHtml} ${selam}, ${displayName}!`;
}
// Chatbox minimize toggle
// document.getElementById('minimizeChat').addEventListener('click',function() {
//   const chatbox = document.getElementById('chatbox');
//   const messages = document.getElementById('messages');
//   if (isChatMinimized) {
//     chatbox.style.height = '500px';
//     messages.style.display = 'block';
//     this.innerHTML = '<i class="bi bi-dash-lg"></i>';
//   } else {
   
//     chatbox.style.height = '60px';
//     messages.style.display = 'none';
//     this.innerHTML = '<i class="bi bi-plus-lg"></i>';
//   }
//   isChatMinimized = !isChatMinimized;
// });
// // Welcome message after 1 second
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    const messagesDiv = document.getElementById('messages');
    const welcomeMsg = document.createElement('div');
    welcomeMsg.innerHTML = `
       <div style="margin-bottom:15px; text-align:left;">
      <div style="display:inline-block; max-width:80%; background:#d80d0d; padding:8px 12px; border-radius:12px 12px 12px 0;">
      
          Dikkat! Bu yapay zeka sadece motivasyon için kullanıma uygundur.

        </div>
        <div></div>
        <div style="display:inline-block; max-width:80%; background:#3d3a56; margin-top:10px; padding:8px 12px; border-radius:12px 12px 12px 0;">
      
          Merhaba! Size nasıl yardımcı olabilirim?
        </div>
      </div>`;
    messagesDiv.appendChild(welcomeMsg);
  }, 1000);
});
// Oncelik secim butonlarına tıklama olayları
document.querySelectorAll('.oncelik-sec').forEach(el => {
 
  el.addEventListener('click', e => {
    e.preventDefault();
    const id = el.getAttribute('data-id');
    const value = el.getAttribute('data-value');
    window.location.href = `/oncelik/${value}?id=${id}`;
  });
});


function hesaplaKalanSure(deadlineStr, elem) {
  const [datePart, timePart] = deadlineStr.split(" ");
  const [day, month, year] = datePart.split(".");
  const [hour, minute] = timePart.split(":");

  const deadline = new Date(year, month - 1, day, hour, minute);
  const now = new Date();

  const fark = deadline - now;
  if (isNaN(deadline.getTime())) return "Tarih hatalı";
 if (fark <= 0) {
  elem.className = "kalan-sure text-danger fw-bold";
  elem.textContent = "⛔ Süre doldu";

  const satir = elem.closest("tr");
 const gorevAdi = satir.querySelector("td:first-child")?.innerText.trim() || "Görev";
  const bitis = deadlineStr;

  const expiredList = document.getElementById("expiredTasksList");
  if (expiredList && !elem.dataset.expiredAdded) {
    const li = document.createElement("li");
    li.style.cssText = `
      background:#2a2a3d;
      margin-bottom:8px;
      padding:8px 10px;
      border-radius:5px;
      border-left:3px solid #dc3545;
      display:flex;
      justify-content:space-between;
      align-items:center;
      color: #f87171;
    `;
    li.innerHTML = `
      <span>${gorevAdi}</span>
      <small style="color:#999; font-size:0.8rem;">${bitis}</small>
    `;

    expiredList.appendChild(li);
    elem.dataset.expiredAdded = "true"; // ✅ tekrar eklenmez
  }

  return "⛔ Süre doldu";
}


  const dakika = Math.floor(fark / 1000 / 60);
  const saat = Math.floor(dakika / 60);
  const gun = Math.floor(saat / 24);

  if (dakika < 30) {
    elem.className = "kalan-sure text-danger fw-bold";
    return `🔥 ${gun}g ${saat % 24}s ${dakika % 60}dk`;
  } else if (dakika < 120) {
    elem.className = "kalan-sure text-warning fw-semibold";
    return `🟠 ${gun}g ${saat % 24}s ${dakika % 60}dk`;
  } else if (saat < 24) {
    elem.className = "kalan-sure text-warning";
    return `🟡 ${gun}g ${saat % 24}s ${dakika % 60}dk`;
  } else {
    elem.className = "kalan-sure text-success";
    return `🟢 ${gun}g ${saat % 24}s ${dakika % 60}dk`;
  }
}


function kalanSureleriGuncelle() {
  document.querySelectorAll('.kalan-sure').forEach(elem => {
    const deadline = elem.getAttribute('data-deadline');
    elem.textContent = hesaplaKalanSure(deadline, elem);
  });
}

// Sayfa yüklendiğinde ve her dakika güncelle
document.addEventListener("DOMContentLoaded", () => {
  kalanSureleriGuncelle();
  setInterval(kalanSureleriGuncelle, 60000); // her 60 saniyede bir
});
document.getElementById('erteleSlider').addEventListener('input', (e) => {
  document.getElementById('erteleSure').textContent = e.target.value;
});

document.getElementById('erteleForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const sure = parseInt(document.getElementById('erteleSlider').value);
  const seciliTarih = document.getElementById('erteleTarih').value;
  const taskId = document.getElementById('erteleModal').dataset.taskId;

  const bodyData = seciliTarih
    ? { date: seciliTarih } // ISO formatta gönder
    : { minutes: sure };

  fetch(`/ertele/${taskId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyData)
  }).then(() => {
    location.reload();
  }).catch(err => {
    console.error("Hata oluştu:", err);
  });
});
document.querySelectorAll('.ertele-btn').forEach(btn => {
  btn.addEventListener('click', () => {
   
    const taskId = btn.dataset.id;
    const modal = document.getElementById('erteleModal');
    modal.dataset.taskId = taskId;
    new bootstrap.Modal(modal).show();
  });
});

let tasksTable;

$(document).ready(function () {
   initTasksTable();
   aktiflestirTooltipVeSil('#tasksTable'); 
});




function tamamlananlariListele() {
  const listElem = document.getElementById('tamamlananListe');
  listElem.innerHTML = "";

  document.querySelectorAll('#task-body tr').forEach(row => {
    const isDone = row.querySelector('.text-muted');
    if (isDone) {
      const id = row.querySelector('input[name="id"]')?.value;
      const name = isDone.textContent.trim();

      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";

      li.innerHTML = `
        <span class="text-muted"><del>${name}</del></span>
        <div class="btn-group">
          <form method="post">
            <input type="hidden" name="id" value="${id}"/>
            <button formaction="/opt/open" type="submit" class="btn btn-sm btn-outline-primary">
              <i class="bi bi-arrow-clockwise"></i>
            </button>
            <button formaction="/opt/trash" type="submit" class="btn btn-sm btn-outline-danger" onclick="return confirm('Silinsin mi?')">
              <i class="bi bi-trash3"></i>
            </button>
          </form>
        </div>
      `;

      listElem.appendChild(li);
    }
  });

}

document.getElementById('tamamlananPanel').addEventListener('show.bs.offcanvas', tamamlananlariListele);


// Chat ve Komut alanlarını gösterme fonksiyonları
 function showChat() {
    const chat = document.getElementById('chatArea');
   
    chat.style.display = (chat.style.display === 'none' || chat.style.display === '') ? 'block' : 'none';
  }

  function showCommand() {
  
    const command = document.getElementById('commandArea');
    command.style.display = (command.style.display === 'none' || command.style.display === '') ? 'block' : 'none';
  }


  // Yardım modalını açma ve kapama fonksiyonları
  function toggleHelpModal() {
   
    const modal = document.getElementById('helpModal');
    modal.style.display = (modal.style.display === 'none' || modal.style.display === '') ? 'block' : 'none';
  }

  function closeHelpModal() {
    document.getElementById('helpModal').style.display = 'none';
  }







// Aktif bölümü takip etmek için değişken
let activeSection = null;

// Bölüm açma/kapatma fonksiyonu
function toggleSection(sectionId) {
  const section = document.getElementById(`${sectionId}-content`);
  
  // Eğer tıklanan bölüm zaten açıksa kapat
  if (activeSection === sectionId) {
    section.style.display = 'none';
    document.querySelector('.sidebar-content').style.width = '0';
    activeSection = null;
    return;
  }
  
  // Diğer tüm bölümleri kapat
  document.querySelectorAll('.content-section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Yeni bölümü aç
  section.style.display = 'block';
  document.querySelector('.sidebar-content').style.width = '300px';
  activeSection = sectionId;
}

// Bölüm kapatma fonksiyonu
function closeSection(sectionId) {
  const section = document.getElementById(`${sectionId}-content`);
  section.style.display = 'none';
  document.querySelector('.sidebar-content').style.width = '0';
  activeSection = null;
}


// Sayfa yüklendiğinde mini takvimi oluştur
document.addEventListener('DOMContentLoaded', function() {
  // Burada mini takvim oluşturma kodu gelecek
  // Örnek: new MiniCalendar('#mini-calendar');
  
  // Örnek görevler ekleme (gerçek uygulamada dinamik olarak yüklenmeli)
  // loadTasks();
});

// Örnek görev yükleme fonksiyonu
function loadTasks() {
  // Burada API'den veya localStorage'dan görevler yüklenecek
}
