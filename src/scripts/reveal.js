const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && "IntersectionObserver" in window) {
  const targets = document.querySelectorAll(".reveal, [data-reveal], [data-words]");

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.dataset.state = "shown";
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0, rootMargin: "0px 0px -10% 0px" }
  );

  for (const el of targets) {
    el.dataset.state = "hidden"; // acá recién se oculta y se posiciona
    observer.observe(el);
  }
}