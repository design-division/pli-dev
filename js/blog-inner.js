
/*REFERENCES ACCORDION ANCHOR LINK*/

document.addEventListener("DOMContentLoaded", function () {
  // 1. Find the accordion item with "References" in the title
  const accordionItems = document.querySelectorAll(".accordion-item");
  let referenceAccordion;

  accordionItems.forEach(item => {
    const titleSpan = item.querySelector(".accordion-item__title");
    if (titleSpan && titleSpan.textContent.trim().toLowerCase() === "references") {
      // Give this item an ID so it can be linked to
      item.setAttribute("id", "references");
      referenceAccordion = item;
    }
  });

  if (!referenceAccordion) return;

  // 2. Handle anchor link clicks
  function openAndScrollToAccordion() {
    const button = referenceAccordion.querySelector(".accordion-item__click-target");
    const isOpen = referenceAccordion.getAttribute("data-is-open") === "true";

    if (!isOpen) {
      button.click(); // Triggers the opening
    }

    // Smooth scroll into view
    referenceAccordion.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Check if link with #references was clicked (even from external pages)
  if (window.location.hash === "#references") {
    setTimeout(openAndScrollToAccordion, 500); // Delay helps if page loads slowly
  }

  // Also handle in-page link clicks dynamically
  document.querySelectorAll('a[href="#references"]').forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      openAndScrollToAccordion();
      history.pushState(null, "", "#references"); // Optional: update URL hash
    });
  });
});

