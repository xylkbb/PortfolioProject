
    const sliderData = [
      { triggerId: 'trigger-img1', slideId: 'slide-img1', visibleClass: 'visible1' },
      { triggerId: 'trigger-img2', slideId: 'slide-img2', visibleClass: 'visible2' },
      { triggerId: 'trigger-img3', slideId: 'slide-img3', visibleClass: 'visible3' },
      { triggerId: 'trigger-img4', slideId: 'slide-img4', visibleClass: 'visible4' },
      { triggerId: 'trigger-img5', slideId: 'slide-img5', visibleClass: 'visible5' },
      { triggerId: 'trigger-img6', slideId: 'slide-img6', visibleClass: 'visible6' },
    ];


    const targetImg = document.getElementById('target-img');
    const container = document.querySelector('.container');


    let isDragging = false;
    let dragImg = null, offsetX = 0, offsetY = 0;

    sliderData.forEach(({ triggerId, slideId, visibleClass }) => {
      const trigger = document.getElementById(triggerId);
      const slider = document.getElementById(slideId);

      trigger.addEventListener('click', () => {
        slider.classList.add(visibleClass);
      });
  
      slider.addEventListener('mousedown', (e) => {
        if (!slider.classList.contains(visibleClass)) return;
        isDragging = true;
        dragImg = slider;
        offsetX = e.clientX - slider.offsetLeft;
        offsetY = e.clientY - slider.offsetTop;
        slider.classList.add('dragging');
        document.body.style.userSelect = 'none';
      });
    });
  
    document.addEventListener('mousemove', (e) => {
      if (!isDragging || !dragImg) return;

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

    document.addEventListener('mouseup', () => {
      if (!isDragging || !dragImg) return;

      isDragging = false;

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
