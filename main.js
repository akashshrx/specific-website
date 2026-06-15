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

  // --- Brainstorming Concepts Hover Highlighting ---
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

    const blockKey = hoverMapping[key];
    if (blockKey) {
      block.addEventListener('mouseenter', () => {
        highlightCentralBlock(blockKey, true);
      });
      block.addEventListener('mouseleave', () => {
        highlightCentralBlock(blockKey, false);
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
  
  // --- Simplex Noise & Bayer Dithering backgrounds ---
  function initDitherCanvas(canvas, isFooter = false) {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const SimplexNoise = (function() {
      const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
      const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
      
      const p = new Uint8Array(256);
      for (let i = 0; i < 256; i++) p[i] = Math.floor(Math.random() * 256);
      const perm = new Uint8Array(512);
      const permMod12 = new Uint8Array(512);
      for (let i = 0; i < 512; i++) {
        perm[i] = p[i & 255];
        permMod12[i] = (perm[i] % 12);
      }
      
      const grad3 = new Float32Array([
        1,1,0, -1,1,0, 1,-1,0, -1,-1,0,
        1,0,1, -1,0,1, 1,0,-1, -1,0,-1,
        0,1,1, 0,-1,1, 0,1,-1, 0,-1,-1
      ]);

      return {
        noise2D: function(xin, yin) {
          let n0, n1, n2;
          let s = (xin + yin) * F2;
          let i = Math.floor(xin + s);
          let j = Math.floor(yin + s);
          let t = (i + j) * G2;
          let X0 = i - t;
          let Y0 = j - t;
          let x0 = xin - X0;
          let y0 = yin - Y0;
          
          let i1, j1;
          if (x0 > y0) { i1 = 1; j1 = 0; }
          else { i1 = 0; j1 = 1; }
          
          let x1 = x0 - i1 + G2;
          let y1 = y0 - j1 + G2;
          let x2 = x0 - 1.0 + 2.0 * G2;
          let y2 = y0 - 1.0 + 2.0 * G2;
          
          let ii = i & 255;
          let jj = j & 255;
          
          let gi0 = permMod12[ii + perm[jj]] * 3;
          let gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
          let gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
          
          let t0 = 0.5 - x0*x0-y0*y0;
          if (t0 < 0) n0 = 0.0;
          else {
            t0 *= t0;
            n0 = t0 * t0 * (grad3[gi0]*x0 + grad3[gi0+1]*y0);
          }
          
          let t1 = 0.5 - x1*x1-y1*y1;
          if (t1 < 0) n1 = 0.0;
          else {
            t1 *= t1;
            n1 = t1 * t1 * (grad3[gi1]*x1 + grad3[gi1+1]*y1);
          }
          
          let t2 = 0.5 - x2*x2-y2*y2;
          if (t2 < 0) n2 = 0.0;
          else {
            t2 *= t2;
            n2 = t2 * t2 * (grad3[gi2]*x2 + grad3[gi2+1]*y2);
          }
          
          return 70.0 * (n0 + n1 + n2);
        }
      };
    })();

    const bayer4x4 = [
      [0.0, 0.5, 0.125, 0.625],
      [0.75, 0.25, 0.875, 0.375],
      [0.1875, 0.6875, 0.0625, 0.5625],
      [0.9375, 0.4375, 0.8125, 0.3125]
    ];

    const cellSize = isFooter ? 20 : 14; // Hero section cells are 30% smaller (14px) than footer (20px)
    let dpr = window.devicePixelRatio || 1;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    let mouse = { x: -1000, y: -1000, active: false };
    
    if (!isFooter) {
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
    }

    let cols, rows;
    let timeVar = 0;

    function setupGrid() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / cellSize);
      rows = Math.ceil(height / cellSize);
    }

    function drawGrid() {
      const rect = canvas.getBoundingClientRect();
      const currentWidth = rect.width;
      const currentHeight = rect.height;

      if (currentWidth === 0 || currentHeight === 0) return;

      if (Math.abs(canvas.width - Math.floor(currentWidth * dpr)) > 1 || 
          Math.abs(canvas.height - Math.floor(currentHeight * dpr)) > 1) {
        setupGrid();
      }

      ctx.clearRect(0, 0, width, height);
      
      // Triangles batch draw
      ctx.fillStyle = isFooter ? 'rgba(35, 102, 236, 0.16)' : 'rgba(35, 102, 236, 0.28)';
      ctx.beginPath();
      
      const scale1 = isFooter ? 0.035 : 0.022; // High level scale for hero
      const scale2 = isFooter ? 0.075 : 0.052;
      const mouseRadius = 220;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cellCenterX = c * cellSize + cellSize / 2;
          const cellCenterY = r * cellSize + cellSize / 2;
          
          // Fractal noise for organic, cloud-like dither boundaries
          const n1 = SimplexNoise.noise2D(c * scale1 + timeVar * 0.015, r * scale1 + timeVar * 0.008);
          const n2 = SimplexNoise.noise2D(c * scale2 - timeVar * 0.007, r * scale2 + timeVar * 0.018);
          
          // Higher contrast & offset for sparser dither clusters with clean empty spaces
          let value = (n1 * 0.75 + n2 * 0.25) * 1.5 - 0.25;
          
          // Mouse Proximity influence: high impact reveal
          if (!isFooter && mouse.active) {
            const dist = Math.hypot(cellCenterX - mouse.x, cellCenterY - mouse.y);
            if (dist < mouseRadius) {
              const factor = (1 - dist / mouseRadius);
              value += factor * 0.65; // strong hover reveal
            }
          }
          
          // Compare with Bayer threshold
          const threshold = bayer4x4[r % 4][c % 4];
          if (value > threshold) {
            const x = c * cellSize;
            const y = r * cellSize;
            
            // Right-angled triangle pointing to the top-right
            ctx.moveTo(x + cellSize * 0.2, y + cellSize * 0.8);
            ctx.lineTo(x + cellSize * 0.8, y + cellSize * 0.2);
            ctx.lineTo(x + cellSize * 0.8, y + cellSize * 0.8);
            ctx.closePath();
          }
        }
      }
      ctx.fill();
    }

    setupGrid();

    let isIntersecting = false;
    let animFrameId;

    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        animFrameId = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(animFrameId);
      }
    }, { threshold: 0 });

    function loop() {
      if (!isIntersecting) return;
      timeVar += isFooter ? 0.06 : 0.008; // Speed of drift: footer (0.06), hero (0.008)
      drawGrid();
      animFrameId = requestAnimationFrame(loop);
    }

    observer.observe(canvas);

    window.addEventListener('resize', () => {
      dpr = window.devicePixelRatio || 1;
      setupGrid();
      drawGrid();
    });
  }

  // Initialize Hero and Footer Dither canvases
  const heroCanvas = document.getElementById('hero-dither-canvas');
  if (heroCanvas) {
    initDitherCanvas(heroCanvas, false);
  }

  const footerCanvas = document.getElementById('footer-dither-canvas');
  if (footerCanvas) {
    initDitherCanvas(footerCanvas, true);
  }

  // --- Building Blocks Particles logic (formerly Card Canvas 1) ---
  const cardCanvas = document.querySelector('section.relative canvas');
  if (cardCanvas) {
    const ctx = cardCanvas.getContext('2d');
    let width = cardCanvas.width = cardCanvas.offsetWidth;
    let height = cardCanvas.height = cardCanvas.offsetHeight;
    
    let mouse = { x: -1000, y: -1000, targetX: width / 2, targetY: height / 2, active: false };
    
    const resize = () => {
      width = cardCanvas.width = cardCanvas.offsetWidth;
      height = cardCanvas.height = cardCanvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    
    window.addEventListener('mousemove', (e) => {
      const rect = cardCanvas.getBoundingClientRect();
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

      // --- Grid Flow ---
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

  // --- Prompt Modal & Ask AI Handler ---
  const getStartedButtons = document.querySelectorAll('.js-get-started');
  const promptModal = document.getElementById('prompt-modal');
  const modalContent = document.getElementById('prompt-modal-content');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const copyOtherBtn = document.getElementById('copy-other-btn');
  
  const onboardingPrompt = "Help me get started with Specific by following: https://docs.specific.dev/for-ai/onboarding";
  const askAIPrompt = "I’m researching Specific.dev and want to know how they help coding agents deploy, help me breakdown their solution. Summarize the highlights from Specific's website: https://www.specific.dev";

  function openModal() {
    navigator.clipboard.writeText(onboardingPrompt).then(() => {
      console.log("Onboarding prompt copied to clipboard!");
    }).catch(err => {
      console.error("Failed to copy onboarding prompt: ", err);
    });
    
    if (promptModal && modalContent) {
      promptModal.classList.remove('opacity-0', 'pointer-events-none');
      modalContent.classList.remove('scale-95');
      modalContent.classList.add('scale-100');
    }
  }

  function closeModal() {
    if (promptModal && modalContent) {
      promptModal.classList.add('opacity-0', 'pointer-events-none');
      modalContent.classList.remove('scale-100');
      modalContent.classList.add('scale-95');
    }
  }

  getStartedButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }
  if (promptModal) {
    promptModal.addEventListener('click', (e) => {
      if (e.target === promptModal) {
        closeModal();
      }
    });
  }

  if (copyOtherBtn) {
    copyOtherBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(onboardingPrompt).then(() => {
        const tooltip = copyOtherBtn.querySelector('.id-copied-tooltip');
        if (tooltip) {
          tooltip.textContent = "Copied!";
          tooltip.classList.add('text-green-500');
          setTimeout(() => {
            tooltip.textContent = "Copy prompt";
            tooltip.classList.remove('text-green-500');
          }, 2000);
        }
      });
    });
  }

  // Ask AI about Specific Copy Event
  const askAiLinks = document.querySelectorAll('[data-ask-ai]');
  askAiLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navigator.clipboard.writeText(askAIPrompt).then(() => {
        const label = link.querySelector('.ask-label');
        if (label) {
          const originalText = label.textContent;
          if (link.id === 'ask-gemini-btn') {
            label.textContent = "Copied! Paste it";
          } else {
            label.textContent = "Copied!";
          }
          label.style.color = '#10B981'; // Green-500
          setTimeout(() => {
            label.textContent = originalText;
            label.style.color = '';
          }, 1500);
        }
      }).catch(err => {
        console.error("Failed to copy Ask AI prompt: ", err);
      });

      // Special handling for Gemini to avoid popup blocker
      if (link.id === 'ask-gemini-btn') {
        e.preventDefault();
        window.open("https://gemini.google.com/", "_blank", "noopener");
      }
    });
  });

    // ==========================================
  // --- Concepts Selector & Interactive Panels ---
  // ==========================================

  const tabBtn1 = document.getElementById('tab-concept-1');
  const tabBtn3 = document.getElementById('tab-concept-3');
  
  const view1 = document.getElementById('concept-1-view');
  const view3 = document.getElementById('concept-3-view');
  
  let activeConcept = 1;
  const allConceptKeys = ['frontend', 'secrets-config', 'backend', 'postgres', 'sync', 'storage', 'cache', 'envs'];

  const logsMapping1 = {
    'frontend': '> [frontend] compile success. domain auto-domain.spcf.app mounted. CDN cache hit 100%.',
    'secrets-config': '> [secrets] environment keys decrypted. secure vault mounted at memory-address-0x4a9b.',
    'backend': '> [backend] scale auto 1..10 services active. healthy. cpu utilization: 14%.',
    'postgres': '> [postgres] managed pg16 DB active. storage auto-scaling (1.2TB allocated).',
    'sync': '> [sync] websocket channels active. realtime push latency: 0.4ms.',
    'storage': '> [storage] bucket edge endpoint active. replicated us-east and eu-west.',
    'cache': '> [cache] redis key-value cache active. hit rate: 98%. lookup latency: 0.1ms.',
    'envs': '> [envs] prod environment duplicated to staging and dev preview pipelines.'
  };



  function switchConcept(conceptId) {
    activeConcept = conceptId;
    
    // Reset buttons styles
    [tabBtn1, tabBtn3].forEach((btn) => {
      if (!btn) return;
      const isCurrent = (btn === tabBtn1 && conceptId === 1) || (btn === tabBtn3 && conceptId === 3);
      if (isCurrent) {
        btn.classList.add('bg-[#2366EC]', 'text-white');
        btn.classList.remove('text-[#A2A2A2]', 'hover:text-white');
      } else {
        btn.classList.remove('bg-[#2366EC]', 'text-white');
        btn.classList.add('text-[#A2A2A2]', 'hover:text-white');
      }
    });

    // Reset views
    [view1, view3].forEach((view) => {
      if (!view) return;
      const isCurrent = (view === view1 && conceptId === 1) || (view === view3 && conceptId === 3);
      if (isCurrent) {
        view.classList.remove('hidden');
      } else {
        view.classList.add('hidden');
      }
    });

    // Cancel active loops
    cancelConstellationLoop();
    cancelShellTimers();
    
    if (conceptId === 1) {
      setTimeout(initConstellation, 50);
    } else if (conceptId === 3) {
      clearShell();
    }
  }

  if (tabBtn1) tabBtn1.addEventListener('click', () => switchConcept(1));
  if (tabBtn3) tabBtn3.addEventListener('click', () => switchConcept(3));

  // --- Concept A (Constellation) Canvas Engine ---
  const canvas1 = document.getElementById('c1-constellation-canvas');
  let ctx1 = null;
  let animId1 = null;
  let nodes1 = [];
  let particles1 = [];
  let t1 = 0;
  let hoverNodeId = null;

  function initConstellation() {
    if (!canvas1) return;
    ctx1 = canvas1.getContext('2d');
    resizeConstellation();
    
    const labels = {
      'frontend': '.frontend (cdn)',
      'secrets-config': '.secrets (kms)',
      'backend': '.backend (api)',
      'postgres': '.database (pg)',
      'sync': '.sync (engine)',
      'storage': '.storage (s3)',
      'cache': '.cache (redis)',
      'envs': '.preview-envs'
    };
    
    nodes1 = [];
    const center = { x: canvas1.width / (window.devicePixelRatio || 1) / 2, y: canvas1.height / (window.devicePixelRatio || 1) / 2 };
    
    allConceptKeys.forEach((key, idx) => {
      const angle = (idx / allConceptKeys.length) * Math.PI * 2;
      nodes1.push({
        key: key,
        label: labels[key],
        angle: angle,
        x: center.x + Math.cos(angle) * 155,
        y: center.y + Math.sin(angle) * 155,
        vx: 0,
        vy: 0,
        targetDist: 155,
        currentDist: 155
      });
    });
    
    // Core Agent Node (index 8)
    nodes1.push({
      key: 'agent-core',
      label: '● specific-core',
      x: center.x,
      y: center.y,
      vx: 0,
      vy: 0,
      targetDist: 0,
      currentDist: 0
    });
    
    startConstellationLoop();
  }

  function cancelConstellationLoop() {
    if (animId1) {
      cancelAnimationFrame(animId1);
      animId1 = null;
    }
    particles1 = [];
  }

  function resizeConstellation() {
    if (!canvas1) return;
    const rect = canvas1.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas1.width = rect.width * dpr;
    canvas1.height = rect.height * dpr;
    if (ctx1) ctx1.scale(dpr, dpr);
  }

  function startConstellationLoop() {
    cancelConstellationLoop();
    
    function draw() {
      if (activeConcept !== 1 || !ctx1 || !canvas1) return;
      
      const width = canvas1.width / (window.devicePixelRatio || 1);
      const height = canvas1.height / (window.devicePixelRatio || 1);
      const centerX = width / 2;
      const centerY = height / 2;
      
      ctx1.clearRect(0, 0, width, height);
      t1 += 1;
      
      // Update core position
      if (nodes1[8]) {
        nodes1[8].x = centerX;
        nodes1[8].y = centerY;
      }
      
      // Update outer nodes physics
      for (let i = 0; i < 8; i++) {
        const n = nodes1[i];
        if (!n) continue;
        const isHovered = (n.key === hoverNodeId);
        
        n.targetDist = isHovered ? 180 : 150;
        n.currentDist += (n.targetDist - n.currentDist) * 0.1;
        
        const floatAngle = n.angle + Math.sin(t1 * 0.005 + n.angle) * 0.05;
        const tx = centerX + Math.cos(floatAngle) * n.currentDist;
        const ty = centerY + Math.sin(floatAngle) * n.currentDist;
        
        n.vx += (tx - n.x) * 0.07;
        n.vy += (ty - n.y) * 0.07;
        n.vx *= 0.84;
        n.vy *= 0.84;
        n.x += n.vx;
        n.y += n.vy;
      }
      
      // Draw outer string network
      ctx1.beginPath();
      ctx1.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx1.lineWidth = 1.2;
      for (let i = 0; i < 8; i++) {
        const next = nodes1[(i + 1) % 8];
        if (nodes1[i] && next) {
          ctx1.moveTo(nodes1[i].x, nodes1[i].y);
          ctx1.lineTo(next.x, next.y);
        }
      }
      ctx1.stroke();
      
      // Draw star lines (gorgeous structural network)
      ctx1.beginPath();
      ctx1.strokeStyle = 'rgba(35, 102, 236, 0.03)';
      ctx1.lineWidth = 0.6;
      for (let i = 0; i < 8; i++) {
        const targetNode = nodes1[(i + 3) % 8];
        if (nodes1[i] && targetNode) {
          ctx1.moveTo(nodes1[i].x, nodes1[i].y);
          ctx1.lineTo(targetNode.x, targetNode.y);
        }
      }
      ctx1.stroke();
      
      // Draw radial connections to center core
      for (let i = 0; i < 8; i++) {
        const n = nodes1[i];
        if (!n) continue;
        const isHovered = (n.key === hoverNodeId);
        
        ctx1.beginPath();
        ctx1.strokeStyle = isHovered ? 'rgba(35, 102, 236, 0.45)' : 'rgba(255, 255, 255, 0.05)';
        ctx1.lineWidth = isHovered ? 2.5 : 1.2;
        ctx1.moveTo(centerX, centerY);
        ctx1.lineTo(n.x, n.y);
        ctx1.stroke();
      }
      
      // Draw glowing particle pulses
      if (Math.random() < 0.07) {
        particles1.push({
          nodeIdx: Math.floor(Math.random() * 8),
          progress: 0,
          speed: 0.01 + Math.random() * 0.01
        });
      }
      
      particles1.forEach((p, idx) => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          particles1.splice(idx, 1);
          return;
        }
        const n = nodes1[p.nodeIdx];
        if (!n) return;
        const px = centerX + (n.x - centerX) * p.progress;
        const py = centerY + (n.y - centerY) * p.progress;
        
        ctx1.fillStyle = '#60A5FA';
        ctx1.beginPath();
        ctx1.arc(px, py, 3, 0, Math.PI * 2);
        ctx1.fill();
      });
      
      // Draw central agent core
      const corePulse = 16 + Math.sin(t1 * 0.04) * 4;
      const coreGrad = ctx1.createRadialGradient(centerX, centerY, 4, centerX, centerY, corePulse);
      coreGrad.addColorStop(0, '#FFFFFF');
      coreGrad.addColorStop(0.3, 'rgba(35, 102, 236, 0.9)');
      coreGrad.addColorStop(1, 'rgba(35, 102, 236, 0)');
      
      ctx1.fillStyle = coreGrad;
      ctx1.beginPath();
      ctx1.arc(centerX, centerY, corePulse, 0, Math.PI * 2);
      ctx1.fill();
      
      ctx1.fillStyle = '#FFFFFF';
      ctx1.font = 'bold 10px "IBM Plex Mono", monospace';
      ctx1.textAlign = 'center';
      ctx1.fillText('SPECIFIC CORE', centerX, centerY - 20);
      
      // Draw outer nodes (enlarged per request!)
      for (let i = 0; i < 8; i++) {
        const n = nodes1[i];
        if (!n) continue;
        const isHovered = (n.key === hoverNodeId);
        
        if (isHovered) {
          ctx1.strokeStyle = 'rgba(35, 102, 236, 0.3)';
          ctx1.lineWidth = 8;
          ctx1.beginPath();
          ctx1.arc(n.x, n.y, 11, 0, Math.PI * 2);
          ctx1.stroke();
        }
        
        ctx1.fillStyle = isHovered ? '#3B82F6' : '#FFFFFF';
        ctx1.beginPath();
        ctx1.arc(n.x, n.y, isHovered ? 7 : 5, 0, Math.PI * 2); // Bigger components! (7px normal, 10px / 7px scaled)
        ctx1.fill();
        
        ctx1.fillStyle = isHovered ? '#FFFFFF' : '#A2A2A2';
        ctx1.font = isHovered ? 'bold 11px "IBM Plex Mono", monospace' : '10px "IBM Plex Mono", monospace';
        ctx1.textAlign = 'center';
        ctx1.fillText(n.label, n.x, n.y + 19);
      }
      
      animId1 = requestAnimationFrame(draw);
    }
    
    draw();
  }

  // Handle canvas mouse move collisions (Sticky Hover range to prevent glitches)
  if (canvas1) {
    canvas1.addEventListener('mousemove', (e) => {
      if (activeConcept !== 1 || !canvas1 || nodes1.length === 0) return;
      const rect = canvas1.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Hysteresis sticky hover locking check (entering 48px, exiting 72px)
      if (hoverNodeId) {
        const activeNode = nodes1.find(n => n.key === hoverNodeId);
        if (activeNode) {
          const dx = activeNode.x - mouseX;
          const dy = activeNode.y - mouseY;
          if (dx * dx + dy * dy < 72 * 72) {
            // Keep hovered, prevent jumping
            return;
          }
        }
      }
      
      let hovered = null;
      for (let i = 0; i < 8; i++) {
        const n = nodes1[i];
        if (!n) continue;
        const dx = n.x - mouseX;
        const dy = n.y - mouseY;
        if (dx * dx + dy * dy < 48 * 48) {
          hovered = n;
          break;
        }
      }
      
      const newHoverId = hovered ? hovered.key : null;
      if (newHoverId !== hoverNodeId) {
        if (hoverNodeId) {
          highlightTextDescription(hoverNodeId, false);
        }
        hoverNodeId = newHoverId;
        if (hoverNodeId) {
          highlightTextDescription(hoverNodeId, true);
          const feed = document.getElementById('c1-telemetry-feed');
          if (feed && logsMapping1[hoverNodeId]) {
            feed.textContent = logsMapping1[hoverNodeId];
            feed.style.color = '#93C5FD'; // blue-300
          }
        } else {
          const feed = document.getElementById('c1-telemetry-feed');
          if (feed) {
            feed.textContent = '> specific string compiler loaded. Hover description nodes to warp string connections.';
            feed.style.color = '';
          }
        }
      }
    });

    canvas1.addEventListener('mouseleave', () => {
      if (hoverNodeId) {
        highlightTextDescription(hoverNodeId, false);
        hoverNodeId = null;
        const feed = document.getElementById('c1-telemetry-feed');
        if (feed) {
          feed.textContent = '> specific string compiler loaded. Hover description nodes to warp string connections.';
          feed.style.color = '';
        }
      }
    });
  }



  // --- Concept C (Zero-UI Shell) Agent CLI ---
  let shellTypeTimer = null;
  let shellLineTimer = null;
  const shellBtnList = document.querySelectorAll('.c3-shell-btn');
  const shellClearBtn = document.getElementById('c3-shell-clear');
  
  if (shellClearBtn) shellClearBtn.addEventListener('click', clearShell);
  
  shellBtnList.forEach(btn => {
    btn.addEventListener('click', () => {
      const job = btn.getAttribute('data-job');
      triggerShellCommand(job);
    });
  });

  function cancelShellTimers() {
    if (shellTypeTimer) clearTimeout(shellTypeTimer);
    if (shellLineTimer) clearTimeout(shellLineTimer);
  }

  function triggerShellCommand(jobName) {
    cancelShellTimers();
    
    const promptInput = document.getElementById('c3-shell-prompt');
    const shellOutput = document.getElementById('c3-shell-output');
    const shellEmpty = document.getElementById('c3-shell-empty');
    const statusTag = document.getElementById('c3-shell-status');
    
    if (!promptInput || !shellOutput) return;
    
    if (shellEmpty) shellEmpty.classList.add('hidden');
    shellOutput.innerHTML = '';
    
    const commandTemplates = {
      blog: {
        cmd: 'specific deploy --stack blog --env production',
        lines: [
          'Parsing specific.yaml configurations... [OK]',
          'Found 2 service descriptors: [frontend, database]',
          '└─ Provisioning .frontend (cdn) -> auto-domain... OK',
          '└─ Spinning up managed Postgres 16 (10GB disk)... OK',
          'Connecting frontend client keys to postgres secure link...',
          'Compiling nextjs bundle... (3.4s) static bundle generated.',
          'Injecting secrets and variables... successfully mapped.',
          'Cluster active: https://personal-blog-9fb1.spcf.app',
          'STATUS: Cluster scaled, active and healthy.'
        ],
        status: 'DEPLOYED',
        keys: ['frontend', 'postgres', 'secrets-config']
      },
      saas: {
        cmd: 'specific scale api-service --replicas 12',
        lines: [
          'Fetching cluster metadata... API server verified.',
          'Autoscaling rule matching backend api-service...',
          'Increasing container replicas: 2 -> 12.',
          'Scale status: [██░░░░░░░░░░] 16%',
          'Scale status: [██████░░░░░░] 50%',
          'Scale status: [██████████░░] 83%',
          'Scale status: [████████████] 100%',
          'Replication complete: 12 containers serving traffic.',
          'Load balancer synced. Network latency: 0.2ms.'
        ],
        status: 'SCALED',
        keys: ['backend', 'cache', 'storage']
      },
      dev: {
        cmd: 'specific env dev boot --local-reload',
        lines: [
          'Booting dev engine... mounting workspace files.',
          'Mounting postgres local volume check...',
          'Active services: http://localhost:3000 (frontend)',
          'Active services: http://localhost:5432 (database)',
          'Local sync bridge starting... watching file changes.',
          'Listening on websocket connections at port 8080.',
          'Dev cluster fully initialized.'
        ],
        status: 'DEV MODE',
        keys: ['frontend', 'postgres', 'sync', 'envs']
      }
    };
    
    const job = commandTemplates[jobName];
    if (!job) return;
    
    if (statusTag) {
      statusTag.textContent = 'RUNNING...';
      statusTag.style.color = '#F59E0B'; // Amber
    }
    
    let charIdx = 0;
    promptInput.textContent = '';
    
    allConceptKeys.forEach(k => highlightTextDescription(k, false));
    job.keys.forEach(k => highlightTextDescription(k, true));
    
    function typeChar() {
      if (charIdx < job.cmd.length) {
        promptInput.textContent += job.cmd[charIdx];
        charIdx++;
        shellTypeTimer = setTimeout(typeChar, 35);
      } else {
        setTimeout(() => {
          promptInput.textContent = '';
          const cmdLine = document.createElement('div');
          cmdLine.className = 'text-white font-bold mb-1.5';
          cmdLine.innerHTML = `<span class="text-purple-400">$</span> ${job.cmd}`;
          shellOutput.appendChild(cmdLine);
          
          let lineIdx = 0;
          function printLine() {
            if (lineIdx < job.lines.length) {
              const logLine = document.createElement('div');
              logLine.className = 'leading-relaxed text-[#D2C5FD] pl-2.5';
              logLine.textContent = `> ${job.lines[lineIdx]}`;
              shellOutput.appendChild(logLine);
              shellOutput.scrollTop = shellOutput.scrollHeight;
              lineIdx++;
              shellLineTimer = setTimeout(printLine, 180);
            } else {
              if (statusTag) {
                statusTag.textContent = job.status;
                statusTag.style.color = '#10B981'; // Green
              }
              setTimeout(() => {
                job.keys.forEach(k => highlightTextDescription(k, false));
              }, 2000);
            }
          }
          printLine();
        }, 250);
      }
    }
    typeChar();
  }
  
  function clearShell() {
    cancelShellTimers();
    
    const promptInput = document.getElementById('c3-shell-prompt');
    const shellOutput = document.getElementById('c3-shell-output');
    const shellEmpty = document.getElementById('c3-shell-empty');
    const statusTag = document.getElementById('c3-shell-status');
    
    if (promptInput) promptInput.textContent = '';
    if (shellOutput) shellOutput.innerHTML = '';
    if (shellEmpty) shellEmpty.classList.remove('hidden');
    if (statusTag) {
      statusTag.textContent = 'READY';
      statusTag.style.color = '#C084FC';
    }
    allConceptKeys.forEach(k => highlightTextDescription(k, false));
  }



  // --- Map hover inputs from sidebars to active views ---
  function highlightCentralBlock(blockKey, isHighlight) {
    if (activeConcept === 1) {
      if (isHighlight) {
        hoverNodeId = blockKey;
        const feed = document.getElementById('c1-telemetry-feed');
        if (feed && logsMapping1[blockKey]) {
          feed.textContent = logsMapping1[blockKey];
          feed.style.color = '#93C5FD'; // blue-300
        }
      } else {
        if (hoverNodeId === blockKey) {
          hoverNodeId = null;
          const feed = document.getElementById('c1-telemetry-feed');
          if (feed) {
            feed.textContent = '> specific string compiler loaded. Hover description nodes to warp string connections.';
            feed.style.color = '';
          }
        }
      }
    } else if (activeConcept === 3) {
      if (isHighlight) {
        const out = document.getElementById('c3-shell-output');
        const empty = document.getElementById('c3-shell-empty');
        if (out) {
          if (empty) empty.classList.add('hidden');
          const debugLine = document.createElement('div');
          debugLine.className = 'text-purple-300 font-mono text-[11px] pl-1 opacity-75';
          debugLine.id = `debug-log-${blockKey}`;
          debugLine.textContent = `[agent-info] queried resource stats: ${blockKey} status OK.`;
          out.appendChild(debugLine);
          out.scrollTop = out.scrollHeight;
        }
      } else {
        const debugLine = document.getElementById(`debug-log-${blockKey}`);
        if (debugLine) debugLine.remove();
      }
    }
  }

  function highlightTextDescription(blockKey, isHighlight) {
    textBlocks.forEach(block => {
      let key = '';
      if (block.hasAttribute('data-index-left')) {
        key = hoverMapping[`left-${block.getAttribute('data-index-left')}`];
      } else if (block.hasAttribute('data-index-right')) {
        key = hoverMapping[`right-${block.getAttribute('data-index-right')}`];
      } else if (block.hasAttribute('data-index-bottom')) {
        key = 'envs';
      }
      
      if (key === blockKey) {
        const tilde = block.querySelector('div');
        if (tilde) {
          if (isHighlight) {
            block.classList.add('text-white');
            block.classList.remove('text-[#A2A2A2]');
            tilde.classList.remove('opacity-0');
            tilde.classList.add('opacity-100');
          } else {
            block.classList.remove('text-white');
            block.classList.add('text-[#A2A2A2]');
            tilde.classList.add('opacity-0');
            tilde.classList.remove('opacity-100');
          }
        }
      }
    });
  }

  // Initialize first view
  switchConcept(1);
  
  window.addEventListener('resize', () => {
    if (activeConcept === 1) {
      resizeConstellation();
    }
  });
});
