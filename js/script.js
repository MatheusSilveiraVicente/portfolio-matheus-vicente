// Portfólio — Matheus Vicente | UNINTER

/* ---------- Menu mobile ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const aberto = navLinks.classList.toggle('aberto');
  navToggle.setAttribute('aria-expanded', aberto);
});

// fecha o menu ao clicar num link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('aberto');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', e => {
  if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('aberto');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

/* ---------- Link ativo conforme seção visível ---------- */
const secoes = document.querySelectorAll('section[id]');
const links  = document.querySelectorAll('.nav-link');

const obsSecao = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(l => l.classList.remove('ativo'));
    const ativo = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
    if (ativo) ativo.classList.add('ativo');
  });
}, { threshold: 0.4, rootMargin: '-64px 0px 0px 0px' });

secoes.forEach(s => obsSecao.observe(s));

/* ---------- Tema claro / escuro ---------- */
const btnTema = document.getElementById('btnTema');
const TEMA_KEY = 'mv-tema';

function setTema(t) {
  document.body.classList.toggle('tema-escuro', t === 'escuro');
  document.body.classList.toggle('tema-claro',  t !== 'escuro');
  btnTema.textContent = t === 'escuro' ? '☀️' : '🌙';
  localStorage.setItem(TEMA_KEY, t);
}

setTema(localStorage.getItem(TEMA_KEY) || 'claro');

btnTema.addEventListener('click', () => {
  setTema(document.body.classList.contains('tema-escuro') ? 'claro' : 'escuro');
});

/* ---------- Filtro de projetos ---------- */
const filtros  = document.querySelectorAll('.filtro');
const cards    = document.querySelectorAll('.card-projeto');

filtros.forEach(btn => {
  btn.addEventListener('click', () => {
    filtros.forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');

    const cat = btn.dataset.filtro;
    cards.forEach(c => {
      c.classList.toggle('oculto', cat !== 'todos' && c.dataset.categoria !== cat);
    });
  });
});

/* ---------- Animação das barras de skill ao entrar na tela ---------- */
const barras = document.querySelectorAll('.barra-fill');

const obsBarra = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el  = entry.target;
    const alvo = el.style.width;
    el.style.width = '0';
    requestAnimationFrame(() => setTimeout(() => { el.style.width = alvo; }, 80));
    obsBarra.unobserve(el);
  });
}, { threshold: 0.3 });

barras.forEach(b => obsBarra.observe(b));

/* ---------- Validação e envio do formulário ---------- */
const form = document.getElementById('formContato');
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function erro(id, campo, msg) {
  campo.classList.add('erro');
  campo.classList.remove('ok');
  const span = document.getElementById(id);
  span.textContent = msg;
  span.classList.add('vis');
}

function ok(id, campo) {
  campo.classList.remove('erro');
  campo.classList.add('ok');
  const span = document.getElementById(id);
  span.textContent = '';
  span.classList.remove('vis');
}

function validar() {
  const nome     = document.getElementById('nome');
  const email    = document.getElementById('email');
  const mensagem = document.getElementById('mensagem');
  let valido = true;

  if (nome.value.trim().length < 3) {
    erro('erroNome', nome, 'Informe seu nome completo.');
    valido = false;
  } else {
    ok('erroNome', nome);
  }

  if (!REGEX_EMAIL.test(email.value.trim())) {
    erro('erroEmail', email, 'E-mail inválido — use o formato usuario@dominio.com');
    valido = false;
  } else {
    ok('erroEmail', email);
  }

  if (mensagem.value.trim().length < 10) {
    erro('erroMensagem', mensagem, 'Mensagem muito curta (mínimo 10 caracteres).');
    valido = false;
  } else {
    ok('erroMensagem', mensagem);
  }

  return valido;
}

// valida campo individualmente ao sair dele
['nome', 'email', 'mensagem'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('blur', validar);
  el.addEventListener('input', () => {
    if (el.classList.contains('erro')) {
      document.getElementById('erro' + id[0].toUpperCase() + id.slice(1)).classList.remove('vis');
    }
  });
});

/* ---------- Modal de confirmação ---------- */
const modal   = document.getElementById('modal');
const overlay = document.getElementById('overlay');
const btnFechar = document.getElementById('btnFecharModal');

function abrirModal() {
  modal.classList.add('vis');
  overlay.classList.add('vis');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  btnFechar.focus();
}

function fecharModal() {
  modal.classList.remove('vis');
  overlay.classList.remove('vis');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

btnFechar.addEventListener('click', fecharModal);
overlay.addEventListener('click', fecharModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharModal(); });

form.addEventListener('submit', e => {
  e.preventDefault();
  if (!validar()) return;

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  // simula delay de envio
  setTimeout(() => {
    form.reset();
    form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('ok', 'erro'));
    btn.textContent = 'Enviar mensagem';
    btn.disabled = false;
    abrirModal();
  }, 800);
});
