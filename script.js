// =========================================================
// Año en footer
// =========================================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// =========================================================
// Terminal del hero — reloj real (CDMX) + líneas escritas a máquina
// No usamos cifras inventadas de "su" infraestructura: solo mostramos
// qué tipo de cosas monitorea Cbits, en tono de proceso/terminal.
// =========================================================
const terminalClock = document.getElementById('terminalClock');
if (terminalClock){
  const updateClock = () => {
    const now = new Date();
    const formatted = now.toLocaleTimeString('es-MX', {
      timeZone: 'America/Mexico_City', hour12: false,
    });
    terminalClock.textContent = formatted;
  };
  updateClock();
  setInterval(updateClock, 1000);
}

const TERMINAL_LINES = [
  { prompt: '$ ', text: 'cbits monitor --equipos', typed: true },
  { text: 'actualizaciones de seguridad al día', ok: true },
  { prompt: '$ ', text: 'cbits monitor --respaldo', typed: true },
  { text: 'respaldo verificado', ok: true },
  { prompt: '$ ', text: 'cbits monitor --onedrive-sharepoint', typed: true },
  { text: 'OneDrive y SharePoint sincronizados', ok: true },
  { prompt: '$ ', text: 'cbits monitor --licencias', typed: true },
  { text: 'licencias vigentes', ok: true },
  { prompt: '$ ', text: 'cbits monitor --red', typed: true },
  { text: 'red disponible', ok: true },
];

const terminalBody = document.getElementById('terminalBody');

function typeLine(el, text, speed = 18){
  return new Promise(resolve => {
    let i = 0;
    const tick = () => {
      el.textContent += text[i];
      i += 1;
      if (i < text.length){
        setTimeout(tick, speed);
      } else {
        resolve();
      }
    };
    tick();
  });
}

async function runTerminal(){
  if (!terminalBody) return;
  terminalBody.innerHTML = '';

  for (const line of TERMINAL_LINES){
    const row = document.createElement('div');
    row.className = 'term-line';
    terminalBody.appendChild(row);

    if (line.prompt){
      const promptSpan = document.createElement('span');
      promptSpan.className = 'term-prompt';
      promptSpan.textContent = line.prompt;
      row.appendChild(promptSpan);
      const textSpan = document.createElement('span');
      row.appendChild(textSpan);
      await typeLine(textSpan, line.text);
    } else if (line.ok){
      row.innerHTML = `<span class="term-ok">✓</span> ${line.text}`;
      await new Promise(r => setTimeout(r, 350));
    } else {
      row.textContent = line.text;
      await new Promise(r => setTimeout(r, line.delay || 400));
    }
  }

  const cursorRow = document.createElement('div');
  cursorRow.className = 'term-line';
  cursorRow.innerHTML = `<span class="term-prompt">$ </span><span class="term-cursor"></span>`;
  terminalBody.appendChild(cursorRow);
}

if (terminalBody){
  runTerminal();
}

