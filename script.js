/* =========================================================
   OASIS DES SAVEURS — script.js
   ========================================================= */

/* ---------- NAVIGATION : marqueur glissant ---------- */
const nav = document.getElementById('nav');
const marker = document.getElementById('marker');
const navLinks = document.querySelectorAll('.nav-link');

function placeMarker(el){
  if(!el) return;
  marker.style.width = el.offsetWidth + 'px';
  marker.style.left = el.offsetLeft + 'px';
}

function moveMarker(el){
  placeMarker(el);
}

function setActive(el){
  navLinks.forEach(link => link.classList.remove('active'));
  el.classList.add('active');
}

document.querySelector('.nav-links').addEventListener('mouseleave', () => {
  const active = document.querySelector('.nav-link.active');
  placeMarker(active);
});

window.addEventListener('load', () => {
  placeMarker(document.querySelector('.nav-link.active'));
});
window.addEventListener('resize', () => {
  placeMarker(document.querySelector('.nav-link.active'));
});

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* Suivi de la section visible pour activer le bon lien de nav */
const sections = ['accueil', 'menu', 'apropos', 'avis', 'contact']
  .map(id => document.getElementById(id))
  .filter(Boolean);

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if(link){ setActive(link); placeMarker(link); }
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach(section => navObserver.observe(section));

/* ---------- MENU MOBILE (burger) ---------- */
const burger = document.getElementById('burger');
const navLinksPanel = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function toggleMenu(){
  const isOpen = navLinksPanel.classList.toggle('open');
  navOverlay.classList.toggle('open', isOpen);
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu(){
  navLinksPanel.classList.remove('open');
  navOverlay.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ---------- ONGLETS DE LA CARTE ---------- */
const tabButtons = document.querySelectorAll('.tab-btn');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.carte-grid').forEach(grid => {
      grid.style.display = 'none';
    });
    document.getElementById(btn.dataset.tab).style.display = 'grid';
  });
});

/* ---------- FORMULAIRE DE COMMANDE ---------- */
function envoyerCommande(event){
  event.preventDefault();
  const form = event.target;
  const nom = form.nom.value.trim();
  const plat = form.plat.value;
  const quantite = form.quantite.value;
  const mode = form.mode.value;
  const confirmMsg = document.getElementById('formConfirm');

  // Ici : brancher un vrai envoi (fetch vers un backend, email, etc.)
  confirmMsg.textContent = `Merci ${nom}, votre commande (${quantite} × ${plat}) a bien été reçue. Nous vous contactons pour confirmer : ${mode}.`;
  form.reset();
  form.quantite.value = 1;
}

/* ---------- LAISSER UN AVIS ---------- */
function ajouterAvis(event){
  event.preventDefault();
  const form = event.target;
  const nom = form.avisNom.value.trim();
  const note = parseInt(form.avisNote.value, 10);
  const texte = form.avisTexte.value.trim();
  const confirmMsg = document.getElementById('avisConfirm');

  const etoiles = '★'.repeat(note) + '☆'.repeat(5 - note);

  const carte = document.createElement('article');
  carte.className = 'avis-carte';
  carte.innerHTML = `
    <div class="etoiles">${etoiles}</div>
    <p>« ${texte} »</p>
    <span class="avis-nom">— ${nom}</span>
  `;

  // Ici : brancher un vrai enregistrement (fetch vers un backend).
  // Sans backend, l'avis s'affiche immédiatement mais disparaît au rechargement de la page.
  document.getElementById('avisGrid').prepend(carte);

  confirmMsg.textContent = `Merci ${nom}, votre avis a bien été publié !`;
  form.reset();
}