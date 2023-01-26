document.addEventListener('DOMContentLoaded', () => {
  
  const openDropDown = document.querySelectorAll('.js-menu-open');
  const swiperGallery = document.querySelectorAll('.swiperGallery');
  const progressbar = document.querySelector('.progressbar');
  const progressbarPrecent = document.querySelector('.progressbar__percent');
  const progressbarBtn = document.querySelector('.progressbar__btn');
  const more = document.querySelectorAll('.more__show');

  progressbarPrecent.textContent = progressbar.getAttribute('data-progress') + ' %';
  progressbarBtn.textContent = '+ ' + progressbarBtn.getAttribute('data-progress-btn') + ' %';
  progressbarBtn.addEventListener('click', function(){
    let value = +this.getAttribute('data-progress-btn');
    let current = +progressbar.getAttribute('data-progress');
    progressbarPrecent.style.width = value + current + '%';
    progressbarPrecent.textContent = value + current + ' %';
    
  });

  // scroll to element
  document.querySelectorAll('[data-scroll-element]').forEach(elem => {
    elem.addEventListener('click', function(e){
      e.preventDefault();
      const id = this.getAttribute('data-scroll-element');
      const scrollTarget = document.getElementById(id);
      scrollElement(Number(scrollTarget.offsetTop));
    });
  });

  function scrollElement(elem) {
    let currentPos = window.pageYOffset;
    let start = null;
    let time = 600;
    window.requestAnimationFrame(function step(currentTime) {
      start = !start ? currentTime : start;
      var progress = currentTime - start;
      if (currentPos < elem) {
        window.scrollTo(0, ((elem - currentPos) * progress / time) + currentPos);
      } else {
        window.scrollTo(0, currentPos - ((currentPos - elem) * progress / time));
      }
      if (progress < time) {
        window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, elem);
      }
    });
  }

  function toggleFunc(target) {
    target.forEach(item => {
      item.addEventListener('click', function(){
        this.classList.toggle('active');
      });
    });
  }
  toggleFunc(more);

  openDropDown.forEach(item => {
    item.addEventListener('click', function(){
      this.classList.toggle('active');
    });
  });


  // close the menu outside the block
  document.addEventListener('mouseup', function (e) {
    const menu = document.querySelector('.js-menu-open');
    const modal = document.querySelector('.nav-dropdown');
    if (!menu.contains(e.target) && !modal.contains(e.target)) {
      menu.classList.remove('active');
    }
  });

  // Swiper Gallery
  swiperGallery.forEach((slider, index) => {
    const sliderGallery = new Swiper(slider, {
      slidesPerView: 'auto',
      breakpoints: {
        320: {
          slidesPerView: 'auto',
          spaceBetween: 16,
        },
        769: {
          spaceBetween: 20,
        },
        1281: {
          slidesPerView: 'auto',
          spaceBetween: 30
        }
      },
      navigation: {
        nextEl: '.swiperGallery__next',
        prevEl: '.swiperGallery__prev',
      },
      pagination: {
        el: '.swiperGallery__dots',
        clickable: true,
      },
    });
  });
});


// maps
ymaps.ready(init);
function init() {
  var myMap = new ymaps.Map("maps", {
    center: [59.928194, 30.346644],
    zoom: 15,
    controls: []
  });

  var myPlacemark = new ymaps.Placemark([59.928194, 30.346644], {
    balloonContent: `
      <div class="balloon">
        <div class="balloon__header">Наш адрес</div>
        <div class="balloon__address">Санкт-Петербург, Владимирский проспект, 23, лит. А, офис 701</div>
        <a href="#" class="balloon__scheme">Схема проезда</a>
      </div>
    `
  },
  {
    balloonOffset: [50, -40]
  });
  myMap.geoObjects.add(myPlacemark);
  myPlacemark.balloon.open();
  myMap.events.add('click', e => e.get('target').balloon.close());
  myMap.setCenter([59.929994, 30.346644]);
}