// Ждем пока вся страница загрузится
document.addEventListener('DOMContentLoaded', function() {
    // ===== ГАЛЕРЕЯ ФОТО =====
    const slidesContainer = document.getElementById('slides-container');
    const thumbnailsContainer = document.getElementById('thumbnails-container');
    const currentPhotoSpan = document.getElementById('current-photo');
    const totalPhotosSpan = document.getElementById('total-photos');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const thumbPrevBtn = document.querySelector('.thumb-prev');
    const thumbNextBtn = document.querySelector('.thumb-next');
    
    const photos = [];
    const totalPhotos = 34;
    for (let i = 1; i <= totalPhotos; i++) {
        photos.push(`gallery${i}.jpg`);
    }
    
    let currentIndex = 0;
    let thumbStartIndex = 0;
    const thumbsToShow = 8;
    
    totalPhotosSpan.textContent = photos.length;
    
    function createSlides() {
        slidesContainer.innerHTML = '';
        
        photos.forEach((photo, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.setAttribute('data-index', index);
            
            if (index === currentIndex) slide.classList.add('active');
            
            const img = document.createElement('img');
            img.src = photo;
            img.alt = `Фото ${index + 1}`;
            img.className = 'slide-image';
            
            slide.appendChild(img);
            slidesContainer.appendChild(slide);
        });
    }
    
    function createThumbnails() {
        thumbnailsContainer.innerHTML = '';
        
        const endIndex = Math.min(thumbStartIndex + thumbsToShow, photos.length);
        
        for (let i = thumbStartIndex; i < endIndex; i++) {
            const thumb = document.createElement('img');
            thumb.src = photos[i];
            thumb.alt = `Фото ${i + 1}`;
            thumb.className = 'thumbnail';
            thumb.setAttribute('data-index', i);
            
            if (i === currentIndex) thumb.classList.add('active');
            
            thumb.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                goToSlide(index);
            });
            
            thumbnailsContainer.appendChild(thumb);
        }
    }
    
    function goToSlide(index) {
        const currentSlide = document.querySelector('.slide.active');
        const currentThumb = document.querySelector('.thumbnail.active');
        
        if (currentSlide) currentSlide.classList.remove('active');
        if (currentThumb) currentThumb.classList.remove('active');
        
        currentIndex = index;
        currentPhotoSpan.textContent = index + 1;
        
        const newSlide = document.querySelector(`.slide[data-index="${index}"]`);
        if (newSlide) newSlide.classList.add('active');
        
        createThumbnails();
        
        if (index < thumbStartIndex) {
            thumbStartIndex = Math.max(0, index - 2);
        } else if (index >= thumbStartIndex + thumbsToShow) {
            thumbStartIndex = Math.min(photos.length - thumbsToShow, index - thumbsToShow + 3);
        }
        
        createThumbnails();
    }
    
    function nextSlide() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= photos.length) nextIndex = 0;
        goToSlide(nextIndex);
    }
    
    function prevSlide() {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) prevIndex = photos.length - 1;
        goToSlide(prevIndex);
    }
    
    function nextThumbs() {
        if (thumbStartIndex + thumbsToShow < photos.length) {
            thumbStartIndex++;
            createThumbnails();
        }
    }
    
    function prevThumbs() {
        if (thumbStartIndex > 0) {
            thumbStartIndex--;
            createThumbnails();
        }
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    thumbNextBtn.addEventListener('click', nextThumbs);
    thumbPrevBtn.addEventListener('click', prevThumbs);
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') nextSlide();
        else if (event.key === 'ArrowLeft') prevSlide();
    });
    
    createSlides();
    createThumbnails();
    goToSlide(0);
    
    // ===== МЕНЮ С ПЕРЕЛИСТЫВАНИЕМ =====
    const menuPages = document.querySelectorAll('.menu-page');
    const prevPageBtn = document.querySelector('.prev-page');
    const nextPageBtn = document.querySelector('.next-page');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');
    
    let currentPageIndex = 0;
    const totalPages = menuPages.length;
    
    totalPagesSpan.textContent = totalPages;
    
    function updateMenuDisplay() {
        menuPages.forEach(page => page.classList.remove('active'));
        menuPages[currentPageIndex].classList.add('active');
        currentPageSpan.textContent = currentPageIndex + 1;
        
        prevPageBtn.disabled = currentPageIndex === 0;
        nextPageBtn.disabled = currentPageIndex === totalPages - 1;
    }
    
    function nextPage() {
        if (currentPageIndex < totalPages - 1) {
            currentPageIndex++;
            updateMenuDisplay();
        }
    }
    
    function prevPage() {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            updateMenuDisplay();
        }
    }
    
    if (nextPageBtn) nextPageBtn.addEventListener('click', nextPage);
    if (prevPageBtn) prevPageBtn.addEventListener('click', prevPage);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') nextPage();
        else if (e.key === 'ArrowLeft') prevPage();
    });
    
    updateMenuDisplay();
    
    // ===== СИСТЕМА УВЕЛИЧЕНИЯ ФОТО =====
    const zoomModal = document.createElement('div');
    zoomModal.className = 'zoom-modal';
    zoomModal.innerHTML = `
        <div class="zoom-modal-content">
            <button class="zoom-modal-close">&times;</button>
            <div class="zoom-loading">Загрузка...</div>
            <div class="image-container">
                <img class="zoom-modal-img" src="" alt="">
            </div>
            <div class="zoom-modal-controls">
                <button class="zoom-control-btn" id="zoom-prev">‹</button>
                <div class="zoom-counter">
                    <span id="zoom-current">1</span>/<span id="zoom-total">1</span>
                </div>
                <button class="zoom-control-btn" id="zoom-next">›</button>
                <button class="zoom-control-btn" id="zoom-in">+</button>
                <button class="zoom-control-btn" id="zoom-out">-</button>
                <button class="zoom-control-btn" id="zoom-reset">↻</button>
                <button class="zoom-control-btn" id="zoom-rotate-left">↺</button>
                <button class="zoom-control-btn" id="zoom-rotate-right">↻</button>
            </div>
        </div>
    `;
    document.body.appendChild(zoomModal);
    
    const modalImg = zoomModal.querySelector('.zoom-modal-img');
    const modalClose = zoomModal.querySelector('.zoom-modal-close');
    const zoomLoading = zoomModal.querySelector('.zoom-loading');
    
    let currentZoom = 1;
    let currentRotation = 0;
    let currentZoomIndex = 0;
    let imagesArray = [];
    let currentType = '';
    
    const galleryZoomBtn = document.getElementById('gallery-zoom');
    const menuZoomBtn = document.getElementById('menu-zoom');
    
    if (galleryZoomBtn) {
        galleryZoomBtn.addEventListener('click', function() {
            openZoom('gallery');
        });
    }
    
    if (menuZoomBtn) {
        menuZoomBtn.addEventListener('click', function() {
            openZoom('menu');
        });
    }
    
    const slidesContainerElem = document.querySelector('.slides-container');
    if (slidesContainerElem) {
        slidesContainerElem.addEventListener('click', function(e) {
            if (e.target.classList.contains('slide-image')) {
                openZoom('gallery');
            }
        });
    }
    
    function openZoom(type) {
        currentType = type;
        
        if (type === 'gallery') {
            const galleryPhotos = [];
            for (let i = 1; i <= 34; i++) galleryPhotos.push(`gallery${i}.jpg`);
            imagesArray = galleryPhotos;
            currentZoomIndex = getCurrentGalleryIndex();
        } else if (type === 'menu') {
            const menuPagesImgs = document.querySelectorAll('.menu-page img');
            imagesArray = Array.from(menuPagesImgs).map(img => img.src);
            currentZoomIndex = getCurrentMenuIndex();
        }
        
        document.getElementById('zoom-total').textContent = imagesArray.length;
        showZoomImage(currentZoomIndex);
        zoomModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function getCurrentGalleryIndex() {
        const activeSlide = document.querySelector('.slide.active');
        return parseInt(activeSlide?.getAttribute('data-index') || 0);
    }
    
    function getCurrentMenuIndex() {
        const activePage = document.querySelector('.menu-page.active');
        const allPages = document.querySelectorAll('.menu-page');
        return Array.from(allPages).indexOf(activePage);
    }
    
    function showZoomImage(index) {
        zoomLoading.style.display = 'block';
        modalImg.style.display = 'none';
        
        const img = new Image();
        img.src = imagesArray[index];
        img.onload = function() {
            modalImg.src = this.src;
            modalImg.alt = `${currentType === 'gallery' ? 'Фото' : 'Меню'} ${index + 1}`;
            modalImg.style.display = 'block';
            zoomLoading.style.display = 'none';
            resetZoom();
            resetRotation();
            
            currentZoomIndex = index;
            document.getElementById('zoom-current').textContent = index + 1;
            
            if (currentType === 'gallery') goToSlide(index);
            else if (currentType === 'menu') goToMenuPage(index);
        };
        
        img.onerror = function() {
            console.error('Не удалось загрузить изображение:', imagesArray[index]);
            zoomLoading.textContent = 'Ошибка загрузки';
        };
    }
    
    function nextZoomImage() {
        currentZoomIndex = (currentZoomIndex + 1) % imagesArray.length;
        showZoomImage(currentZoomIndex);
    }
    
    function prevZoomImage() {
        currentZoomIndex = (currentZoomIndex - 1 + imagesArray.length) % imagesArray.length;
        showZoomImage(currentZoomIndex);
    }
    
    function zoomIn() {
        if (currentZoom < 3) {
            currentZoom += 0.2;
            updateTransform();
        }
    }
    
    function zoomOut() {
        if (currentZoom > 0.5) {
            currentZoom -= 0.2;
            updateTransform();
        }
    }
    
    function resetZoom() {
        currentZoom = 1;
        updateTransform();
    }
    
    function rotateLeft() {
        currentRotation -= 90;
        updateTransform();
    }
    
    function rotateRight() {
        currentRotation += 90;
        updateTransform();
    }
    
    function resetRotation() {
        currentRotation = 0;
        updateTransform();
    }
    
    function updateTransform() {
        modalImg.style.transform = `scale(${currentZoom}) rotate(${currentRotation}deg)`;
        modalImg.style.transition = 'transform 0.3s ease';
    }
    
    function closeModal() {
        zoomModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetZoom();
        resetRotation();
    }
    
    modalClose.addEventListener('click', closeModal);
    zoomModal.addEventListener('click', function(e) {
        if (e.target === zoomModal) closeModal();
    });
    
    const zoomPrevBtn = document.getElementById('zoom-prev');
    const zoomNextBtn = document.getElementById('zoom-next');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');
    const zoomRotateLeftBtn = document.getElementById('zoom-rotate-left');
    const zoomRotateRightBtn = document.getElementById('zoom-rotate-right');
    
    if (zoomPrevBtn) zoomPrevBtn.addEventListener('click', prevZoomImage);
    if (zoomNextBtn) zoomNextBtn.addEventListener('click', nextZoomImage);
    if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
    if (zoomResetBtn) zoomResetBtn.addEventListener('click', function() {
        resetZoom();
        resetRotation();
    });
    if (zoomRotateLeftBtn) zoomRotateLeftBtn.addEventListener('click', rotateLeft);
    if (zoomRotateRightBtn) zoomRotateRightBtn.addEventListener('click', rotateRight);
    
    document.addEventListener('keydown', function(e) {
        if (zoomModal.style.display === 'flex') {
            switch(e.key) {
                case 'Escape': closeModal(); break;
                case 'ArrowRight': nextZoomImage(); break;
                case 'ArrowLeft': prevZoomImage(); break;
                case '+': case '=': zoomIn(); break;
                case '-': zoomOut(); break;
                case '[': case 'q': rotateLeft(); break;
                case ']': case 'e': rotateRight(); break;
                case '0': resetZoom(); resetRotation(); break;
                case 'r': resetRotation(); break;
            }
        }
    });
    
    zoomModal.addEventListener('wheel', function(e) {
        if (e.ctrlKey) {
            e.preventDefault();
            e.deltaY < 0 ? zoomIn() : zoomOut();
        } else if (e.shiftKey) {
            e.preventDefault();
            e.deltaY < 0 ? rotateRight() : rotateLeft();
        }
    });
    
    function goToMenuPage(index) {
        const menuPagesAll = document.querySelectorAll('.menu-page');
        menuPagesAll.forEach(page => page.classList.remove('active'));
        
        if (menuPagesAll[index]) {
            menuPagesAll[index].classList.add('active');
            document.getElementById('current-page').textContent = index + 1;
        }
    }
    
    // ===== АКТИВНОЕ МЕНЮ ПРИ ПРОКРУТКЕ =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a');
    
    function updateActiveLink() {
        let current = '';
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        if (window.scrollY < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#') link.classList.add('active');
            });
        }
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
    
    // ===== ГАМБУРГЕР МЕНЮ ДЛЯ МОБИЛЬНЫХ =====
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('active');
            hamburger.textContent = nav.classList.contains('active') ? '✕' : '☰';
        });
        
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                hamburger.textContent = '☰';
            });
        });
    }
    
    document.addEventListener('click', function(e) {
        if (hamburger && nav) {
            if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
                nav.classList.remove('active');
                hamburger.textContent = '☰';
            }
        }
    });
});