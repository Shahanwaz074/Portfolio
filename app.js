/* ===== LOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1800);
});

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ===== HAMBURGER ===== */
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobileMenu');
ham.addEventListener('click', () => mob.classList.toggle('open'));
mob.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => mob.classList.remove('open')));

/* ===== ROLE CYCLER ===== */
const roles = ['Software Development', 'Embedded Systems', 'Web Development', 'Robotics Training', 'IoT Devices '];
let ri = 0;
const roleCycle = document.getElementById('roleCycle');
function cycleRole() {
  roleCycle.style.opacity = '0';
  roleCycle.style.transform = 'translateY(-10px)';
  setTimeout(() => {
    ri = (ri + 1) % roles.length;
    roleCycle.textContent = roles[ri];
    roleCycle.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    roleCycle.style.opacity = '1';
    roleCycle.style.transform = 'translateY(0)';
  }, 300);
}
roleCycle.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
setInterval(cycleRole, 2500);

/* ===== SCROLL REVEAL (progressive enhancement) ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

// Wait until after first paint to set up animations
requestAnimationFrame(() => {
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        el.classList.add('anim-ready', 'visible');
      } else {
        el.classList.add('anim-ready');
        revealObserver.observe(el);
      }
    });
  }, 150);
});

/* ===== THREE.JS BACKGROUND ===== */
(function initThree() {
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  /* --- Particle field --- */
  const count = 1200;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
    // Cyan / purple mix
    const t = Math.random();
    colors[i * 3] = t < 0.5 ? 0.0 : 0.49;
    colors[i * 3 + 1] = t < 0.5 ? 0.96 : 0.23;
    colors[i * 3 + 2] = t < 0.5 ? 1.0 : 0.93;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const pMat = new THREE.PointsMaterial({ size: 0.18, vertexColors: true, transparent: true, opacity: 0.7 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* --- Wireframe torus (subtle background ring) --- */
  const torusGeo = new THREE.TorusGeometry(4, 1.2, 12, 50);
  const torusMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0.04 });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.rotation.x = 0.6;
  torus.position.set(6, 0, -15);
  scene.add(torus);

  /* --- Small glowing octahedrons --- */
  const octa = [];
  const octaColors = [0x00f5ff, 0x7c3aed, 0xf472b6, 0x10b981];
  for (let i = 0; i < 8; i++) {
    const g = new THREE.OctahedronGeometry(0.25 + Math.random() * 0.35);
    const m = new THREE.MeshBasicMaterial({ color: octaColors[i % octaColors.length], wireframe: true, transparent: true, opacity: 0.3 });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 50, -10 - Math.random() * 20);
    mesh.userData = { ry: (Math.random() - 0.5) * 0.01, rx: (Math.random() - 0.5) * 0.008, float: Math.random() * Math.PI * 2 };
    scene.add(mesh);
    octa.push(mesh);
  }

  /* --- Connecting lines grid --- */
  const lineGroup = new THREE.Group();
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.03 });
  for (let i = 0; i < 8; i++) {
    const pts = [];
    for (let j = 0; j < 5; j++) {
      pts.push(new THREE.Vector3((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 20));
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
    lineGroup.add(new THREE.Line(lineGeo, lineMat));
  }
  scene.add(lineGroup);

  /* --- Mouse parallax --- */
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* --- Resize --- */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* --- Animate --- */
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;

    torus.rotation.z += 0.003;
    torus.rotation.y += 0.001;

    octa.forEach(o => {
      o.rotation.y += o.userData.ry;
      o.rotation.x += o.userData.rx;
      o.position.y += Math.sin(t + o.userData.float) * 0.02;
    });

    // Camera gentle parallax
    camera.position.x += (mx * 3 - camera.position.x) * 0.03;
    camera.position.y += (-my * 2 - camera.position.y) * 0.03;

    renderer.render(scene, camera);
  }
  animate();
})();

/* ===== GSAP SCROLL ANIMATIONS ===== */
(function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Section titles
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 0, y: 30, duration: 0.8, ease: 'power3.out'
    });
  });

  // Timeline items stagger
  gsap.utils.toArray('.tl-item').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity: 0, x: -40, duration: 0.7, delay: i * 0.12, ease: 'power2.out'
    });
  });

  // Project cards stagger
  gsap.utils.toArray('.proj-card').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      opacity: 0, y: 50, scale: 0.95, duration: 0.65, delay: (i % 3) * 0.1, ease: 'back.out(1.4)'
    });
  });

  // Skill groups
  gsap.utils.toArray('.skill-group').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity: 0, y: 30, duration: 0.6, delay: i * 0.1, ease: 'power2.out'
    });
  });

  // Education cards
  gsap.utils.toArray('.edu-card').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity: 0, x: 40, duration: 0.6, delay: i * 0.12, ease: 'power2.out'
    });
  });

  // Hero orbit entrance
  gsap.from('.orbit-container', {
    opacity: 0, scale: 0.6, rotation: -30, duration: 1.5,
    delay: 2.4, ease: 'elastic.out(1, 0.6)'
  });
})();

/* ===== ACTIVE NAV LINK HIGHLIGHT ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const linkObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => linkObserver.observe(s));

/* active nav link style */
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--cyan) !important; }`;
document.head.appendChild(style);

/* ===== CONTACT FORM HANDLING (Google Forms) ===== */
window.submitted = false;

window.showSuccess = function() {
  if (!window.submitted) return;
  console.log('Form submission successful!');
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'flex';
  // Scroll to success message
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
};

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', () => {
    window.submitted = true;
    console.log('Form submitting to Google Forms...');
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... ⏳';
    }
  });
}
