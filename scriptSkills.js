    const notesLayer = document.getElementById('notes-layer');
    const noteTypes = ['\u266A', '\u266B', '\u266C', '\u2669', '\u266F'];
    const flyingNotes = [], mouse = {x: 0, y: 0};
    const screenW = () => window.innerWidth, screenH = () => window.innerHeight;

    function randomEdgePosition() {
      const e = Math.floor(Math.random() * 4);
      if (e === 0) return {x: Math.random() * screenW(), y: -40, vx: (Math.random() - .5) * 2, vy: 1 + Math.random()};
      if (e === 1) return {x: screenW() + 40, y: Math.random() * screenH(), vx: -1 - Math.random(), vy: (Math.random() - .5) * 2};
      if (e === 2) return {x: Math.random() * screenW(), y: screenH() + 40, vx: (Math.random() - .5) * 2, vy: -1 - Math.random()};
      return {x: -40, y: Math.random() * screenH(), vx: 1 + Math.random(), vy: (Math.random() - .5) * 2};
    }

    function spawnNote() {
      const el = document.createElement('span');
      el.className = 'note';
      el.textContent = noteTypes[Math.random() * noteTypes.length | 0];
      el.style.color = `hsl(${Math.random() * 360 | 0},80%,60%)`;
      const pos = randomEdgePosition();
      Object.assign(el.style, {left: pos.x + 'px', top: pos.y + 'px'});
      notesLayer.appendChild(el);
      const note = {el, ...pos, state: 'flying', caughtOffset: {x: 0, y: 0}};
      flyingNotes.push(note);
      el.addEventListener('mousedown', e => {
        e.stopPropagation();
        if (note.state === 'flying') {
          note.state = 'caught';
          el.classList.add('caught');
          note.caughtOffset.x = e.clientX - note.x;
          note.caughtOffset.y = e.clientY - note.y;
        }
      });
    }

    document.addEventListener('mouseup', () => {
      flyingNotes.forEach(n => {
        if (n.state === 'caught') {
          n.state = 'falling';
          n.el.classList.remove('caught');
          n.el.classList.add('falling');
        }
      });
    });

    function animateNotes() {
      for (let i = flyingNotes.length - 1; i >= 0; i--) {
        const n = flyingNotes[i];
        if (n.state === 'flying') n.x += n.vx, n.y += n.vy;
        else if (n.state === 'caught') n.x = mouse.x - n.caughtOffset.x, n.y = mouse.y - n.caughtOffset.y;
        else if (n.state === 'falling') n.vy += .2, n.y += n.vy;
        Object.assign(n.el.style, {left: n.x + 'px', top: n.y + 'px'});
        if (n.y > screenH() + 80 || n.x < -80 || n.x > screenW() + 80 || n.y < -80) {
          notesLayer.removeChild(n.el);
          flyingNotes.splice(i, 1);
        }
      }
      requestAnimationFrame(animateNotes);
    }

    document.addEventListener('mousemove', e => (mouse.x = e.clientX, mouse.y = e.clientY));
    setInterval(spawnNote, 3500);
    animateNotes();

    Object.assign(notesLayer.style, {
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none'
    });