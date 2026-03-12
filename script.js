/**
 * inVicta Digital Team — Enhanced Interactions
 * GSAP + ScrollTrigger + Matter.js
 */
(function () {
  'use strict';
  const C = { accent: [255,119,0], gold: [255,170,0], glow: [232,132,44] };
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  /* ═══ 1 · NAVBAR ═══ */
  function initNavbar() {
    const nav = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    if (toggle && links) {
      toggle.addEventListener('click', () => { toggle.classList.toggle('active'); links.classList.toggle('open'); });
      links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { toggle.classList.remove('active'); links.classList.remove('open'); }));
    }
    const sections = document.querySelectorAll('section[id]');
    const navAs = links ? links.querySelectorAll('a') : [];
    if (sections.length && navAs.length) {
      window.addEventListener('scroll', () => {
        let cur = '';
        sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) cur = s.id; });
        navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${cur}`));
      }, { passive: true });
    }
  }

  /* ═══ 2 · GSAP SCROLL REVEAL ═══ */
  function initScrollAnimations() {
    if (typeof gsap === 'undefined') {
      document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.reveal').forEach(el => {
      let d = 0;
      if (el.classList.contains('reveal-delay-1')) d = 0.05;
      if (el.classList.contains('reveal-delay-2')) d = 0.1;
      if (el.classList.contains('reveal-delay-3')) d = 0.15;
      if (el.classList.contains('reveal-delay-4')) d = 0.2;
      gsap.fromTo(el, { y: 25, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.55, delay: d, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' }
      });
    });
    // Card stagger
    ['.datos-grid .dato-card', '.metas-grid .meta-card', '.subareas-grid .subarea-card', '.leaders-row .leader-card'].forEach(sel => {
      const cards = gsap.utils.toArray(sel);
      if (!cards.length) return;
      gsap.fromTo(cards, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: cards[0].parentElement, start: 'top 88%' }
      });
    });
    // Area cards
    const areaCds = gsap.utils.toArray('.area-card');
    if (areaCds.length) {
      gsap.fromTo(areaCds, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: '.areas-grid', start: 'top 88%' }
      });
    }
    // Process steps
    const steps = gsap.utils.toArray('.process-step');
    if (steps.length) {
      gsap.fromTo(steps, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: steps[0], start: 'top 90%' }
      });
    }

    // Text Color "Reveal" on Scroll effect
    // We exclude footer texts and subtitles to keep hierarchy
    const paragraphs = gsap.utils.toArray('p:not(.footer-tagline):not(.footer-copy):not(.area-subtitle):not(.section-subtitle):not(.hero-subtitle)');
    if (paragraphs.length) {
      paragraphs.forEach(p => {
        gsap.to(p, {
          color: '#ffffff',
          scrollTrigger: {
            trigger: p,
            start: 'top 90%', // Begins to brighten as it enters the view
            end: 'top 60%',   // Reaches pure white slightly above middle of screen
            scrub: 0.5        // Smooth fluid interpolation linked to scroll position
          }
        });
      });
    }
  }

  /* ═══ 3 · INTERACTIVE HERO PARTICLES ═══ */
  function initHeroParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, mx = -9e3, my = -9e3;
    const pts = [], N = 110, CD = 130;
    const resize = () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; };
    addEventListener('resize', resize); resize();
    for (let i = 0; i < N; i++) {
      const c = Math.random() > 0.45 ? C.accent : C.gold;
      pts.push({ x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-.5)*.6, vy: (Math.random()-.5)*.6,
        r: Math.random()*2.5+.5, a: Math.random()*.45+.08, c, ph: Math.random()*6.28, sp: Math.random()*.015+.008 });
    }
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    addEventListener('mouseleave', () => { mx = my = -9e3; });
    (function loop() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]; p.ph += p.sp;
        const br = .65 + Math.sin(p.ph) * .35;
        const dx = mx-p.x, dy = my-p.y, dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 180 && dist > 0) { const f = (180-dist)/180*.4; p.vx -= (dx/dist)*f; p.vy -= (dy/dist)*f; }
        p.x += p.vx; p.y += p.vy; p.vx *= .985; p.vy *= .985;
        if (p.x<-10) p.x=W+10; if (p.x>W+10) p.x=-10; if (p.y<-10) p.y=H+10; if (p.y>H+10) p.y=-10;
        const al = p.a * br;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28);
        ctx.fillStyle = rgba(p.c, al);
        ctx.shadowBlur = p.r * 4; ctx.shadowColor = rgba(p.c, al*.5); ctx.fill(); ctx.shadowBlur = 0;
        for (let j = i+1; j < pts.length; j++) {
          const q = pts[j], ddx = p.x-q.x, ddy = p.y-q.y, d2 = ddx*ddx+ddy*ddy;
          if (d2 < CD*CD) {
            const s = 1 - Math.sqrt(d2)/CD;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = rgba(C.glow, s*.12); ctx.lineWidth = s; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(loop);
    })();
  }

  /* ═══ 4 · MATTER.JS AVATAR PHYSICS (hover-push) ═══ */
  function initAvatarPhysics() {
    if (typeof Matter === 'undefined') return;
    const box = document.querySelector('.hero-avatars');
    if (!box) return;
    const avs = Array.from(box.querySelectorAll('.hero-avatar'));
    if (!avs.length) return;
    const { Engine, Bodies, Body, Composite, Runner } = Matter;
    const cw = box.offsetWidth, ch = 220, R = 38;
    box.style.height = ch + 'px'; box.style.position = 'relative'; box.style.display = 'block';
    box.style.flexWrap = 'unset'; box.style.justifyContent = 'unset'; box.style.gap = 'unset';
    // Start with NO gravity — avatars stay aligned
    const engine = Engine.create({ gravity: { x: 0, y: 0 } });
    const wo = { isStatic: true, friction: .3, restitution: .5 };
    Composite.add(engine.world, [
      Bodies.rectangle(cw/2, ch+25, cw+200, 50, wo),
      Bodies.rectangle(-25, ch/2, 50, ch*2, wo),
      Bodies.rectangle(cw+25, ch/2, 50, ch*2, wo),
      Bodies.rectangle(cw/2, -25, cw+200, 50, wo)
    ]);
    const gap = cw / (avs.length + 1);
    const startY = R + 10; // aligned near top
    const bodies = avs.map((_, i) => {
      const b = Bodies.circle(gap*(i+1), startY, R,
        { restitution: .65, friction: .05, frictionAir: .018, density: .0012 });
      Body.setVelocity(b, { x: 0, y: 0 }); // start still
      Composite.add(engine.world, b); return b;
    });
    avs.forEach(a => { a.style.position = 'absolute'; a.style.cursor = 'default'; a.style.zIndex = '5'; a.style.pointerEvents = 'none'; });
    // After 0.4s, enable gravity so they DROP
    setTimeout(() => {
      engine.gravity.y = 0.6;
      bodies.forEach(b => {
        Body.setVelocity(b, { x: (Math.random()-.5)*2.5, y: (Math.random())*2 });
      });
    }, 400);
    // Mouse hover repulsion (no click needed)
    let bmx = -9e3, bmy = -9e3;
    const REPULSE_RADIUS = 180, REPULSE_FORCE = 0.06;
    box.addEventListener('mousemove', e => {
      const rect = box.getBoundingClientRect();
      bmx = e.clientX - rect.left; bmy = e.clientY - rect.top;
    });
    box.addEventListener('mouseleave', () => { bmx = bmy = -9e3; });
    setInterval(() => {
      bodies.forEach(b => { if (Math.random() > .5) Body.applyForce(b, b.position, { x: (Math.random()-.5)*.002, y: -Math.random()*.003 }); });
    }, 2500);
    const runner = Runner.create();
    Runner.run(runner, engine);
    (function render() {
      // Apply hover repulsion each frame
      bodies.forEach(b => {
        const dx = b.position.x - bmx, dy = b.position.y - bmy;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < REPULSE_RADIUS && dist > 1) {
          const force = (REPULSE_RADIUS - dist) / REPULSE_RADIUS * REPULSE_FORCE;
          Body.applyForce(b, b.position, { x: (dx/dist)*force, y: (dy/dist)*force });
        }
      });
      bodies.forEach((b, i) => {
        avs[i].style.left = (b.position.x - R) + 'px';
        avs[i].style.top = (b.position.y - R) + 'px';
        avs[i].style.transform = `rotate(${b.angle}rad)`;
      });
      requestAnimationFrame(render);
    })();
  }

  /* ═══ 5 · CARD HOVER PARTICLE EFFECTS (dense shapes) ═══ */
  function initCardParticles() {
    const cards = document.querySelectorAll('.area-card[data-particle-shape]');
    if (!cards.length) return;
    cards.forEach(card => {
      const shape = card.dataset.particleShape;
      const cvs = document.createElement('canvas');
      cvs.className = 'card-particles-canvas';
      card.style.position = 'relative'; card.style.overflow = 'hidden';
      card.insertBefore(cvs, card.firstChild);
      const ctx = cvs.getContext('2d');
      let hovering = false, cw, ch;
      const N = 180, dots = [];
      const resize = () => { const r = card.getBoundingClientRect(); cw = cvs.width = r.width; ch = cvs.height = r.height; updateTargets(); };
      function getShapePoints() {
        const p = [];
        if (shape === 'dollar') {
          // ── Vertical bar (center) ── ~64 pts
          for (let y = .08; y <= .88; y += .025) {
            p.push({x:.49, y:y}); p.push({x:.51, y:y});
          }
          // ── Top arc: opens LEFT (top of S) ── ~58 pts
          for (let a = 1.5; a <= 4.8; a += .11) {
            const bx = .44 + Math.cos(a)*.12;
            const by = .28 + Math.sin(a)*.14;
            p.push({x:bx, y:by}); p.push({x:bx-.01, y:by});
          }
          // ── Bottom arc: opens RIGHT (bottom of S) ── ~58 pts
          for (let a = -1.6; a <= 1.6; a += .11) {
            const bx = .56 + Math.cos(a)*.12;
            const by = .64 + Math.sin(a)*.14;
            p.push({x:bx, y:by}); p.push({x:bx+.01, y:by});
          }
        } else {
          // ── Curly braces { } ── ~180 pts (30 iterations * 6)
          for (let t = 0; t <= 1; t += .034) {
            const y = .08 + t * .84;
            const indent = Math.exp(-(Math.pow((t-.5)/.15, 2))) * .12;
            // Left brace { — 3 layers wide
            const lx = .33 - indent;
            p.push({x:lx, y:y}); p.push({x:lx-.015, y:y}); p.push({x:lx+.015, y:y});
            // Right brace } — 3 layers wide
            const rx = .67 + indent;
            p.push({x:rx, y:y}); p.push({x:rx+.015, y:y}); p.push({x:rx-.015, y:y});
          }
        }
        return p;
      }
      function updateTargets() {
        const sp = getShapePoints();
        dots.forEach((d, i) => { const t = sp[i % sp.length]; d.tx = t.x * cw; d.ty = t.y * ch; });
      }
      for (let i = 0; i < N; i++) dots.push({ x: 0, y: 0, vx: (Math.random()-.5)*1.5, vy: (Math.random()-.5)*1.5,
        tx: 0, ty: 0, r: Math.random()*2.2+1.2, a: .1 });
      resize(); dots.forEach(d => { d.x = Math.random()*cw; d.y = Math.random()*ch; });
      window.addEventListener('resize', resize);
      card.addEventListener('mouseenter', () => hovering = true);
      card.addEventListener('mouseleave', () => hovering = false);
      (function anim() {
        ctx.clearRect(0, 0, cw, ch);
        dots.forEach(d => {
          if (hovering) {
            d.x += (d.tx - d.x) * .08; d.y += (d.ty - d.y) * .08; d.a += (.85 - d.a) * .07;
          } else {
            d.x += d.vx; d.y += d.vy; d.a += (.1 - d.a) * .04;
            if (d.x < 0 || d.x > cw) d.vx *= -1; if (d.y < 0 || d.y > ch) d.vy *= -1;
            d.x = Math.max(0, Math.min(cw, d.x)); d.y = Math.max(0, Math.min(ch, d.y));
          }
          ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.28);
          ctx.fillStyle = rgba(C.accent, d.a);
          ctx.shadowBlur = 6; ctx.shadowColor = rgba(C.accent, d.a*.4); ctx.fill(); ctx.shadowBlur = 0;
        });
        requestAnimationFrame(anim);
      })();
    });
  }

  /* ═══ 6 · CODE RAIN IN WEBSITE CARD ═══ */
  function initCodeRain() {
    const card = document.querySelector('.area-card[data-code-rain]');
    if (!card) return;
    const cvs = document.createElement('canvas');
    cvs.className = 'card-particles-canvas code-rain';
    card.insertBefore(cvs, card.firstChild);
    const ctx = cvs.getContext('2d');
    let cw, ch;
    const chars = '</>{}();=>#.class@media:root$var'.split('');
    const cols = [];
    function resize() {
      const r = card.getBoundingClientRect(); cw = cvs.width = r.width; ch = cvs.height = r.height;
      cols.length = 0;
      const sz = 14, nc = Math.floor(cw / sz);
      for (let i = 0; i < nc; i++) cols.push({ x: i * sz, y: Math.random() * ch * -1, speed: Math.random() * 1.5 + .5 });
    }
    resize(); window.addEventListener('resize', resize);
    (function anim() {
      ctx.fillStyle = 'rgba(10,5,0,0.06)'; ctx.fillRect(0, 0, cw, ch);
      ctx.font = '12px monospace';
      cols.forEach(c => {
        ctx.fillStyle = rgba(C.accent, Math.random() * .15 + .05);
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], c.x, c.y);
        c.y += c.speed; if (c.y > ch) c.y = -20;
      });
      requestAnimationFrame(anim);
    })();
  }

  /* ═══ 7 · SMOOTH ANCHORS ═══ */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });
  }

  /* ═══ 8 · VIDEO PLAYER (play cursor + fullscreen + scroll grow) ═══ */
  function initVideoPlayer() {
    // 8.1 Custom Cursor Logic
    const playCursorEl = document.createElement('div');
    playCursorEl.className = 'custom-play-cursor-el';
    playCursorEl.innerHTML = `<svg viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg><span>Play intro</span>`;
    document.body.appendChild(playCursorEl);

    let cursorActive = false;
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    window.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      if (cursorActive) {
        playCursorEl.style.left = cx + 'px';
        playCursorEl.style.top = cy + 'px';
      }
    });

    // 8.2 GSAP Video Size Expand on Scroll
    const growWrapper = document.querySelector('.video-grow-wrapper');
    if (growWrapper && typeof gsap !== 'undefined') {
      const containerToGrow = growWrapper.querySelector('.subpage-video-container');
      if (containerToGrow) {
        gsap.to(containerToGrow, {
          width: '100vw',
          maxWidth: '100vw',
          borderRadius: 0,
          scrollTrigger: {
            trigger: growWrapper,
            start: 'top 85%',
            end: 'top 15%',
            scrub: true
          }
        });
      }
    }

    // 8.3 Interaction & Fullscreen Focus Logic
    const containers = document.querySelectorAll('.subpage-video-container');
    containers.forEach(container => {
      container.classList.add('play-cursor');

      container.addEventListener('mouseenter', () => {
        if (!document.fullscreenElement) {
          cursorActive = true;
          playCursorEl.style.left = cx + 'px';
          playCursorEl.style.top = cy + 'px';
          playCursorEl.classList.add('active');
        }
      });
      container.addEventListener('mouseleave', () => {
        cursorActive = false;
        playCursorEl.classList.remove('active');
      });

      const video = container.querySelector('video');
      const placeholder = container.querySelector('.video-placeholder');
      if (video) {
        video.removeAttribute('controls');
        
        container.addEventListener('click', async () => {
          try {
            const fsPromise = video.requestFullscreen 
              ? video.requestFullscreen() 
              : (video.webkitRequestFullscreen ? video.webkitRequestFullscreen() : null);
            
            if (fsPromise) await fsPromise;

            video.muted = false;
            video.currentTime = 0;
            video.setAttribute('controls', 'true');
            video.play().catch(e => console.warn('Video failed to start:', e));
          } catch (err) {
            console.error('Fullscreen request failed:', err);
          }
        });
        
        document.addEventListener('fullscreenchange', () => {
          const isFs = document.fullscreenElement === video || document.fullscreenElement === container;
          if (isFs) {
            cursorActive = false;
            playCursorEl.classList.remove('active');
          } else {
            video.removeAttribute('controls');
            video.muted = true;
            video.play().catch(e => console.warn('Background playback paused:', e));
          }
        });
      } else if (placeholder) {
        container.addEventListener('click', () => {
          placeholder.querySelector('p').textContent = 'Video aún no disponible';
        });
      }
    });
  }

  /* ═══ 9 · PAGE TRANSITION (Back Button Smoothness) ═══ */
  function initPageTransitions() {
    const backLinks = document.querySelectorAll('.back-link');
    backLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        // Fallback flag
        let transitioned = false;
        
        // Add a smooth fade out to body
        document.body.style.transition = 'opacity 0.35s ease';
        document.body.style.opacity = '0';
        
        // Wait for fade to finish, then go back
        setTimeout(() => {
          if(!transitioned) {
             transitioned = true;
             history.back();
          }
        }, 350);
      });
    });

    // When returning via history browser native buttons or history.back (bfcache restore)
    window.addEventListener('pageshow', (event) => {
        // Restore opacity immediately if we came back to this page
        document.body.style.transition = 'none';
        document.body.style.opacity = '1';
        // Add it back after a tiny delay so future clicks work
        setTimeout(() => {
           document.body.style.transition = 'opacity 0.35s ease';
        }, 50);
    });
  }

  /* ═══ BOOT ═══ */
  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimations();
    initHeroParticles();
    initAvatarPhysics();
    initCardParticles();
    initCodeRain();
    initSmoothAnchors();
    initVideoPlayer();
    initPageTransitions();
  });
})();
