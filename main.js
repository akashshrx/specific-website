document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector('button[aria-label="Toggle menu"]');
  const navMenu = document.querySelector('nav div.hidden.md\\:flex');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !expanded);
      
      if (!expanded) {
        navMenu.classList.remove('hidden');
        navMenu.classList.add('flex', 'absolute', 'top-20', 'left-6', 'right-6', 'bg-[#171719]', 'p-6', 'rounded-xl', 'flex-col', 'border', 'border-border', 'z-50');
      } else {
        navMenu.classList.add('hidden');
        navMenu.classList.remove('flex', 'absolute', 'top-20', 'left-6', 'right-6', 'bg-[#171719]', 'p-6', 'rounded-xl', 'flex-col', 'border', 'border-border', 'z-50');
      }
    });
  }

  // --- SVG Connection Grid Hover Highlighting ---
  const hoverMapping = {
    'left-7%': 'frontend',
    'left-34%': 'backend',
    'left-57%': 'sync',
    'left-81%': 'cache',
    'right-21%': 'secrets-config',
    'right-48%': 'postgres',
    'right-69%': 'storage',
    'bottom-bottom': 'envs'
  };

  const textBlocks = document.querySelectorAll('[data-index-left], [data-index-right], [data-index-bottom]');
  
  textBlocks.forEach(block => {
    let key = '';
    if (block.hasAttribute('data-index-left')) {
      key = `left-${block.getAttribute('data-index-left')}`;
    } else if (block.hasAttribute('data-index-right')) {
      key = `right-${block.getAttribute('data-index-right')}`;
    } else if (block.hasAttribute('data-index-bottom')) {
      key = `bottom-${block.getAttribute('data-index-bottom')}`;
    }

    const targetGroupId = hoverMapping[key];
    const targetGroup = document.getElementById(targetGroupId);

    if (targetGroup) {
      const elements = targetGroup.querySelectorAll('path, rect, circle, g');
      const originalColors = [];
      elements.forEach((el) => {
        originalColors.push({
          fill: el.getAttribute('fill'),
          stroke: el.getAttribute('stroke'),
          opacity: el.getAttribute('opacity') || el.style.opacity
        });
      });

      // Hover In: highlight node
      block.addEventListener('mouseenter', () => {
        elements.forEach(el => {
          if (el.getAttribute('fill') && el.getAttribute('fill') !== 'none') {
            el.setAttribute('fill', '#2366EC');
          }
          if (el.getAttribute('stroke') && el.getAttribute('stroke') !== 'none') {
            el.setAttribute('stroke', '#2366EC');
          }
          el.style.opacity = '1';
        });
        targetGroup.style.transform = 'scale(1.05)';
        targetGroup.style.transformOrigin = 'center';
        targetGroup.style.transition = 'transform 0.3s ease';
      });

      // Hover Out: restore node
      block.addEventListener('mouseleave', () => {
        elements.forEach((el, index) => {
          const orig = originalColors[index];
          if (orig.fill) el.setAttribute('fill', orig.fill);
          if (orig.stroke) el.setAttribute('stroke', orig.stroke);
          el.style.opacity = orig.opacity || '';
        });
        targetGroup.style.transform = 'scale(1)';
      });
    }
  });

  // --- Dynamic Stats Counter Count-Up ---
  const statsCounter = document.getElementById('stats-counter');
  if (statsCounter) {
    const target = parseInt(statsCounter.getAttribute('data-target'), 10);
    let countStarted = false;

    const startCount = () => {
      let current = 0;
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepValue = target / steps;
      const stepTime = duration / steps;
      
      const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          statsCounter.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          statsCounter.textContent = Math.floor(current).toLocaleString();
        }
      }, stepTime);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countStarted) {
          countStarted = true;
          startCount();
        }
      });
    }, { threshold: 0.1 });

    const statsPanel = document.getElementById('stats-panel');
    if (statsPanel) {
      observer.observe(statsPanel);
    }
  }

  // --- Simulated typing in Dev Terminal ---
  const devBody = document.getElementById('terminal-dev-body');
  if (devBody) {
    const textToType = "specific dev";
    const cursorTarget = devBody.querySelector('.cursor-blink-target');
    const cursor = devBody.querySelector('.terminal-cursor');
    
    let charIndex = 0;
    const typeNextChar = () => {
      if (charIndex < textToType.length) {
        cursorTarget.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeNextChar, 100);
      } else {
        setTimeout(showDevLogs, 600);
      }
    };

    const devLogs = [
      '<p class="text-white mt-2"> <span class="text-[#2366EC]">●</span> admin → localhost:3100</p>',
      '<p class="text-[#6D6D6D] mt-2">Services:</p>',
      '<p class="text-white"> <span class="text-[#2366EC]">●</span> web → localhost:3000</p>',
      '<p class="text-white"> <span class="text-[#2366EC]">●</span> api → localhost:3001</p>',
      '<p class="text-[#6D6D6D] mt-2">Databases:</p>',
      '<p class="text-white"> <span class="text-[#2366EC]">●</span> main → localhost:5432</p>'
    ];

    const showDevLogs = () => {
      let logIndex = 0;
      const printLog = () => {
        if (logIndex < devLogs.length) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = devLogs[logIndex];
          devBody.insertBefore(tempDiv.firstChild, cursor.parentNode);
          logIndex++;
          setTimeout(printLog, 300);
        }
      };
      printLog();
    };

    const devObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(typeNextChar, 400);
          devObserver.disconnect();
        }
      });
    }, { threshold: 0.1 });
    devObserver.observe(devBody);
  }

  // --- Simulated Deploy terminal progress ---
  const deployBody = document.getElementById('terminal-deploy-body');
  if (deployBody) {
    const linesContainer = deployBody.querySelector('.terminal-deploy-lines');
    
    const deployLogs = [
      '<p class="text-white"> <span class="text-[#2366EC]">✓</span> Building images</p>',
      '<p class="text-white"> <span class="text-[#2366EC]">✓</span> Spinning up database</p>',
      '<p class="text-white"> <span class="text-[#2366EC]">✓</span> Running migrations</p>',
      '<p class="text-white"> <span class="text-[#2366EC]">✓</span> Deploying app</p>',
      '<p class="text-[#6D6D6D] mt-2">Live at:</p>',
      '<p class="text-white"> <span class="text-[#2366EC]">●</span> web → myapp-web.spcf.app</p>',
      '<p class="text-white"> <span class="text-[#2366EC]">●</span> api → myapp-api.spcf.app</p>'
    ];

    const runDeploySequence = () => {
      linesContainer.innerHTML = '';
      let index = 0;
      const showNextLine = () => {
        if (index < deployLogs.length) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = deployLogs[index];
          linesContainer.appendChild(tempDiv.firstChild);
          index++;
          setTimeout(showNextLine, 500);
        }
      };
      showNextLine();
    };

    deployBody.parentElement.addEventListener('mouseenter', () => {
      if (linesContainer.children.length === 0) {
        runDeploySequence();
      }
    });

    const deployObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(runDeploySequence, 1500);
          deployObserver.disconnect();
        }
      });
    }, { threshold: 0.1 });
    deployObserver.observe(deployBody);
  }

  // --- Canvas Flowing ASCII & Halos ---
  const canvases = document.querySelectorAll('canvas');
  
  canvases.forEach((canvas, canvasIndex) => {
    if (canvasIndex === 0) {
      // --- Original Perlin Noise ASCII Canvas ---
      class PerlinNoise {
        constructor() {
          this.perm = [];
          for (let e = 0; e < 256; e++) this.perm[e] = e;
          for (let e = 255; e > 0; e--) {
            const t = Math.floor(Math.random() * (e + 1));
            [this.perm[e], this.perm[t]] = [this.perm[t], this.perm[e]];
          }
          for (let e = 0; e < 256; e++) this.perm[256 + e] = this.perm[e];
        }
        fade(e) {
          return e * e * e * (e * (6 * e - 15) + 10);
        }
        lerp(e, t, r) {
          return t + e * (r - t);
        }
        grad(e, t, r) {
          let n = 3 & e,
            o = n < 2 ? t : r,
            i = n < 2 ? r : t;
          return ((1 & n) == 0 ? o : -o) + ((2 & n) == 0 ? i : -i);
        }
        noise(e, t) {
          let r = 255 & Math.floor(e),
            n = 255 & Math.floor(t);
          e -= Math.floor(e), t -= Math.floor(t);
          let o = this.fade(e),
            i = this.fade(t),
            a = this.perm[r] + n,
            s = this.perm[a],
            l = this.perm[a + 1],
            c = this.perm[r + 1] + n,
            u = this.perm[c],
            d = this.perm[c + 1];
          return this.lerp(i, this.lerp(o, this.grad(this.perm[s], e, t), this.grad(this.perm[u], e - 1, t)), this.lerp(o, this.grad(this.perm[l], e, t - 1), this.grad(this.perm[d], e - 1, t - 1)));
        }
      }

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      let cellW, cellH, fontSize, s_cols, l_rows, atlasCanvas, d_scaledW, f_scaledH, totalH, p_noise, m_noise;
      const b = new PerlinNoise();
      const chars = [".", "/", "|", "\\", "-", "=", "+", "*", "<", ">", "{", "}"];
      
      function updateGridParams() {
        const isMobile = window.innerWidth < 768;
        cellW = isMobile ? 10 : 14;
        cellH = isMobile ? 10 : 14;
        fontSize = isMobile ? 10 : 14;
      }
      updateGridParams();

      let dpr = window.devicePixelRatio || 1;
      let timeVar = 0;
      let lastFrameTime = 0;
      const grayVal = 50; // subtle dark grey
      const bgColor = "#101011";
      const charCount = chars.length;
      const maxCharIndex = charCount - 1;

      function setupTextureAndGrid() {
        updateGridParams();
        const rect = canvas.getBoundingClientRect();
        const screenW = rect.width;
        const screenH = rect.height;
        canvas.width = screenW * dpr;
        canvas.height = screenH * dpr;
        ctx.scale(dpr, dpr);

        s_cols = Math.ceil(screenW / cellW);
        l_rows = Math.ceil(screenH / cellH);
        d_scaledW = Math.ceil(cellW * dpr);
        f_scaledH = Math.ceil(cellH * dpr);

        // Create texture atlas
        atlasCanvas = document.createElement("canvas");
        atlasCanvas.width = d_scaledW * charCount;
        atlasCanvas.height = 10 * f_scaledH;
        const atlasCtx = atlasCanvas.getContext("2d", { alpha: true });
        atlasCtx.textAlign = "center";
        atlasCtx.textBaseline = "middle";
        atlasCtx.font = `${fontSize * dpr}px 'Courier New', monospace`;

        for (let oIdx = 0; oIdx < 10; oIdx++) {
          const alpha = 0.2 + oIdx / 9 * 0.8;
          atlasCtx.fillStyle = `rgba(${grayVal}, ${grayVal}, ${grayVal}, ${alpha.toFixed(2)})`;
          for (let cIdx = 0; cIdx < charCount; cIdx++) {
            atlasCtx.fillText(chars[cIdx], cIdx * d_scaledW + d_scaledW / 2, oIdx * f_scaledH + f_scaledH / 2);
          }
        }

        // Initialize noise
        totalH = l_rows + 3000;
        p_noise = new Float32Array(s_cols * totalH);
        m_noise = new Float32Array(s_cols * totalH);
        for (let row = 0; row < totalH; row++) {
          const tVal = 0.02 * row;
          const offset = row * s_cols;
          for (let col = 0; col < s_cols; col++) {
            const nVal = 0.02 * col;
            p_noise[offset + col] = b.noise(nVal, tVal);
            m_noise[offset + col] = b.noise(nVal + 1000, tVal);
          }
        }
      }

      function drawNoiseASCII() {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        const timeScale1 = 10 * timeVar / 0.02;
        const tInt = 0 | timeScale1;
        const tFrac = timeScale1 - tInt;

        const timeScale2 = 8 * timeVar / 0.02;
        const oInt = 0 | timeScale2;
        const oFrac = timeScale2 - oInt;

        for (let r = 0; r < l_rows; r++) {
          const rOffset1 = (r + tInt) % totalH * s_cols;
          const rOffset2 = (r + tInt + 1) % totalH * s_cols;
          const rOffset3 = (r + oInt) % totalH * s_cols;
          const rOffset4 = (r + oInt + 1) % totalH * s_cols;
          const drawY = r * f_scaledH;

          for (let c = 0; c < s_cols; c++) {
            const noiseVal1 = p_noise[rOffset1 + c] + tFrac * (p_noise[rOffset2 + c] - p_noise[rOffset1 + c]);
            const noiseVal2 = m_noise[rOffset3 + c] + oFrac * (m_noise[rOffset4 + c] - m_noise[rOffset3 + c]);

            let charIdx = ((noiseVal1 + 1) * 0.5 * charCount) | 0;
            if (charIdx > maxCharIndex) charIdx = maxCharIndex;
            if (charIdx < 0) charIdx = 0;

            let opacityIdx = ((noiseVal2 + 1) * 5) | 0;
            if (opacityIdx >= 10) opacityIdx = 9;
            if (opacityIdx < 0) opacityIdx = 0;

            ctx.drawImage(
              atlasCanvas,
              charIdx * d_scaledW,
              opacityIdx * f_scaledH,
              d_scaledW,
              f_scaledH,
              c * d_scaledW,
              drawY,
              d_scaledW,
              f_scaledH
            );
          }
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      setupTextureAndGrid();
      drawNoiseASCII();

      let isIntersecting = false;
      let animFrameId;

      const observer = new IntersectionObserver(([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          lastFrameTime = 0;
          animFrameId = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(animFrameId);
        }
      }, { threshold: 0 });

      function loop(timestamp) {
        if (!isIntersecting) return;
        const elapsed = timestamp - lastFrameTime;
        if (elapsed < 50) {
          animFrameId = requestAnimationFrame(loop);
          return;
        }
        lastFrameTime = timestamp - (elapsed % 50);
        timeVar += 0.0005; // extremely slow movement
        drawNoiseASCII();
        animFrameId = requestAnimationFrame(loop);
      }

      observer.observe(canvas);

      const handleResize = () => {
        dpr = window.devicePixelRatio || 1;
        setupTextureAndGrid();
        drawNoiseASCII();
      };
      window.addEventListener("resize", handleResize);

    } else {
      // --- Card Canvas 1 (Grid dots / particles) logic ---
      const ctx = canvas.getContext('2d');
      let width = canvas.width = canvas.offsetWidth;
      let height = canvas.height = canvas.offsetHeight;
      
      let mouse = { x: -1000, y: -1000, targetX: width / 2, targetY: height / 2, active: false };
      
      const resize = () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      };
      window.addEventListener('resize', resize);
      
      window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      });

      window.addEventListener('mouseleave', () => {
        mouse.active = false;
        mouse.x = -1000;
        mouse.y = -1000;
      });

      const particles = [];
      const particleCount = 18;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.3 + 0.1
        });
      }

      let time = 0;
      const animate = () => {
        ctx.clearRect(0, 0, width, height);
        time += 0.001;

        if (mouse.active) {
          mouse.targetX += (mouse.x - mouse.targetX) * 0.05;
          mouse.targetY += (mouse.y - mouse.targetY) * 0.05;
        } else {
          mouse.targetX = width / 2 + Math.sin(time * 5) * 100;
          mouse.targetY = height / 2 + Math.cos(time * 3) * 50;
        }

        // --- Grid Flow for Card Canvases ---
        const gridSize = 45;
        for (let x = 0; x < width; x += gridSize) {
          for (let y = 0; y < height; y += gridSize) {
            let dotAlpha = 0.04;
            if (mouse.active) {
              const dist = Math.hypot(x - mouse.x, y - mouse.y);
              if (dist < 150) {
                const factor = (1 - dist / 150);
                dotAlpha = 0.04 + factor * 0.15;
                
                ctx.fillStyle = `rgba(35, 102, 236, ${factor * 0.03})`;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
              }
            }
            ctx.fillStyle = `rgba(255, 255, 255, ${dotAlpha})`;
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
          ctx.fillStyle = `rgba(35, 102, 236, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        requestAnimationFrame(animate);
      };

      animate();
    }
  });
});
