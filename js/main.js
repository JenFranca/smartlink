// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Menu hamburguer
const mobileBtn = document.querySelector('.navbar-mobile-btn');
const navbarLinks = document.querySelector('.navbar-links');

mobileBtn.addEventListener('click', () => {
  navbarLinks.classList.toggle('open');
  mobileBtn.textContent = navbarLinks.classList.contains('open') ? '✕' : '☰';
});

navbarLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navbarLinks.classList.remove('open');
    mobileBtn.textContent = '☰';
  });
});

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navbarLinks.classList.remove('open');
    mobileBtn.textContent = '☰';
  }
});

// Revelação ao rolar, em sequência (um card depois do outro)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('visivel');
    observer.unobserve(el);
    // remove o atraso depois de aparecer, para não atrasar o hover
    setTimeout(() => { el.style.transitionDelay = ''; }, 900 + parseFloat(el.style.transitionDelay || 0) * 1000);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card-diferencial, .planos-destaque, .card-tec, .card-contato, .card-depoimento, .passo').forEach(el => {
  const irmaos = Array.from(el.parentElement.children).filter(c => c.matches('.card-diferencial, .planos-destaque, .card-tec, .card-contato, .card-depoimento, .passo'));
  el.classList.add('reveal');
  el.style.transitionDelay = `${irmaos.indexOf(el) * 0.09}s`;
  observer.observe(el);
});

// Menu: destaca a seção visível
const secoesMenu = Array.from(navbarLinks.querySelectorAll('a[href^="#"]'))
  .map(a => ({ link: a, secao: document.querySelector(a.getAttribute('href')) }))
  .filter(s => s.secao);

const menuObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    secoesMenu.forEach(s => s.link.classList.toggle('ativo', s.secao === entry.target));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
secoesMenu.forEach(s => menuObserver.observe(s.secao));

// Consulta de CEP → WhatsApp
const cepForm = document.getElementById('cep-form');
if (cepForm) {
  const cepInput = document.getElementById('cep-input');
  const numeroInput = document.getElementById('cep-numero');
  const enderecoEl = document.getElementById('cep-endereco');
  let endereco = null;

  cepInput.addEventListener('input', async () => {
    const digitos = cepInput.value.replace(/\D/g, '').slice(0, 8);
    cepInput.value = digitos.length > 5 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : digitos;
    endereco = null;
    enderecoEl.textContent = '';
    enderecoEl.classList.remove('erro');
    if (digitos.length !== 8) return;

    enderecoEl.textContent = 'Buscando endereço...';
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${digitos}/json/`);
      const dados = await resp.json();
      if (dados.erro) throw new Error('CEP não encontrado');
      endereco = dados;
      enderecoEl.textContent = [dados.logradouro, dados.bairro, `${dados.localidade}/${dados.uf}`].filter(Boolean).join(', ');
    } catch {
      enderecoEl.textContent = 'Não encontramos esse CEP, mas pode enviar assim mesmo que verificamos para você.';
      enderecoEl.classList.add('erro');
    }
  });

  cepForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cep = cepInput.value.trim();
    if (cep.replace(/\D/g, '').length !== 8) {
      enderecoEl.textContent = 'Digite um CEP com 8 números.';
      enderecoEl.classList.add('erro');
      cepInput.focus();
      return;
    }
    const numero = numeroInput.value.trim();
    let local = `CEP ${cep}`;
    if (endereco) {
      local = [endereco.logradouro && `${endereco.logradouro}${numero ? `, nº ${numero}` : ''}`, endereco.bairro, `${endereco.localidade}/${endereco.uf}`, `CEP ${cep}`].filter(Boolean).join(' - ');
    } else if (numero) {
      local += `, nº ${numero}`;
    }
    const msg = `Olá! Gostaria de conhecer os planos disponíveis no meu endereço: ${local}.`;
    window.open(`https://wa.me/5512997633785?text=${encodeURIComponent(msg)}`, '_blank');
  });
}

