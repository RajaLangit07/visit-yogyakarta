(function () {
  const view = document.getElementById('galeri');
  if (!view) return;

  const lang = document.documentElement.lang === 'en' ? 'en' : 'id';

  const CAT = {
    wisata:  { id: 'Wisata',     en: 'Tourism' },
    budaya:  { id: 'Budaya',     en: 'Culture' },
    kuliner: { id: 'Kuliner',    en: 'Culinary' },
    umum:    { id: 'Yogyakarta', en: 'Yogyakarta' },
  };


  const DEST = {
    malioboro: { page: 'malioboro.html', cat: 'wisata', id: 'Jalan Malioboro', en: 'Malioboro Street' },
    prambanan: { page: 'prambanan.html', cat: 'wisata', id: 'Candi Prambanan', en: 'Prambanan Temple' },
    parangtritis: { page: 'parangtritis.html', cat: 'wisata', id: 'Pantai Parangtritis', en: 'Parangtritis Beach' },
    keraton: { page: 'keraton.html', cat: 'budaya', id: 'Keraton Yogyakarta', en: 'Yogyakarta Keraton' },
    wayang: { page: 'wayang.html', cat: 'budaya', id: 'Wayang', en: 'Wayang' },
    batik: { page: 'batik.html', cat: 'budaya', id: 'Batik', en: 'Batik' },
    gudeg: { page: 'gudeg.html', cat: 'kuliner', id: 'Gudeg', en: 'Gudeg' },
    bakpia: { page: 'bakpia.html', cat: 'kuliner', id: 'Bakpia Pathok', en: 'Bakpia Pathok' },
    sate: { page: 'sate.html', cat: 'kuliner', id: 'Sate Klatak', en: 'Sate Klatak' },
    jogja: { page: 'jogja.html', cat: 'umum', id: 'Yogyakarta', en: 'Yogyakarta' },
  };

  const PHOTOS = [
    ["malioo.jpg", "malioboro", 0.75, "50% 50%"],
    ["candii.jpg", "prambanan", 1.0, "50% 50%"],
    ["bakpia.jpg", "bakpia", 1.33, "50% 50%"],
    ["wayangg.jpg", "wayang", 0.8, "50% 40%"],
    ["tugu.jpg", "jogja", 1.0, "50% 50%"],
    ["batik3.jpg", "batik", 0.67, "50% 50%"],
    ["pantaii.jpg", "parangtritis", 0.8, "50% 50%"],
    ["satethumbnail.jpg", "sate", 1.5, "50% 50%"],
    ["keratonn.jpg", "keraton", 1.33, "50% 40%"],
    ["wayang3.jpg", "wayang", 1.5, "50% 50%"],
    ["thumbnailgudegg.jpg", "gudeg", 0.75, "50% 50%"],
    ["candi.jpg", "prambanan", 1.0, "50% 50%"],
    ["parangtritis.jpg", "parangtritis", 0.8, "50% 50%"],
    ["bakpiacimol.jpg", "bakpia", 0.75, "50% 50%"],
    ["malio.jpg", "malioboro", 1.0, "50% 30%"],
    ["batikk.jpg", "batik", 0.67, "50% 50%"],
    ["jogja.jpg", "jogja", 1.5, "50% 50%"],
    ["wayang.jpg", "wayang", 1.0, "30% 50%"],
    ["bannergudegg.jpg", "gudeg", 0.67, "50% 50%"],
    ["keratonb.jpg", "keraton", 1.33, "50% 50%"],
    ["prambananp.jpg", "prambanan", 0.67, "50% 50%"],
    ["batikkk.jpg", "batik", 1.33, "50% 50%"],
    ["sate.jpg", "sate", 1.5, "40% 50%"],
    ["bannersate.jpg", "sate", 0.75, "50% 50%"],
  ];

  const SPEED  = [34, 46, 28, 40];
  const OFFSET = [0, 0.35, 0.7, 0.15];

  function makeTile(p, hidden) {
    const d = DEST[p[1]];
    const name = d[lang];
    const a = document.createElement('a');
    a.className = 'tile';
    a.href = d.page;
    a.style.setProperty('--r', p[2]);

    const img = document.createElement('img');
    img.src = '../IMG/galeri/' + p[0];
    img.alt = hidden ? '' : name;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.style.objectPosition = p[3];
    a.appendChild(img);

    const cap = document.createElement('span');
    cap.className = 'cap';
    cap.innerHTML = '<b></b><small></small>';
    cap.firstChild.textContent = name;
    cap.lastChild.textContent = CAT[d.cat][lang];
    a.appendChild(cap);

    if (hidden) { a.tabIndex = -1; a.setAttribute('aria-hidden', 'true'); }
    return a;
  }


  const colCount = () => (innerWidth >= 1100 ? 4 : innerWidth >= 700 ? 3 : 2);
  let lastW = 0, lastH = 0, lastN = 0;

  function build() {
    const n = colCount();
    lastW = innerWidth; lastH = innerHeight; lastN = n;
    view.innerHTML = '';

    const groups = Array.from({ length: n }, () => []);
    PHOTOS.forEach((p, i) => groups[i % n].push(p));

    groups.forEach((g) => {
      const col = document.createElement('div');
      col.className = 'col';
      const track = document.createElement('div');
      track.className = 'track';
      const set = document.createElement('div');
      set.className = 'set';
      g.forEach((p) => set.appendChild(makeTile(p, false)));
      track.appendChild(set);
      col.appendChild(track);
      view.appendChild(col);
    });

    view.querySelectorAll('.col').forEach((col, ci) => {
      const track = col.firstChild;
      const set = track.firstChild;
      const g = groups[ci];
      const need = view.clientHeight * 1.1;
      for (let k = 0; set.offsetHeight < need && k < 40; k++) {
        set.appendChild(makeTile(g[k % g.length], true));
      }
      const copy = set.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.querySelectorAll('a').forEach((a) => { a.tabIndex = -1; a.querySelector('img').alt = ''; });
      track.appendChild(copy);

      const dur = set.offsetHeight / SPEED[ci % SPEED.length];
      track.style.setProperty('--dur', dur + 's');
      track.style.setProperty('--delay', '-' + dur * OFFSET[ci % OFFSET.length] + 's');
    });
  }


  let timer;
  addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (colCount() !== lastN || Math.abs(innerWidth - lastW) > 80 || innerHeight > lastH * 1.25) build();
    }, 250);
  });

  build();
})();
