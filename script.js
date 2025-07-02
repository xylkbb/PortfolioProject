
const targetImg = document.getElementById('target-img');
const container = document.querySelector('.container');

// ^^ defines the target image and the container for the draggable images

    const sliderData = [
      { triggerId: 'trigger-img1', slideId: 'slide-img1', visibleClass: 'visible1' },
      { triggerId: 'trigger-img2', slideId: 'slide-img2', visibleClass: 'visible2' },
      { triggerId: 'trigger-img3', slideId: 'slide-img3', visibleClass: 'visible3' },
      { triggerId: 'trigger-img4', slideId: 'slide-img4', visibleClass: 'visible4' },
      { triggerId: 'trigger-img5', slideId: 'slide-img5', visibleClass: 'visible5' },
      { triggerId: 'trigger-img6', slideId: 'slide-img6', visibleClass: 'visible6' },
    ];

    // ^^ this basically holds all the data, makes it easier to manage each slider and its 'trigger' 

    let isDragging = false;
// ^^ checks if the disk is going to be dragged or not, will change whether the user can drag (obviously)

    let dragImg = null, offsetX = 0, offsetY = 0;

    // ^^ watched a video on how to do this-- basically makes the dragging effect smoother and work,
    //  keeps ur mouse on the actual disk

 

    sliderData.forEach(({ triggerId, slideId, visibleClass }) => {
      const trigger = document.getElementById(triggerId);
      const slider = document.getElementById(slideId);

// ^^ this is where we get the trigger and slider elements by their IDs, gets defined in the homepage index

      trigger.addEventListener('click', () => {
        slider.classList.add(visibleClass);
      });

      // ^^ makes the disk apear when the disk case is clicked


      slider.addEventListener('mousedown', (e) => {
        if (!slider.classList.contains(visibleClass)) return;

        // ^ checks if the disk is visible, if its not, it wont be click or draggable
        isDragging = true;
        dragImg = slider;
        offsetX = e.clientX - slider.offsetLeft;
        offsetY = e.clientY - slider.offsetTop;

        // ^^ makes use of what's defined earlier, sets the dragging to true, and sets the offset
        slider.classList.add('dragging');
        document.body.style.userSelect = 'none';

// ^^ adds a class to the disk to make it look like its being dragged, i THINK the second thing makes it so 
// the blue highlight doesn't show up when dragging the disk

      });
    });
  
    document.addEventListener('mousemove', (e) => {
      if (!isDragging || !dragImg) return;

// ^^ if the disk is NOT being dragged, or if the disk is not defined, it will not run the code below
// code below was taken from a video, bug fixed from AI, and small tweaks made by me haha

      const minX = 0, maxX = container.offsetWidth - dragImg.offsetWidth;
      const minY = 0, maxY = container.offsetHeight - dragImg.offsetHeight;


      let newX = e.clientX - container.getBoundingClientRect().left - offsetX;
      let newY = e.clientY - container.getBoundingClientRect().top - offsetY;


      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));


      dragImg.style.left = newX + "px";
      dragImg.style.top = newY + "px";
  
      const dragRect = dragImg.getBoundingClientRect();
      const targetRect = targetImg.getBoundingClientRect();

      if (
        dragRect.right > targetRect.left &&
        dragRect.left < targetRect.right &&
        dragRect.bottom > targetRect.top &&
        dragRect.top < targetRect.bottom
      ) {
        targetImg.classList.add('hovered');
      } else {
        targetImg.classList.remove('hovered');
      }
    });

    // code below is for when the disk is released, which takes you to the other pages
    document.addEventListener('mouseup', () => {
      if (!isDragging || !dragImg) return;

// ^^ again  if the disk is NOT being dragged, or if the disk is not defined, it will not run the code below

      isDragging = false;

      // ^^ no longer drags to your mouse 

      dragImg.classList.remove('dragging');
      document.body.style.userSelect = '';

      const dragRect = dragImg.getBoundingClientRect();
      const targetRect = targetImg.getBoundingClientRect();

      targetImg.classList.remove('hovered');
      if (
        dragRect.right > targetRect.left &&
        dragRect.left < targetRect.right &&
        dragRect.bottom > targetRect.top &&
        dragRect.top < targetRect.bottom
      ) {
        const url = dragImg.getAttribute('data-url');
        
        if (url) window.location.href = url;
      }
      dragImg = null;
    });

    // ----------- MUSIC NOTE SECTION  -----------
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
    setInterval(spawnNote, 3000);
    animateNotes();

    Object.assign(notesLayer.style, {
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none'
    });