// =========================================================
// Menú móvil
// =========================================================
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
if (navToggle && navList){
  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// =========================================================
// Quiz de diagnóstico
// Cada opción suma puntos (0-3). Puntaje total define el
// nivel de "exposición" y el plan recomendado.
// =========================================================
if (document.getElementById('quizBody')){
const QUIZ_QUESTIONS = [
  {
    q: '¿Cuántos equipos (PC/laptops) usa tu empresa?',
    options: [
      { label: '1 a 5', score: 0, eq: [1, 5] },
      { label: '6 a 20', score: 1, eq: [6, 20] },
      { label: '21 a 50', score: 2, eq: [21, 50] },
      { label: 'Más de 50', score: 3, eq: null },
    ],
  },
  {
    q: '¿Tienen a alguien dedicado a resolver fallas de TI?',
    options: [
      { label: 'Sí, un equipo interno', score: 0 },
      { label: 'Una persona que hace de todo', score: 1 },
      { label: 'Lo resolvemos como podemos', score: 2 },
      { label: 'Nadie, cada quien se las arregla', score: 3 },
    ],
  },
  {
    q: '¿Hacen respaldo de su información regularmente?',
    options: [
      { label: 'Sí, automático y verificado', score: 0 },
      { label: 'Sí, pero manual', score: 1 },
      { label: 'A veces', score: 2 },
      { label: 'No estamos seguros', score: 3 },
    ],
  },
  {
    q: '¿Sus licencias de software están al día y documentadas?',
    options: [
      { label: 'Sí, todo controlado', score: 0 },
      { label: 'La mayoría', score: 1 },
      { label: 'No muy claro', score: 2 },
      { label: 'No lo sabemos con certeza', score: 3 },
    ],
  },
  {
    q: 'Cuando algo falla, ¿cuánto tardan en resolverlo?',
    options: [
      { label: 'Minutos', score: 0 },
      { label: 'Un par de horas', score: 1 },
      { label: 'Puede tomar días', score: 2 },
      { label: 'Depende de a quién encontremos', score: 3 },
    ],
  },
  {
    q: 'Si Microsoft falla un día, ¿pueden seguir trabajando?',
    options: [
      { label: 'Sí, tenemos respaldo y un plan', score: 0 },
      { label: 'En parte, con limitaciones', score: 1 },
      { label: 'Tendríamos problemas serios', score: 2 },
      { label: 'No, todo depende de Microsoft', score: 3 },
    ],
  },
];

const MAX_SCORE = QUIZ_QUESTIONS.length * 3;

const quizBody = document.getElementById('quizBody');
const quizResult = document.getElementById('quizResult');
const progressFill = document.getElementById('quizProgressFill');
const progressLabel = document.getElementById('quizProgressLabel');

let currentQ = 0;
let totalScore = 0;
let selectedEq = null;

function renderQuestion(){
  const item = QUIZ_QUESTIONS[currentQ];
  progressFill.style.width = `${(currentQ / QUIZ_QUESTIONS.length) * 100}%`;
  progressLabel.textContent = `Pregunta ${currentQ + 1} de ${QUIZ_QUESTIONS.length}`;

  quizBody.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'quiz-question';

  const h3 = document.createElement('h3');
  h3.textContent = item.q;
  wrap.appendChild(h3);

  const optWrap = document.createElement('div');
  optWrap.className = 'quiz-options';

  item.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quiz-option';
    btn.textContent = opt.label;
    btn.addEventListener('click', () => selectAnswer(opt.score, opt));
    optWrap.appendChild(btn);
  });

  wrap.appendChild(optWrap);
  quizBody.appendChild(wrap);
}

function selectAnswer(score, opt){
  if (currentQ === 0) selectedEq = opt.eq;
  totalScore += score;
  currentQ += 1;
  if (currentQ < QUIZ_QUESTIONS.length){
    renderQuestion();
  } else {
    showResult();
  }
}


function mxn(n){ return '$' + n.toLocaleString('es-MX'); }
function showEstimate(planKey){
  const box = document.getElementById('resultEstimate');
  if (!box) return;
  if (!selectedEq){
    box.innerHTML = '<strong>Estimado:</strong> con más de 50 equipos lo cotizamos a la medida.';
    box.hidden = false;
    return;
  }
  const lo = selectedEq[0], hi = selectedEq[1];
  const monthly = (n) => planKey === 'empresarial' ? n * 450 + 500 : n * 450;
  const once = (n) => planKey === 'crecimiento' ? n * 300 : (planKey === 'empresarial' ? 900 + n * 300 : 0);
  let html = '<strong>Estimado orientativo</strong> para ' + lo + ' a ' + hi + ' equipos PC (IVA incluido):<br>';
  html += mxn(monthly(lo)) + ' a ' + mxn(monthly(hi)) + ' al mes';
  if (planKey !== 'esencial') html += '<br>Pago único de configuración: ' + mxn(once(lo)) + ' a ' + mxn(once(hi));
  html += '<br><small>Cada Mac suma $50 más al mes y cada servidor cuesta $900 al mes. No incluye licencias' + (planKey === 'empresarial' ? ' ni el equipo Synology, que se cotiza aparte' : '') + '. El precio final se confirma después del diagnóstico.</small>';
  box.innerHTML = html;
  box.hidden = false;
}

