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

// Acordeão diferenciais no mobile
document.querySelectorAll('.card-diferencial').forEach(card => {
  card.addEventListener('click', () => {
    const isExpanded = card.classList.contains('expanded');
    document.querySelectorAll('.card-diferencial').forEach(c => c.classList.remove('expanded'));
    if (!isExpanded) card.classList.add('expanded');
  });
});

// Smooth reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card-diferencial, .card-plano, .card-contato, .card-depoimento').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

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
  color: Math.random() > 0.7 ? '0,255,136' : '0,200,255',
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
  color: Math.random() > 0.5 ? '0,200,255' : '0,255,136',
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
        ctx.strokeStyle = `rgba(0,200,255,${0.08 * (1 - dist / 100)})`;
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