// Pulso de luz percorrendo as linhas dos divisores (fibra)
document.querySelectorAll('.neon-divider svg line').forEach(line => {
  const pulso = line.cloneNode();
  pulso.classList.add('fibra-pulso');
  pulso.removeAttribute('stroke');
  line.after(pulso);
});

// Cores da rede animada (cada tema pode definir --net-1 / --net-2 como "r,g,b")
const rootStyle = getComputedStyle(document.documentElement);
const NET_1 = rootStyle.getPropertyValue('--net-1').trim() || '0,200,255';
const NET_2 = rootStyle.getPropertyValue('--net-2').trim() || '0,255,136';

// Canvas de fibra óptica
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Partículas
const particles = Array.from({ length: 80 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.8 + 0.3,
  dx: (Math.random() - 0.5) * 0.5,
  dy: (Math.random() - 0.5) * 0.5,
  alpha: Math.random() * 0.6 + 0.1,
  color: Math.random() > 0.7 ? NET_2 : NET_1,
}));

// Linhas de fibra
const fibers = Array.from({ length: 6 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  len: Math.random() * 200 + 100,
  angle: Math.random() * Math.PI * 2,
  speed: Math.random() * 0.008 + 0.003,
  alpha: Math.random() * 0.3 + 0.1,
  width: Math.random() * 1.5 + 0.5,
  color: Math.random() > 0.5 ? NET_1 : NET_2,
  progress: Math.random(),
}));

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Conectar partículas próximas
  particles.forEach((p, i) => {
    particles.slice(i + 1).forEach(q => {
      const dist = Math.hypot(p.x - q.x, p.y - q.y);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(${NET_1},${0.08 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  });

  // Partículas
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  // Linhas de fibra animadas
  fibers.forEach(f => {
    f.progress += f.speed;
    if (f.progress > 1) {
      f.progress = 0;
      f.x = Math.random() * canvas.width;
      f.y = Math.random() * canvas.height;
      f.angle = Math.random() * Math.PI * 2;
    }

    const tailLen = f.len * 0.4;
    const headX = f.x + Math.cos(f.angle) * f.len * f.progress;
    const headY = f.y + Math.sin(f.angle) * f.len * f.progress;
    const tailX = headX - Math.cos(f.angle) * tailLen;
    const tailY = headY - Math.sin(f.angle) * tailLen;

    const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
    grad.addColorStop(0, `rgba(${f.color},0)`);
    grad.addColorStop(1, `rgba(${f.color},${f.alpha})`);

    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(headX, headY);
    ctx.strokeStyle = grad;
    ctx.lineWidth = f.width;
    ctx.stroke();

    // Brilho na ponta
    ctx.beginPath();
    ctx.arc(headX, headY, f.width * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${f.color},${f.alpha * 0.8})`;
    ctx.fill();
  });

  requestAnimationFrame(drawScene);
}
drawScene();

// Raios curvos de fibra óptica
const speedCanvas = document.getElementById('speedlines');
const speedCtx = speedCanvas.getContext('2d');

function resizeSpeedCanvas() {
  speedCanvas.width = speedCanvas.offsetWidth;
  speedCanvas.height = speedCanvas.offsetHeight;
}
resizeSpeedCanvas();
window.addEventListener('resize', resizeSpeedCanvas);

// Rede elegante — leve como o hero
function createNetNode(isHub) {
  return {
    x: Math.random() * speedCanvas.offsetWidth,
    y: Math.random() * speedCanvas.offsetHeight,
    dx: (Math.random() - 0.5) * (isHub ? 0.2 : 0.4),
    dy: (Math.random() - 0.5) * (isHub ? 0.2 : 0.4),
    r: isHub ? Math.random() * 2 + 3 : Math.random() * 1.2 + 0.8,
    color: Math.random() > 0.5 ? NET_1 : NET_2,
    phase: Math.random() * Math.PI * 2,
    isHub,
  };
}

const allNetNodes = [
  ...Array.from({ length: 3 }, () => createNetNode(true)),
  ...Array.from({ length: 22 }, () => createNetNode(false)),
];
const netPulses = [];

function drawSpeedLines() {
  const w = speedCanvas.width;
  const h = speedCanvas.height;
  speedCtx.clearRect(0, 0, w, h);

  allNetNodes.forEach(n => {
    n.phase += 0.018;
    n.x += n.dx; n.y += n.dy;
    if (n.x < 0 || n.x > w) n.dx *= -1;
    if (n.y < 0 || n.y > h) n.dy *= -1;
  });

  // Conexões
  allNetNodes.forEach((a, i) => {
    allNetNodes.slice(i + 1).forEach(b => {
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const maxD = (a.isHub || b.isHub) ? 230 : 130;
      if (dist > maxD) return;
      const alpha = 0.1 * (1 - dist / maxD) * (a.isHub || b.isHub ? 2 : 1);
      speedCtx.beginPath();
      speedCtx.moveTo(a.x, a.y);
      speedCtx.lineTo(b.x, b.y);
      speedCtx.strokeStyle = `rgba(${NET_1},${alpha})`;
      speedCtx.lineWidth = 0.6;
      speedCtx.stroke();
      if (Math.random() < (a.isHub || b.isHub ? 0.0015 : 0.0003)) {
        const fwd = Math.random() > 0.5;
        netPulses.push({
          from: fwd ? a : b, to: fwd ? b : a,
          t: 0, speed: Math.random() * 0.012 + 0.007,
          color: Math.random() > 0.5 ? NET_1 : NET_2,
          size: Math.random() * 1.5 + 1,
        });
      }
    });
  });

  // Nós
  allNetNodes.forEach(n => {
    const breathe = Math.sin(n.phase) * 0.25 + 0.75;
    speedCtx.beginPath();
    speedCtx.arc(n.x, n.y, n.r * (n.isHub ? 4 : 3), 0, Math.PI * 2);
    speedCtx.fillStyle = `rgba(${n.color},${(n.isHub ? 0.12 : 0.06) * breathe})`;
    speedCtx.fill();
    speedCtx.beginPath();
    speedCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    speedCtx.fillStyle = `rgba(${n.color},${0.85 * breathe})`;
    speedCtx.fill();
  });

  // Pulsos com cauda
  for (let i = netPulses.length - 1; i >= 0; i--) {
    const p = netPulses[i];
    p.t += p.speed;
    if (p.t >= 1) { netPulses.splice(i, 1); continue; }
    const x = p.from.x + (p.to.x - p.from.x) * p.t;
    const y = p.from.y + (p.to.y - p.from.y) * p.t;
    const tailT = Math.max(0, p.t - 0.12);
    const tx = p.from.x + (p.to.x - p.from.x) * tailT;
    const ty = p.from.y + (p.to.y - p.from.y) * tailT;
    const tg = speedCtx.createLinearGradient(tx, ty, x, y);
    tg.addColorStop(0, `rgba(${p.color},0)`);
    tg.addColorStop(1, `rgba(${p.color},0.85)`);
    speedCtx.beginPath();
    speedCtx.moveTo(tx, ty);
    speedCtx.lineTo(x, y);
    speedCtx.strokeStyle = tg;
    speedCtx.lineWidth = p.size;
    speedCtx.lineCap = 'round';
    speedCtx.stroke();
    speedCtx.beginPath();
    speedCtx.arc(x, y, p.size * 2, 0, Math.PI * 2);
    speedCtx.fillStyle = `rgba(${p.color},0.15)`;
    speedCtx.fill();
    speedCtx.beginPath();
    speedCtx.arc(x, y, p.size * 0.8, 0, Math.PI * 2);
    speedCtx.fillStyle = `rgba(${p.color},1)`;
    speedCtx.fill();
  }

  requestAnimationFrame(drawSpeedLines);
}
drawSpeedLines();

// Contador animado
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));
