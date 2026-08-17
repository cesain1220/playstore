document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const appCards = document.querySelectorAll('.app-card');
  const emptyMsg = document.getElementById('emptyMsg');
  const categoryTitle = document.getElementById('categoryTitle');
  const modal = document.getElementById('appModal');
  const closeModal = document.getElementById('closeModal');

  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeLightbox = document.getElementById('closeLightbox');
  const modalQrImg = document.getElementById('modalQrImg');

  let currentCategory = 'apps';

  const repoName = 'playstore';
  const baseUrl = `${window.location.origin}/${repoName}/`;

  appCards.forEach(card => {
    const apkRelativePath = card.getAttribute('data-apk');
    const fullApkUrl = `${baseUrl}${apkRelativePath}`;
    const qrApiUrl = `https://quickchart.io/qr?text=${encodeURIComponent(fullApkUrl)}&size=150`;
    
    const qrImg = card.querySelector('.card-qr-img');
    if (qrImg) {
      qrImg.src = qrApiUrl;
    }
  });

  function filterApps() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    if (currentCategory === 'studio') {
      document.body.classList.add('mode-studio');
    } else {
      document.body.classList.remove('mode-studio');
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

      const apkPath = card.getAttribute('data-apk');
      const modalDownloadBtn = document.getElementById('modalDownloadBtn');
      modalDownloadBtn.href = apkPath;
      modalDownloadBtn.setAttribute('download', apkPath);

      const fullApkUrl = `${baseUrl}${apkPath}`;
      modalQrImg.src = `https://quickchart.io/qr?text=${encodeURIComponent(fullApkUrl)}&size=300`;

      const repoUrl = card.getAttribute('data-repo');
      const modalGithubBtn = document.getElementById('modalGithubBtn');
      modalGithubBtn.href = repoUrl;

      const logoUrl = card.getAttribute('data-logo');
      const iconBox = document.getElementById('modalIcon');
      iconBox.innerHTML = `<img src="${logoUrl}" class="modal-icon-img" alt="Logo">`;

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

  modalQrImg.addEventListener('click', (e) => {
    e.stopPropagation();
    lightboxImg.src = modalQrImg.src;
    lightbox.style.display = 'flex';
  });

  closeLightbox.addEventListener('click', () => lightbox.style.display = 'none');
  lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
      lightbox.style.display = 'none';
    }
  });

  closeModal.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  filterApps();
});
