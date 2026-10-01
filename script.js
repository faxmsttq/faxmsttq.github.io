const nav = document.getElementById("nav");
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 20);
    });

    const items = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add("show");
      });
    }, {threshold:.12});
    items.forEach(item => observer.observe(item));

    const langBtn = document.getElementById("langBtn");
    let english = false;

    langBtn.addEventListener("click", () => {
      english = !english;
      langBtn.textContent = english ? "TH" : "EN";

      document.querySelectorAll("[data-th][data-en]").forEach(el => {
        el.textContent = english ? el.dataset.en : el.dataset.th;
      });
    });
