
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

/*BUILDING DD BLOG SIDEBAR*/

  function injectBlogMetaCleanly() {
    const $container = $(".blog-item-content");
    if (!$container.length) return;

    // Prevent reinjection
    if ($container.find(".dd-blog-content-column").length) return;

    // Grab and remove main elements
    const $metaWrapper = $(".blog-item-meta-wrapper").first().detach(); // move, don't clone
    const $tags = $(".blog-meta-item--tags[data-content-field='tags']").first().detach();
    const $htmlContent = $container.find(".sqs-layout").first();
    if (!$metaWrapper.length || !$htmlContent.length) return;

    // Build columns
    const $metaCol = $("<div class='dd-blog-meta-column'></div>").append($metaWrapper);
    const $contentCol = $("<div class='dd-blog-content-column'></div>").append($htmlContent);
    $container.empty().append($metaCol, $contentCol);

    // Add tags to meta wrapper
    if ($tags.length) {
      $metaWrapper.append($tags);
    }

    // Format tags (Content Type)
    const $movedTags = $metaWrapper.find(".blog-meta-item--tags").first();
    if ($movedTags.length) {
      const tagsHTML = $movedTags.html();
      $movedTags.html(`
        <div class="meta-label">Content Type:</div>
        <div class="meta-data">${tagsHTML}</div>
      `);
    }

    // Format categories
    const $categories = $metaWrapper.find(".blog-meta-item--categories").first();
    if ($categories.length) {
      const categoriesHTML = $categories.html();
      $categories.html(`
        <div class="meta-label">Research Pillar:</div>
        <div class="meta-data">${categoriesHTML}</div>
      `);
    }

    // Reading time
    const textContent = $htmlContent.text().trim();
    const words = textContent.split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(words / 200));
    const $readingTime = $(`
      <div class="blog-meta-item blog-meta-item--reading-time">
        <div class="meta-label">Reading Time:</div>
        <div class="meta-data">${readingTime} Min Read</div>
      </div>
    `);
    $metaWrapper.append($readingTime);

    // Author + Date
    const $authorDateWrapper = $metaWrapper.find(".blog-item-author-date-wrapper").first();
    if ($authorDateWrapper.length) {
      const $dateTime = $authorDateWrapper.find(".blog-meta-item--date").first();
      const $author = $authorDateWrapper.find(".blog-meta-item--author").first();

      if ($dateTime.length) {
        const dateText = $dateTime.text().trim();
        const $newDate = $(`
          <div class="blog-meta-item blog-meta-item--date">
            <div class="meta-label">Date:</div>
            <div class="meta-data">${dateText}</div>
          </div>
        `);
        $metaWrapper.append($newDate);
      }

      if ($author.length) {
        const $authorLink = $author.find("a").first();
        if ($authorLink.length) {
          const $newAuthor = $(`
            <div class="blog-meta-item blog-meta-item--author">
              <div class="meta-label">Author:</div>
              <div class="meta-data">${$authorLink.prop("outerHTML")}</div>
            </div>
          `);
          $metaWrapper.append($newAuthor);
        }
      }

      $authorDateWrapper.remove();
    }
    
/*MOVE DOWNLOAD BUTTON TO SIDEBAR*/
    const $button = $htmlContent.find("a.sqs-block-button-element")
      .filter(function () {
        return $(this).text().trim() === "Download PDF";
      })
      .first()
      .detach(); // move, not clone

    if ($button.length) {
      const $buttonBlock = $(`
        <div class="blog-meta-cta blog-meta-item--pdf-download">
        </div>
      `).append($button);
      $container.find(".dd-blog-meta-column").append($buttonBlock);
    }

  }

  // Init
  $(document).ready(function () {
    injectBlogMetaCleanly();
    $(document).on("pjax:end", function () {
      injectBlogMetaCleanly();
    });
  });


