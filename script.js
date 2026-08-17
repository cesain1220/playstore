document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const appCards = document.querySelectorAll('.app-card');
  const emptyMsg = document.getElementById('emptyMsg');
  const categoryTitle = document.getElementById('categoryTitle');
  const modal = document.getElementById('appModal');
  const closeModal = document.getElementById('closeModal');

  // Elementos para el acercamiento (Lightbox)
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeLightbox = document.getElementById('closeLightbox');

  let currentCategory = 'apps';

  function filterApps() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    // Mostrar/Ocultar botones según la pestaña activa
    const apkButtons = document.querySelectorAll('.btn-apk');
    const repoButtons = document.querySelectorAll('.btn-repo');

    if (currentCategory === 'studio') {
      apkButtons.forEach(btn => btn.style.display = 'none');
      repoButtons.forEach(btn => btn.style.display = 'inline-flex');
    } else {
      apkButtons.forEach(btn => btn.style.display = 'inline-flex');
      repoButtons.forEach(btn => btn.style.display = 'none');
    }

    appCards.forEach(card => {
      const categories = card.getAttribute('data-category').split(' ');
      const title = card.getAttribute('data-title').toLowerCase();
      
      const matchesCategory = categories.includes(currentCategory);
      const matchesSearch = title.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentCategory = btn.getAttribute('data-category');
      categoryTitle.textContent = btn.textContent;
      filterApps();
    });
  });

  searchInput.addEventListener('input', filterApps);

  appCards.forEach(card => {
    card.addEventListener('click', () => {
      document.getElementById('modalTitle').textContent = card.getAttribute('data-title');
      document.getElementById('modalDev').textContent = card.getAttribute('data-dev');
      document.getElementById('modalRating').innerHTML = `${card.getAttribute('data-rating')} <i class="fa-solid fa-star" style="color:#fbbc04;"></i>`;
      document.getElementById('modalReviews').textContent = `${card.getAttribute('data-reviews')} reseñas`;
      document.getElementById('modalSize').textContent = card.getAttribute('data-size');
      document.getElementById('modalDesc').textContent = card.getAttribute('data-desc');

      // Configurar Botón Descarga APK
      const apkPath = card.getAttribute('data-apk');
      const modalDownloadBtn = document.getElementById('modalDownloadBtn');
      modalDownloadBtn.href = apkPath;
      modalDownloadBtn.setAttribute('download', apkPath);

      // Configurar Botón GitHub Repo
      const repoUrl = card.getAttribute('data-repo');
      const modalGithubBtn = document.getElementById('modalGithubBtn');
      modalGithubBtn.href = repoUrl;

      // Cargar Logo
      const logoUrl = card.getAttribute('data-logo');
      const iconBox = document.getElementById('modalIcon');
      iconBox.innerHTML = `<img src="${logoUrl}" class="modal-icon-img" alt="Logo">`;

      // Cargar Capturas de pantalla
      const screenshotsContainer = document.getElementById('modalScreenshots');
      screenshotsContainer.innerHTML = '';
      
      const screenshots = [
        card.getAttribute('data-img1'),
        card.getAttribute('data-img2'),
        card.getAttribute('data-img3'),
        card.getAttribute('data-img4')
      ];

      screenshots.forEach(imgUrl => {
        if (imgUrl) {
          const imgEl = document.createElement('img');
          imgEl.src = imgUrl;
          imgEl.className = 'screenshot-item';
          
          // Abrir captura en pantalla grande al hacer clic
          imgEl.addEventListener('click', (e) => {
            e.stopPropagation();
            lightboxImg.src = imgUrl;
            lightbox.style.display = 'flex';
          });

          screenshotsContainer.appendChild(imgEl);
        }
      });

      modal.style.display = 'flex';
    });
  });

  // Cerrar vista ampliada (Lightbox)
  closeLightbox.addEventListener('click', () => lightbox.style.display = 'none');
  lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
      lightbox.style.display = 'none';
    }
  });

  // Cerrar Modal Principal
  closeModal.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  filterApps();
});
