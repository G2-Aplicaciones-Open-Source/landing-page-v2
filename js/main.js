/**
 * Script principal para la landing page
 * Maneja la inicialización y coordinación de todos los componentes
 */

// Módulo para el menú hamburguesa
const MobileMenu = {
  init() {
    this.menuToggle = document.querySelector(".menu-toggle");
    this.nav = document.querySelector(".nav");
    this.navLinks = document.querySelectorAll(".nav ul li a");
    
    if (!this.menuToggle || !this.nav) return;
    
    this.bindEvents();
  },

  bindEvents() {
    // Abrir/cerrar menú con botón hamburguesa
    this.menuToggle.addEventListener("click", () => {
      this.toggleMenu();
    });

    // Cerrar menú al hacer clic en enlaces
    this.navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMenu();
      });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", (event) => {
      if (!this.nav.contains(event.target) && !this.menuToggle.contains(event.target)) {
        this.closeMenu();
      }
    });
  },

  toggleMenu() {
    this.nav.classList.toggle("active");
  },

  closeMenu() {
    this.nav.classList.remove("active");
  }
};

// Módulo para el carrusel
const Carousel = {
  init() {
    this.track = document.querySelector(".carousel-track");
    if (!this.track) return; // Salir si no hay carrusel
    
    this.slides = Array.from(this.track.children);
    this.nextButton = document.querySelector(".carousel-button.next");
    this.prevButton = document.querySelector(".carousel-button.prev");
    this.currentSlideIndex = 0;
    
    if (!this.slides.length) return;
    
    this.setup();
    this.bindEvents();
  },

  setup() {
    this.slideWidth = this.slides[0].getBoundingClientRect().width;
    this.moveToSlide(this.currentSlideIndex);
  },

  moveToSlide(targetIndex) {
    // Validar límites
    if (targetIndex < 0) targetIndex = 0;
    if (targetIndex >= this.slides.length) targetIndex = this.slides.length - 1;

    // Actualizar posición del carrusel
    this.slideWidth = this.slides[0].getBoundingClientRect().width;
    
    this.track.style.transform = `translateX(-${this.slideWidth * targetIndex}px)`;
    this.currentSlideIndex = targetIndex;
    this.updateButtonStates();
  },

  updateButtonStates() {
    if (this.prevButton) {
      this.prevButton.disabled = this.currentSlideIndex === 0;
    }
    if (this.nextButton) {
      this.nextButton.disabled = this.currentSlideIndex === this.slides.length - 1;
    }
  },

  bindEvents() {
    if (this.nextButton) {
      this.nextButton.addEventListener("click", () => {
        this.moveToSlide(this.currentSlideIndex + 1);
      });
    }

    if (this.prevButton) {
      this.prevButton.addEventListener("click", () => {
        this.moveToSlide(this.currentSlideIndex - 1);
      });
    }

    // Manejar resize para responsive
    window.addEventListener("resize", () => {
      this.handleResize();
    });
  },

  handleResize() {
    this.slideWidth = this.slides[0].getBoundingClientRect().width;
    
    // Actualizar posición sin transición
    this.track.style.transition = "none";
    this.track.style.transform = `translateX(-${this.slideWidth * this.currentSlideIndex}px)`;
    
    // Forzar reflow y reactivar transición
    this.track.offsetHeight;
    this.track.style.transition = "transform 0.5s ease-in-out";
  }
};

// Módulo para el language switcher (solo UI)
const LanguageSwitcher = {
  init() {
    this.switcher = document.querySelector(".language-switcher");
    this.button = document.querySelector(".language-button");
    this.menu = document.querySelector(".language-menu");
    
    if (!this.switcher || !this.button || !this.menu) return;
    
    this.bindEvents();
  },

  bindEvents() {
    // Mostrar/ocultar menú
    this.button.addEventListener("click", () => {
      this.toggleMenu();
    });

    // Manejar selección de idioma
    this.menu.addEventListener("click", (e) => {
      if (e.target.tagName === "LI") {
        const lang = e.target.getAttribute("data-lang");
        this.onLanguageSelected(lang);
        this.closeMenu();
      }
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (!this.switcher.contains(e.target)) {
        this.closeMenu();
      }
    });
  },

  toggleMenu() {
    this.switcher.classList.toggle("active");
  },

  closeMenu() {
    this.switcher.classList.remove("active");
  },

  // Callback que será asignado desde i18n.js
  onLanguageSelected(lang) {
    // Esta función será sobrescrita por el módulo i18n
    console.log(`Language selected: ${lang}`);
  }
};

// Inicialización principal
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar todos los módulos
  MobileMenu.init();
  Carousel.init();
  LanguageSwitcher.init();
  
  console.log("Página inicializada correctamente");
});

// Exportar módulos para uso en otros archivos
window.AppModules = {
  MobileMenu,
  Carousel,
  LanguageSwitcher
};