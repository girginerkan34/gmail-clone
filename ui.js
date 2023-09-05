// yaıları kesmek için kullandığımız fonksiyon
function trimString(str, max) {
// metin 50karekterden kısaysa olduğu gibi gönderiyoruz
  if (str.length < max) return str;
  // metnin harf uzunluüu 50 karakterden uzunsa 
  // 50 ye kadar olan kısmı kes sonrasına ... koy
  // yeni metni fonksiyonun çalıştığı yere gönder
  return str.slice(0, max) + '...';
}




/*
Ekrana mailleri listeleyecek fonsiyon
Outlet: ekranın hangi kısmına müdahale edilecek
Data: Hangi verileri  ekrana basıcaz 

*/

export function renderMails(outlet, data) {
  if(!data) return;
  // herbir mail objesi için bir maili temsil eden html oluştur.
  // oluşan mail html'ini Mailer alanına gönderme.
  outlet.innerHTML = data
  .map(
    (mail) => `
         <div class="mail">
            <div class="left">
              <input type="checkbox" />
              <i class="bi bi-star ${
                mail.stared === true && 'star-active' : " "
              }"></i>
              <span>${mail.sender}</span>
            </div>
            <div class="right">
              <p class="message-title">${trimString(
                mail.title,
                30
              )}</p>
              <p class="message-desc">
                ${trimString(mail.message, 40)}
              </p>
              <p class="message-date">${mail.date}</p>

              <button id="delete">Sil</button>
            </div>
          </div>
  `
  )
  .join(' ');
 
}

// ekrana mail oluşturma penceresi açma fonk.

export function showModal(modal, willOpen) {
  modal.style.display = willOpen ? 'grid' : 'none' ;
}
