const ICONE_LUA = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
const ICONE_SOL = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

// menu mobile — abre e fecha o nav quando clica no hambúrguer
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const aberto = navLinks.classList.toggle('aberto');
  navToggle.setAttribute('aria-expanded', aberto);
});

// fecha o menu ao clicar num link (senão fica aberto depois de navegar)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('aberto');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', e => {
  if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('aberto');
  }
});

// marca o link do menu como ativo conforme a seção visível na tela
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

// tema claro/escuro — salva a escolha no localStorage
const btnTema = document.getElementById('btnTema');

function setTema(t) {
  document.body.classList.toggle('tema-escuro', t === 'escuro');
  document.body.classList.toggle('tema-claro',  t !== 'escuro');
  btnTema.innerHTML = t === 'escuro' ? ICONE_SOL : ICONE_LUA;
  localStorage.setItem('tema', t);
}

setTema(localStorage.getItem('tema') || 'claro');

btnTema.addEventListener('click', () => {
  setTema(document.body.classList.contains('tema-escuro') ? 'claro' : 'escuro');
});

// filtro de projetos por categoria
document.querySelectorAll('.filtro').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filtro').forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');

    const cat = btn.dataset.filtro;
    document.querySelectorAll('.card-projeto').forEach(card => {
      card.classList.toggle('oculto', cat !== 'todos' && card.dataset.categoria !== cat);
    });
  });
});


// validação do formulário de contato
const form = document.getElementById('formContato');
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function mostrarErro(campo, idSpan, msg) {
  campo.classList.add('erro');
  campo.classList.remove('ok');
  const span = document.getElementById(idSpan);
  span.textContent = msg;
  span.classList.add('vis');
}

function limparErro(campo, idSpan) {
  campo.classList.remove('erro');
  campo.classList.add('ok');
  const span = document.getElementById(idSpan);
  span.textContent = '';
  span.classList.remove('vis');
}

function validar() {
  const nome     = document.getElementById('nome');
  const email    = document.getElementById('email');
  const mensagem = document.getElementById('mensagem');
  let ok = true;

  if (nome.value.trim().length < 3) {
    mostrarErro(nome, 'erroNome', 'Informe seu nome completo.');
    ok = false;
  } else {
    limparErro(nome, 'erroNome');
  }

  // verifica formato do e-mail com regex
  if (!REGEX_EMAIL.test(email.value.trim())) {
    mostrarErro(email, 'erroEmail', 'E-mail inválido — use o formato usuario@dominio.com');
    ok = false;
  } else {
    limparErro(email, 'erroEmail');
  }

  if (mensagem.value.trim().length < 10) {
    mostrarErro(mensagem, 'erroMensagem', 'Mensagem muito curta (mínimo 10 caracteres).');
    ok = false;
  } else {
    limparErro(mensagem, 'erroMensagem');
  }

  return ok;
}

['nome', 'email', 'mensagem'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('blur', validar);
  el.addEventListener('input', () => {
    if (el.classList.contains('erro')) {
      document.getElementById('erro' + id[0].toUpperCase() + id.slice(1)).classList.remove('vis');
    }
  });
});

// modal de confirmação após envio
const modal     = document.getElementById('modal');
const overlay   = document.getElementById('overlay');
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

  setTimeout(() => {
    form.reset();
    form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('ok', 'erro'));
    btn.textContent = 'Enviar mensagem';
    btn.disabled = false;
    abrirModal();
  }, 800);
});
