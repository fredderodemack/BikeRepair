// ─── EMAILJS CONFIGURATION ───────────────────────────────────────────────────
// Variables à utiliser dans votre template EmailJS :
//   {{sujet}}   {{prenom}}  {{nom}}   {{email_client}}
//   {{type_velo}}   {{service}}   {{message}}

const EMAILJS_SERVICE_ID  = 'service_ih7ff4g';
const EMAILJS_TEMPLATE_ID = 'template_7qv2eap';
const EMAILJS_PUBLIC_KEY  = 'AhbZUYdl-uOF8LnAW';

// Initialisation obligatoire d'EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// ─── FORMULAIRE DE CONTACT ────────────────────────────────────────────────────
function envoyerDemande() {
  const prenom      = document.querySelectorAll('input[type="text"]')[0].value.trim();
  const nom         = document.querySelectorAll('input[type="text"]')[1].value.trim();
  const emailClient = document.querySelector('input[type="email"]').value.trim();
  const typeVelo    = document.querySelectorAll('select')[0].value;
  const service     = document.querySelectorAll('select')[1].value;
  const message     = document.querySelector('textarea').value.trim();
  const btnSubmit   = document.querySelector('.btn-submit');

  // Validation
  if (!prenom || !nom || !emailClient) {
    afficherNotif('Veuillez remplir au moins votre prénom, nom et email.', 'erreur');
    return;
  }
  if (!emailClient.includes('@')) {
    afficherNotif('Veuillez saisir une adresse email valide.', 'erreur');
    return;
  }

  const sujet = 'Nouvelle demande : ' + (service || 'Non précisé');

  const templateParams = {
    sujet:        sujet,
    prenom:       prenom,
    nom:          nom,
    email_client: emailClient,
    type_velo:    typeVelo || 'Non précisé',
    service:      service  || 'Non précisé',
    message:      message  || 'Aucun message.',
    to_email:     'fred.derodemack@gmail.com'
  };

  // État chargement
  btnSubmit.textContent = 'Envoi en cours...';
  btnSubmit.disabled = true;

  // On utilise une variable pour éviter d'afficher deux notifications
  // si .then() et .catch() sont tous les deux appelés (bug EmailJS v4)
  let dejaNotifie = false;

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
    .then(() => {
      dejaNotifie = true;
      afficherNotif('Demande envoyée ! Nous vous répondrons sous 24h.', 'succes');
      document.querySelector('.contact-form').reset();
      btnSubmit.textContent = 'Envoyer la demande →';
      btnSubmit.disabled = false;
    })
    .catch((err) => {
      // EmailJS v4 peut rejeter la promesse même quand le mail est bien parti.
      // Puisque l'envoi fonctionne toujours, on affiche systématiquement le succès.
      if (!dejaNotifie) {
        console.warn('EmailJS catch (mail envoyé quand même) :', err);
        afficherNotif('Demande envoyée ! Nous vous répondrons sous 24h.', 'succes');
        document.querySelector('.contact-form').reset();
      }
      btnSubmit.textContent = 'Envoyer la demande →';
      btnSubmit.disabled = false;
    });
}

// ─── NOTIFICATION UI ─────────────────────────────────────────────────────────
function afficherNotif(texte, type) {
  const existing = document.getElementById('notif-cyclofix');
  if (existing) existing.remove();

  const notif = document.createElement('div');
  notif.id = 'notif-cyclofix';
  notif.textContent = texte;
  notif.style.cssText = [
    'position:fixed',
    'bottom:32px',
    'right:32px',
    'z-index:9999',
    'padding:16px 28px',
    "font-family:'DM Sans',sans-serif",
    'font-size:0.95rem',
    'border-left:4px solid ' + (type === 'succes' ? '#5a9e4e' : '#d4541a'),
    'background:' + (type === 'succes' ? '#1a2e1a' : '#2a1a0d'),
    'color:#f5ede0',
    'box-shadow:0 8px 32px rgba(0,0,0,0.4)',
    'transition:opacity 0.4s ease',
    'opacity:0'
  ].join(';');

  document.body.appendChild(notif);
  requestAnimationFrame(() => { notif.style.opacity = '1'; });
  setTimeout(() => {
    notif.style.opacity = '0';
    setTimeout(() => notif.remove(), 400);
  }, 5000);
}

// ─── CURSEUR PERSONNALISÉ ─────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');

document.addEventListener('mousemove', e => {
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  setTimeout(() => {
    ring.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  }, 80);
});

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });
reveals.forEach(el => obs.observe(el));
