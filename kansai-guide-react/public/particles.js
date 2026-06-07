(function () {
  'use strict';

  var canvas = document.createElement('canvas');
  canvas.id = 'ptc';
  canvas.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'width:100%', 'height:100%',
    'pointer-events:none', 'z-index:9999', 'opacity:0.55'
  ].join(';');
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var W = 0, H = 0;
  var particles = [];
  var COUNT = 70;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function Particle() { this.reset(true); }

  Particle.prototype.reset = function (init) {
    this.x     = rand(0, W);
    this.y     = init ? rand(0, H) : H + 10;
    this.r     = rand(1.2, 3.2);
    this.vy    = rand(0.25, 0.7);
    this.vx    = rand(-0.3, 0.3);
    this.alpha = rand(0.12, 0.55);
    this.pulse = rand(0, Math.PI * 2);
    this.ps    = rand(0.008, 0.022);
    /* sakura-petal shape: 0 = circle, 1 = diamond */
    this.shape = Math.random() < 0.4 ? 1 : 0;
    /* colour: deep red, bright red, or soft pink */
    var c = Math.random();
    this.color = c < 0.45 ? '#e53030'
               : c < 0.75 ? '#ff6b35'
               :             '#ffb3b3';
  };

  Particle.prototype.update = function () {
    this.pulse += this.ps;
    this.x += this.vx + Math.sin(this.pulse) * 0.4;
    this.y -= this.vy;
    if (this.y < -10 || this.x < -20 || this.x > W + 20) this.reset(false);
  };

  Particle.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle   = this.color;
    if (this.shape === 1) {
      /* diamond / petal */
      ctx.translate(this.x, this.y);
      ctx.rotate(this.pulse * 0.5);
      ctx.beginPath();
      ctx.moveTo(0, -this.r * 1.6);
      ctx.lineTo(this.r * 0.9, 0);
      ctx.lineTo(0, this.r * 1.6);
      ctx.lineTo(-this.r * 0.9, 0);
      ctx.closePath();
    } else {
      /* circle / spark */
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.restore();
  };

  /* star glints scattered at fixed positions */
  var glints = [];
  function makeGlints() {
    glints = [];
    var n = Math.floor(W * H / 40000);
    for (var i = 0; i < Math.min(n, 22); i++) {
      glints.push({ x: rand(0, W), y: rand(0, H), phase: rand(0, Math.PI * 2), s: rand(2, 5) });
    }
  }

  function drawGlint(g, t) {
    var a = (Math.sin(g.phase + t * 0.0015) + 1) / 2 * 0.35;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth   = 0.8;
    ctx.translate(g.x, g.y);
    ctx.beginPath();
    ctx.moveTo(-g.s, 0); ctx.lineTo(g.s, 0);
    ctx.moveTo(0, -g.s); ctx.lineTo(0, g.s);
    ctx.stroke();
    ctx.restore();
  }

  resize();
  makeGlints();
  window.addEventListener('resize', function () { resize(); makeGlints(); });

  for (var i = 0; i < COUNT; i++) {
    particles.push(new Particle());
  }

  var t = 0;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < COUNT; i++) {
      particles[i].update();
      particles[i].draw();
    }
    for (var j = 0; j < glints.length; j++) drawGlint(glints[j], t);
    t++;
    requestAnimationFrame(animate);
  }

  animate();
})();
