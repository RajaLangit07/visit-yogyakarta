
const destinations = [
  {
    name: "Yogyakarta",
    desc: "Jelajahi keindahan budaya, kekayaan rasa, dan lanskap alam Yogyakarta dalam satu panduan perjalanan yang simpel dan terkurasi.",
    link: "jogja.html",
    bg:   "../IMG/tugu.avif",
  },
  {
    name: "Wisata",
    desc: "Yogyakarta menyimpan sejuta pesona alam dan tempat rekreasi yang memikat. siap memberikan pengalaman liburan tak terlupakan di setiap sudutnya.",
    link: "wisata.html",
    bg:   "../IMG/candi.avif",
  },
   {
    name: "Budaya",
    desc: "Yogyakarta adalah ruang hidup bagi sejarah dan filosofi Jawa. Dari kemegahan Keraton, kebudayaan wayang, dan keindahan batik. temukan koneksi nyata dengan warisan budaya yang tak lekang oleh waktu di setiap sudut kota.",
    link: "budaya.html",
    bg:   "../IMG/batikkk.avif",
  },
   {
    name: "Kuliner",
    desc: "Nikmati keharmonisan rasa makanan khas Yogyakarta dan hidangan tradisional legendaris yang telah dipilih dengan seksama.",
    link: "kuliner.html",
    bg:   "../IMG/bannergudegg.jpeg",
  },
];

const IS_EN = document.documentElement.lang === "en";
const EN_TEXT = [
  {
    name: "Yogyakarta",
    desc: "Explore the beauty of culture, the richness of flavor, and the natural landscapes of Yogyakarta in one simple, curated travel guide." 
  },
  { 
    name: "Tourism",    
    desc: "Yogyakarta holds a myriad of natural charms and captivating recreational spots, ready to provide an unforgettable holiday experience in every corner." 
  },
  { 
    name: "Culture",    
    desc: "Yogyakarta is a living space for Javanese history and philosophy. From the grandeur of the Keraton (palace) and the tradition of *wayang* (puppetry) to the exquisite beauty of *batik*, discover a tangible connection to a timeless cultural heritage in every corner of the city." 
  },
  { 
    name: "Culinary",   
    desc: "Enjoy a harmonious blend of flavors from Yogyakarta’s signature dishes and legendary traditional delicacies, all carefully curated." 
  },
];
if (IS_EN) destinations.forEach((d, i) => { d.name = EN_TEXT[i].name; d.desc = EN_TEXT[i].desc; });
const EXPLORE_LABEL = IS_EN ? "Explore" : "Jelajahi";


const n = destinations.length;
const COPIES = 5;                      
const MIDDLE = Math.floor(COPIES / 2); 
const START_INDEX = 0;                 

let pos = MIDDLE * n + START_INDEX;
let lastCaption = -1;


const hero     = document.getElementById("hero");
const track    = document.getElementById("track");
const selector = track.closest(".selector");

const bgs   = [];
const items = [];


const caption = document.createElement("div");
const titleEl = document.createElement("h2");
const descEl  = document.createElement("p");
const btnEl   = document.createElement("a");



function buildBackgrounds() {
  destinations.forEach((d) => {
    const bg = document.createElement("div");
    bg.className = "bg";

    const isCss = d.bg.includes("gradient(") || d.bg.startsWith("url(");
     bg.style.backgroundImage = isCss ? d.bg : `url("${d.bg}")`;

    
    if (!isCss) {
      const test = new Image();
      test.onerror = () => console.warn(`Gambar background tidak ditemukan: "${d.bg}" (${d.name}). Cek path / nama filenya.`);
      test.src = d.bg;
    }

    hero.insertBefore(bg, selector);
    bgs.push(bg);
  });
}

function buildCaption() {
  caption.className = "caption";
  caption.setAttribute("aria-live", "polite");

  btnEl.className = "caption-btn";
  btnEl.innerHTML = EXPLORE_LABEL + ' <span aria-hidden="true">→</span>';

  caption.append(titleEl, descEl, btnEl);
  hero.insertBefore(caption, selector);
}

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



const itemWidth = () => items[0].offsetWidth;


function withoutAnimation(fn) {
  track.style.transition = "none";
  items.forEach((el) => (el.style.transition = "none"));
  fn();
  track.offsetHeight;
  track.style.transition = "";
  items.forEach((el) => (el.style.transition = ""));
}

function setCaption(i) {
  if (i === lastCaption) return;
  lastCaption = i;

  titleEl.textContent = destinations[i].name;
  descEl.textContent  = destinations[i].desc;
  btnEl.href          = destinations[i].link;

  caption.classList.remove("animate");
  void caption.offsetWidth;
  caption.classList.add("animate");
}

function updateClasses() {
  items.forEach((el, i) => {
    const d = Math.abs(i - pos);
    el.className = "item" + (d === 0 ? " active" : d === 1 ? " d1" : d === 2 ? " d2" : "");
  });

  const current = ((pos % n) + n) % n;
  bgs.forEach((b, i) => b.classList.toggle("active", i === current));
  setCaption(current);
}

function render() {
  const w = itemWidth();
  track.style.transform = `translateX(${-(pos * w + w / 2)}px)`;
  updateClasses();
}


function recenter() {
  const k = Math.floor(pos / n) - MIDDLE;
  if (k === 0) return 0;

  const currentX = new DOMMatrix(getComputedStyle(track).transform).m41;
  const shift = k * n;

  pos -= shift;
  withoutAnimation(() => {
    track.style.transform = `translateX(${currentX + shift * itemWidth()}px)`;
    updateClasses();
  });
  return shift;
}

function move(delta) {
  recenter();
  pos += delta;
  render();
}

function goTo(globalIndex) {
  const shift = recenter();
  pos = globalIndex - shift;
  render();
}


document.querySelector(".prev").onclick = () => move(-1);
document.querySelector(".next").onclick = () => move(1);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft")  move(-1);
  if (e.key === "ArrowRight") move(1);
});

track.addEventListener("transitionend", (e) => {
  if (e.target === track && e.propertyName === "transform") recenter();
});

window.addEventListener("resize", () => withoutAnimation(render));


buildBackgrounds();
buildCaption();
buildItems();
withoutAnimation(render);