function showResult(){
  progressFill.style.width = '100%';
  progressLabel.textContent = 'Diagnóstico completo';
  quizBody.hidden = true;
  quizResult.hidden = false;

  // % de "exposición" — entre más alto, más riesgo/necesidad
  const pct = Math.round((totalScore / MAX_SCORE) * 100);

  const gaugeFill = document.getElementById('gaugeFill');
  const gaugeValue = document.getElementById('gaugeValue');
  const circumference = 283; // largo aproximado del arco en el SVG
  const offset = circumference - (circumference * pct) / 100;
  requestAnimationFrame(() => {
    gaugeFill.style.strokeDashoffset = String(offset);
  });

  let animatedPct = 0;
  const step = () => {
    animatedPct = Math.min(pct, animatedPct + 2);
    gaugeValue.textContent = `${animatedPct}%`;
    if (animatedPct < pct) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);

  const resultTitle = document.getElementById('resultTitle');
  const resultText = document.getElementById('resultText');
  const resultPlanLink = document.getElementById('resultPlanLink');

  if (pct <= 30){
    resultTitle.textContent = 'Tu operación está bien encaminada';
    resultText.textContent = 'Tienen buenas bases, pero formalizar el soporte evita que un problema pequeño se vuelva grande. El plan Esencial les da ese respaldo.';
    resultPlanLink.href = 'planes.html#plan-esencial';
    resultPlanLink.textContent = 'Ver plan Esencial';
    showEstimate('esencial');
  } else if (pct <= 65){
    resultTitle.textContent = 'Hay riesgos que conviene cerrar pronto';
    resultText.textContent = 'Su infraestructura ya es lo bastante compleja como para necesitar un socio que la administre de forma proactiva. El plan Crecimiento fue diseñado para este momento.';
    resultPlanLink.href = 'planes.html#plan-crecimiento';
    resultPlanLink.textContent = 'Ver plan Crecimiento';
    showEstimate('crecimiento');
  } else {
    resultTitle.textContent = 'Tu operación está expuesta';
    resultText.textContent = 'Sin respaldo, soporte dedicado o control de licencias, un solo incidente puede detener tu negocio. Hablemos de un plan Empresarial a la medida.';
    resultPlanLink.href = 'planes.html#plan-empresarial';
    resultPlanLink.textContent = 'Ver plan Empresarial';
    showEstimate('empresarial');
  }
}

document.getElementById('quizRestart').addEventListener('click', () => {
  currentQ = 0;
  totalScore = 0;
  selectedEq = null;
  document.getElementById('resultEstimate').hidden = true;
  quizBody.hidden = false;
  quizResult.hidden = true;
  renderQuestion();
});

renderQuestion();
}

// =========================================================
// Origen de la visita (por ejemplo ?origen=capas en un anuncio)
// Se guarda la primera vez que llega y se manda con el formulario.
// =========================================================
function getOrigen(){
  let stored = '';
  try { stored = sessionStorage.getItem('cbits_origen') || ''; } catch (e) {}
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('origen');
    if (fromUrl && /^[A-Za-z0-9_-]{1,40}$/.test(fromUrl) && !stored){
      stored = fromUrl;
      try { sessionStorage.setItem('cbits_origen', stored); } catch (e) {}
    }
  } catch (e) {}
  return stored;
}
const origenActual = getOrigen();

// =========================================================
// Formulario de contacto -> Azure Function (/api/contact)
// =========================================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const formSubmit = document.getElementById('formSubmit');

if (contactForm && formStatus && formSubmit){
  const origenField = document.getElementById('f-origen');
  if (origenField) origenField.value = origenActual;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    const data = Object.fromEntries(new FormData(contactForm).entries());
    data.origen = origenActual;
    data.pagina = window.location.pathname;

    formSubmit.disabled = true;
    formSubmit.textContent = 'Enviando…';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Request failed');

      formStatus.textContent = 'Mensaje enviado. Te contactaremos pronto.';
      formStatus.className = 'form-status success';
      contactForm.reset();
    } catch (err) {
      formStatus.textContent = 'No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos a info@cbits.mx.';
      formStatus.className = 'form-status error';
    } finally {
      formSubmit.disabled = false;
      formSubmit.textContent = 'Enviar mensaje';
    }
  });
}
