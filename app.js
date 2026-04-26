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
    console.log('Form submitting...');
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... ⏳';
    }
  });
}

/* ===== ENHANCED SECURITY & DATA MASKING ===== */
(function initSecurity() {
  // 1. Data Masking (Base64)
  const _0x5a1 = ['bWRzaGFoYW53YXowNzRAZ21haWwuY29t', 'KzkxIDc0NjQwMDUyOTE=', 'aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vZm9ybXMvZC9lLzFGQUlwUUxzZDVRV0xDZ0JKR1VMazE1dUtHVTlNVmVlMFZSUzB5cHl0d3dLNnUxbUlXU3dGaHcvZm9ybVJlc3BvbnNl'];
  const d = (s) => atob(s);

  function injectData() {
    const e = d(_0x5a1[0]);
    const p = d(_0x5a1[1]);
    const f = d(_0x5a1[2]);

    // Email
    document.querySelectorAll('[id^="em-"]').forEach(el => el.textContent = e);
    document.querySelectorAll('[id^="gm-"]').forEach(el => el.href = 'mailto:' + e);
    
    // Phone
    document.querySelectorAll('[id^="ph-"]').forEach(el => {
      if (el.tagName === 'A') el.href = 'tel:' + p.replace(/\s/g, '');
      else el.textContent = p;
    });

    // Form
    if (contactForm) contactForm.action = f;
  }

  // 2. Inspection Deterrence
  function blockDevTools() {
    // Disable Right Click
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Disable Shortcuts
    document.addEventListener('keydown', e => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
      if (
        e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || 
        (e.ctrlKey && e.keyCode === 85)
      ) {
        e.preventDefault();
        return false;
      }
    });
  }

  // 3. Anti-Debugger (Aggressive)
  function antiDebug() {
    const start = new Date();
    debugger;
    const end = new Date();
    if (end - start > 100) {
      // DevTools open
      document.body.innerHTML = '<div style="height:100vh;display:flex;align-items:center;justify-content:center;background:#050a14;color:#00f5ff;font-family:sans-serif;text-align:center;padding:20px;"><h2>Access Restricted</h2><p>Developer tools are disabled for security reasons. Please close them and refresh.</p></div>';
    }
  }

  // Initialize
  window.addEventListener('DOMContentLoaded', () => {
    injectData();
    blockDevTools();
    
    // Periodically check for debugger
    setInterval(antiDebug, 2000);
  });

  // Console warning
  console.log("%cSTOP!", "color: red; font-size: 50px; font-weight: bold; -webkit-text-stroke: 1px black;");
  console.log("%cThis is a browser feature intended for developers. If someone told you to copy-paste something here, it is a scam and will give them access to your data.", "font-size: 20px;");
})();
