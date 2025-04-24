// Menú

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");
    const navLinks = document.querySelectorAll(".nav ul li a");
  
    // Abrir o cerrar el menú al hacer clic en el botón hamburguesa
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  
    // Cerrar el menú al hacer clic en un enlace
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
      });
    });
  
    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
        nav.classList.remove("active");
      }
    });
  });

// Carrusel de imágenes

// Espera a que el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carousel-track");
    if (!track) return; // Salir si no hay carrusel en la página
  
    const slides = Array.from(track.children);
    const nextButton = document.querySelector(".carousel-button.next");
    const prevButton = document.querySelector(".carousel-button.prev");
  
    let slideWidth = slides[0].getBoundingClientRect().width;
  
    // Coloca los slides uno al lado del otro
    const setSlidePosition = (slide, index) => {
      slide.style.left = slideWidth * index + "px";
    };
    slides.forEach(setSlidePosition);
  
    let currentSlideIndex = 0;
  
    // Mover al slide
    const moveToSlide = (targetIndex) => {
      if (!track || !slides.length) return;
  
      // Asegurarse que el índice está dentro de los límites
      if (targetIndex < 0) targetIndex = 0;
      if (targetIndex >= slides.length) targetIndex = slides.length - 1;
  
      track.style.transform = "translateX(-" + slideWidth * targetIndex + "px)";
      currentSlideIndex = targetIndex;
  
      // Actualizar estado de botones
      prevButton.disabled = currentSlideIndex === 0;
      nextButton.disabled = currentSlideIndex === slides.length - 1;
    };
  
    // Mover al slide inicial
    moveToSlide(0);
  
    // Listener para el botón "Siguiente"
    nextButton.addEventListener("click", () => {
      moveToSlide(currentSlideIndex + 1);
    });
  
    // Listener para el botón "Anterior"
    prevButton.addEventListener("click", () => {
      moveToSlide(currentSlideIndex - 1);
    });
  
    // Recalcular en resize para responsive
    window.addEventListener("resize", () => {
      slideWidth = slides[0].getBoundingClientRect().width; // Recalcular ancho
      slides.forEach(setSlidePosition); // Reposicionar slides
      track.style.transition = "none"; // Desactivar transición durante el resize
      track.style.transform =
        "translateX(-" + slideWidth * currentSlideIndex + "px)";
      track.offsetHeight; // Forzar reflow
      track.style.transition = "transform 0.5s ease-in-out"; // Reactivar transición
    });
  });
  