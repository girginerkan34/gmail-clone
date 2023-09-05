//! İmportlar (diğer js dosyasında gelen değişken  ve fonksiyonlar)
import { months } from "./constants.js";
import { renderMails, showModal } from "./ui.js";

// local storage den veri alma
const strMailData = localStorage.getItem("data");
// gelen string veriyi obje ve ddizileri çevirme
const mailData = JSON.parse(strMailData);

//! HTML den gelenler
const hamburgerMenu = document.querySelector(".menu");
const navigation = document.querySelector("nav");
const mailsArea = document.querySelector(".mails-area");
const createMailBtn = document.querySelector(".create-mail");
const closeMailBtn = document.querySelector("#close-btn");
const modal = document.querySelector(".modal-wrapper");
const form = document.querySelector("#create-mail-form");

//! Olay izleyicileri
// ekranın yükleme annında çalışır
document.addEventListener("DOMContentLoaded", () => {
  renderMails(mailsArea, mailData);
  if (window.innerWidth < 1100) {
    navigation.classList.add("hide");
  }
});

// pencerenin genişlemesini izleme
window.addEventListener("resize", (e) => {
  const width = e.target.innerWidth;
  if (width < 1100) {
    navigation.classList.add("hide");
  } else {
    navigation.classList.remove("hide");
  }
});
hamburgerMenu.addEventListener("click", handleMenu);
// modal işlemleri
createMailBtn.addEventListener("click", () => showModal(modal, true));
closeMailBtn.addEventListener("click", () => showModal(modal, false));
form.addEventListener("submit", sendMail);

// Mail alanında olan tıklamalar
mailsArea.addEventListener("click", updateMail);

// !Fonksiyonlar
// Navigasyonu açıp kapamaya yarayan fonksiyon
// Hamburger menüye tıklayınca çalışır
function handleMenu() {
  navigation.classList.toggle("hide");
}

// Tarih oluşturan fonksiyon
function getDate() {
  // bugünün tarihini alma
  const dateArr = new Date().toLocaleDateString().split(".");
  // tarih dizisinden günü alma
  const day = dateArr[0];
  // tarih dizisinde kaçıncı ayda olduğumuz bilgisiini alma
  const monthNumber = dateArr[1];
  // ayın sırasına karşılık gelen ismi tanımladık
  const month = months[monthNumber - 1];
  // Fonksiyonun çağrıldığı yere gönderilecek cevap
  return day + " " + month;
}
// maili gönderme
function sendMail(e) {
  // Sayfanın yenilenmesini engelleme
  e.preventDefault();

  //  formun içerisinde yeralan imputların
  // değerlerine erişme
  const receiver = e.target[0].value;
  const title = e.target[1].value;
  const message = e.target[2].value;

  if (!receiver || !title || !message) {
    // notifikasyon ver
    Toastify({
      text: "Lütfen Formu Doldurun",
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      duration: 3000,
      style: {
        background: "rgb(193,193,0)",
        borderRadius: "4px",
      },
    }).showToast();

    // alttak ikodların çaklışmasını engellle
    return;
  }

  // yeni mail oluşturma
  const newMail = {
    id: new Date().getTime(),
    sender: "Erkan",
    receiver,
    title,
    stared: false,
    message,
    date: getDate(),
  };

  // Oluşturduğumuz objeyi dizinin başına ekleme
  mailData.unshift(newMail);

  //Todo veritabanını (localstorage yi güncelle)
  // storage'a göndermek için string eçeviriyoruz
  const strData = JSON.stringify(mailData);

  //  storage ye gönderme
  localStorage.setItem("data", strData);

  // ekranı güncelle
  renderMails(mailsArea, mailData);

  // modalı kapat
  showModal(modal, false);

  // madalı temizle
  e.target[0].value = " ";
  e.target[1].value = " ";
  e.target[2].value = " ";
  // notifikasyon ver
  Toastify({
    text: "Mail başarıyla gönderildi",
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    duration: 3000,
    style: {
      background: "#7CFC00",
      color: "white",
      borderRadius: "4px",
    },
  }).showToast();
}

// mail alanında bir tıklanma olunca çalışır
function updateMail(e) {
  // güncelleenecek maili belirleme
  const mail = e.target.parentElement.parentElement;
  //  mailin diizideki verilerini bulmak içinm id sine erişme
  const mailId = mail.dataset.id;
  // sil butonuna tıklanınca çalısır
  if (e.target.id === "delete") {
    //! localstroge den kaldır
    
    // id değerini bildiğimiz elemannı dizden çıkarma
    const filtredData = mailData.filter((i) => i.id != mailId);

    //  diiyi stringe çevirme
    const strData = JSON.stringify(filtredData);

    // local stroge'a gönderme
    localStorage.setItem("data", strData);

    //! html den kaldırır
    mail.remove();
  }

  // yıldıza tıklanınca çalıstır
  if (e.target.id === "star") {
    // id sinden yola cıkarak mail objesini bulma
    const foundItem = mailData.find((i) => i.id == mailId);

    //  bulduğumuz elemanın stared değerini terse çervirme

    const updatedItem = {...foundItem, stared: !foundItem.stared };

    // güncellennecek elemanın dizideki sırasını bulma 
    const index = mailData.findIndex((i) => i.id == mailId);

    console.log(mailData[0]);

    // Dizideki elemanı güncelleme
     mailData[index] = updatedItem;

    // local storage yi güncelleme
    localStorage.setItem("data", JSON.stringify(mailData));

  }
}

// spread > dağıtma işlemi (...objeİsmi )
// verdiğimiz objenin bütün değerlerine farklı bir obje aktarıır.
