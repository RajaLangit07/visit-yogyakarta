/* =====================================================================
   main.js — Carousel destinasi + judul/deskripsi + tombol Jelajahi
   Urutan file:
     1. Data destinasi        (bagian yang paling sering diedit)
     2. Konfigurasi & state
     3. Elemen DOM
     4. Membangun tampilan    (background, caption, daftar nama)
     5. Helper
     6. Render                (menampilkan state ke layar)
     7. Navigasi              (geser / klik)
     8. Event listener
     9. Inisialisasi
   ===================================================================== */


/* ===== 1. DATA DESTINASI =====
   name = judul & nama di carousel
   desc = deskripsi singkat di bawah judul
   link = halaman tujuan tombol "Jelajahi"
   bg   = gambar background (URL / path / gradient CSS)               */
const destinations = [
  {
    name: "Yogyakarta",
    desc: "Jelajahi keindahan budaya, kekayaan rasa, dan lanskap alam Yogyakarta dalam satu panduan perjalanan yang simpel dan terkurasi.",
    link: "jogja.html",
    bg:   "https://images.unsplash.com/photo-1740812507973-3219c210284b?q=80&w=2231&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    name: "Wisata",
    desc: "Yogyakarta menyimpan sejuta pesona alam dan tempat rekreasi yang memikat. Temukan lanskap tebing purba, kesejukan lereng gunung, hingga spot-spot hits kekinian yang siap memberikan pengalaman liburan tak terlupakan di setiap sudutnya.",
    link: "wisata.html",
    bg:   "https://images.unsplash.com/photo-1781080853074-60e02c36d0df?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
   {
    name: "Budaya",
    desc: "Yogyakarta adalah ruang hidup bagi sejarah dan filosofi Jawa. Dari kemegahan Keraton, keanggunan tari klasik, hingga ragam galeri seni, temukan koneksi nyata dengan warisan budaya yang tak lekang oleh waktu di setiap sudut kota.",
    link: "budaya.html",
    bg:   "https://images.unsplash.com/photo-1604973104381-870c92f10343?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
   {
    name: "Kuliner",
    desc: "Nikmati keharmonisan rasa Yogyakarta, dari hidangan tradisional legendaris hingga tempat nongkrong kekinian yang telah dipilih dengan seksama.",
    link: "kuliner.html",
    bg:   "https://media.istockphoto.com/id/2255994920/id/foto/nasi-gudeg-makanan-khas-dari-yogyakarta-indonesia-nasi-dengan-rebusan-nangka-dimasak-dengan.jpg?s=612x612&w=0&k=20&c=glK8z76DLterrdYQhrIYWvuzr-eBBYi5aw5uSK7anog=",
  },
];

/* ----- Versi English (diterjemahkan manual, bukan Google Translate) -----
   Dipakai otomatis kalau <html lang="en"> (halaman di folder EN)          */
const IS_EN = document.documentElement.lang === "en";
const EN_TEXT = [
  { name: "Yogyakarta", desc: "Explore the beauty of culture, the richness of flavor, and the natural landscapes of Yogyakarta in one simple, curated travel guide." },
  { name: "Tourism",    desc: "Yogyakarta holds endless natural charm and recreation spots. Discover ancient cliff landscapes, the cool slopes of the mountains, and trendy hotspots ready to give you an unforgettable holiday experience around every corner." },
  { name: "Culture",    desc: "Yogyakarta is a living space for Javanese history and philosophy. From the grandeur of the Keraton and the grace of classical dance to a variety of art galleries, find a real connection with a timeless cultural heritage in every corner of the city." },
  { name: "Culinary",   desc: "Enjoy the harmony of Yogyakarta's flavors, from legendary traditional dishes to trendy hangout spots, all carefully selected." },
];
if (IS_EN) destinations.forEach((d, i) => { d.name = EN_TEXT[i].name; d.desc = EN_TEXT[i].desc; });
const EXPLORE_LABEL = IS_EN ? "Explore" : "Jelajahi";


/* ===== 2. KONFIGURASI & STATE ===== */
const n = destinations.length;
const COPIES = 5;                      // daftar diulang 5x supaya kiri-kanan selalu terisi (efek tanpa putus)
const MIDDLE = Math.floor(COPIES / 2); // salinan tengah = posisi "rumah"
const START_INDEX = 0;                 

// pos = posisi di dalam daftar panjang (semua salinan)
let pos = MIDDLE * n + START_INDEX;
let lastCaption = -1;                  // caption yang sedang tampil


/* ===== 3. ELEMEN DOM ===== */
const hero     = document.getElementById("hero");
const track    = document.getElementById("track");
const selector = track.closest(".selector");

const bgs   = [];   // layer background (satu per destinasi)
const items = [];   // nama destinasi di carousel (semua salinan)

// elemen caption, diisi di bagian 4
const caption = document.createElement("div");
const titleEl = document.createElement("h2");
const descEl  = document.createElement("p");
const btnEl   = document.createElement("a");


/* ===== 4. MEMBANGUN TAMPILAN ===== */

// 4a. Layer background (satu per destinasi asli)
function buildBackgrounds() {
  destinations.forEach((d) => {
    const bg = document.createElement("div");
    bg.className = "bg";

    const isCss = d.bg.includes("gradient(") || d.bg.startsWith("url(");
    // path dibungkus tanda kutip supaya nama file dengan spasi tetap terbaca
    bg.style.backgroundImage = isCss ? d.bg : `url("${d.bg}")`;

    // kalau gambar tidak ketemu, muncul peringatan di Console (F12)
    if (!isCss) {
      const test = new Image();
      test.onerror = () => console.warn(`Gambar background tidak ditemukan: "${d.bg}" (${d.name}). Cek path / nama filenya.`);
      test.src = d.bg;
    }

    hero.insertBefore(bg, selector);
    bgs.push(bg);
  });
}

// 4b. Judul + deskripsi + tombol Jelajahi
function buildCaption() {
  caption.className = "caption";
  caption.setAttribute("aria-live", "polite");

  btnEl.className = "caption-btn";
  btnEl.innerHTML = EXPLORE_LABEL + ' <span aria-hidden="true">→</span>';

  caption.append(titleEl, descEl, btnEl);
  hero.insertBefore(caption, selector);
}

// 4c. Daftar nama destinasi, diulang COPIES kali
function buildItems() {
  for (let c = 0; c < COPIES; c++) {
    destinations.forEach((d, i) => {
      const globalIndex = c * n + i;
      const it = document.createElement("div");
      it.className = "item";
      it.textContent = d.name;
      it.onclick = () => goTo(globalIndex);
      track.appendChild(it);
      items.push(it);
    });
  }
}


/* ===== 5. HELPER ===== */
const itemWidth = () => items[0].offsetWidth;

// jalankan fungsi tanpa animasi (lewat inline style, jadi tidak tergantung style.css)
function withoutAnimation(fn) {
  track.style.transition = "none";
  items.forEach((el) => (el.style.transition = "none"));
  fn();
  track.offsetHeight;
  track.style.transition = "";
  items.forEach((el) => (el.style.transition = ""));
}


/* ===== 6. RENDER (menampilkan state ke layar) ===== */

// ganti judul, deskripsi, dan link tombol
function setCaption(i) {
  if (i === lastCaption) return;
  lastCaption = i;

  titleEl.textContent = destinations[i].name;
  descEl.textContent  = destinations[i].desc;
  btnEl.href          = destinations[i].link;

  // ulang animasi fade-in setiap kali berganti
  caption.classList.remove("animate");
  void caption.offsetWidth;
  caption.classList.add("animate");
}

// tandai item aktif/dekat, ganti background, ganti caption
function updateClasses() {
  items.forEach((el, i) => {
    const d = Math.abs(i - pos);
    el.className = "item" + (d === 0 ? " active" : d === 1 ? " d1" : d === 2 ? " d2" : "");
  });

  const current = ((pos % n) + n) % n;
  bgs.forEach((b, i) => b.classList.toggle("active", i === current));
  setCaption(current);
}

// geser track supaya item aktif tepat di tengah layar
function render() {
  const w = itemWidth();
  track.style.transform = `translateX(${-(pos * w + w / 2)}px)`;
  updateClasses();
}


/* ===== 7. NAVIGASI ===== */

// Pindahkan pos kembali ke salinan tengah TANPA mengubah apa yang terlihat di layar.
// Dipanggil sebelum setiap geseran, jadi aman walau tombol ditekan cepat berkali-kali.
// Mengembalikan jumlah item yang digeser (k * n).
function recenter() {
  const k = Math.floor(pos / n) - MIDDLE;   // berapa salinan kita bergeser dari tengah
  if (k === 0) return 0;

  // posisi track yang sedang terlihat (termasuk kalau animasi belum selesai)
  const currentX = new DOMMatrix(getComputedStyle(track).transform).m41;
  const shift = k * n;

  pos -= shift;
  withoutAnimation(() => {
    track.style.transform = `translateX(${currentX + shift * itemWidth()}px)`;
    updateClasses();
  });
  return shift;
}

// geser relatif dari posisi sekarang (tombol & keyboard)
function move(delta) {
  recenter();
  pos += delta;
  render();
}

// klik langsung pada nama destinasi
function goTo(globalIndex) {
  const shift = recenter();
  pos = globalIndex - shift;
  render();
}


/* ===== 8. EVENT LISTENER ===== */
document.querySelector(".prev").onclick = () => move(-1);
document.querySelector(".next").onclick = () => move(1);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft")  move(-1);
  if (e.key === "ArrowRight") move(1);
});

// setelah animasi geser selesai, rapikan posisi diam-diam
track.addEventListener("transitionend", (e) => {
  if (e.target === track && e.propertyName === "transform") recenter();
});

window.addEventListener("resize", () => withoutAnimation(render));


/* ===== 9. INISIALISASI ===== */
buildBackgrounds();
buildCaption();
buildItems();
withoutAnimation(render);   // tampilan awal tanpa animasi  