// app.js - simple particles + count up
(function(){
  // Canvas particles
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const particles = [];
  const PARTICLE_COUNT = Math.floor((w*h)/60000) + 50;

  function rand(min,max){ return Math.random()*(max-min)+min; }

  window.addEventListener('resize', ()=>{
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  function createParticles(){
    particles.length = 0;
    for(let i=0;i<PARTICLE_COUNT;i++){
      particles.push({
        x: Math.random()*w,
        y: Math.random()*h,
        vx: rand(-0.15,0.15),
        vy: rand(-0.2,0.2),
        r: rand(0.6,2.2),
        hue: Math.random()*360
      });
    }
  }
  createParticles();

  function draw(){
    ctx.clearRect(0,0,w,h);
    // faint background gradient
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0, 'rgba(5,5,8,0.95)');
    g.addColorStop(1, 'rgba(10,6,12,0.95)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    // draw connections
    for(let i=0;i<particles.length;i++){
      const p = particles[i];
      for(let j=i+1;j<particles.length;j++){
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if(d < 140){
          const alpha = 0.12 * (1 - d/140);
          ctx.beginPath();
          ctx.moveTo(p.x,p.y);
          ctx.lineTo(q.x,q.y);
          ctx.strokeStyle = 'rgba(120,70,160,' + alpha + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // draw particles
    for(const p of particles){
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < 0) p.x = w;
      if(p.x > w) p.x = 0;
      if(p.y < 0) p.y = h;
      if(p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(160,120,255,0.9)';
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  // Simple count up animation
  function animateCounts(){
    const nums = document.querySelectorAll('.num');
    nums.forEach(el=>{
      const target = parseInt(el.getAttribute('data-target') || '0',10);
      const duration = 2000 + Math.random()*1000;
      let start = null;
      function step(ts){
        if(!start) start = ts;
        const progress = Math.min((ts-start)/duration,1);
        const value = Math.floor(progress * target);
        el.textContent = value.toLocaleString();
        if(progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(step);
    });
  }
  // Trigger when visible
  let played = false;
  function onScroll(){
    if(played) return;
    const rect = document.querySelector('.stats').getBoundingClientRect();
    if(rect.top < window.innerHeight - 100){
      animateCounts();
      played = true;
    }
  }
  window.addEventListener('scroll', onScroll);
  // also run after load (in case already visible)
  setTimeout(onScroll,400);

})();