/* ========== REFERENCES ACCORDION ANCHOR LINK ========== */

function initReferencesAccordion() {
  const accordionItems = document.querySelectorAll(".accordion-item");
  let referenceAccordion = null;

  accordionItems.forEach((item) => {
    const titleSpan = item.querySelector(".accordion-item__title");
    const title = titleSpan?.textContent?.trim().toLowerCase() || "";

    // If you want exact match, keep === "references"
    if (title === "references") {
      item.setAttribute("id", "references");
      referenceAccordion = item;
    }
  });

  if (!referenceAccordion) return;

  function openAndScrollToAccordion() {
    const button = referenceAccordion.querySelector(".accordion-item__click-target");
    if (!button) return;

    const isOpen = referenceAccordion.getAttribute("data-is-open") === "true";
    if (!isOpen) button.click();

    referenceAccordion.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Hash on load
  if (window.location.hash === "#references") {
    setTimeout(openAndScrollToAccordion, 500);
  }

  // In-page clicks
  document.querySelectorAll('a[href="#references"]').forEach((link) => {
    // prevent double-binding if init runs multiple times
    if (link.dataset.ddReferencesBound) return;
    link.dataset.ddReferencesBound = "true";

    link.addEventListener("click", function (e) {
      e.preventDefault();
      openAndScrollToAccordion();
      history.pushState(null, "", "#references");
    });
  });
}

document.addEventListener("DOMContentLoaded", initReferencesAccordion);


/* ========== BUILDING DD BLOG SIDEBAR ========== */

function injectBlogMetaCleanly() {
  const $container = $(".blog-item-content");
  if (!$container.length) return;

  // Prevent reinjection
  if ($container.find(".dd-blog-content-column").length) return;

  // Scope to the current blog item area as much as possible
  const $postRoot = $container.closest(".blog-item-wrapper, article, .blog-item"); // flexible selectors

  const $metaWrapper = ($postRoot.length ? $postRoot.find(".blog-item-meta-wrapper") : $(".blog-item-meta-wrapper"))
    .first()
    .detach();

  const $tags = ($postRoot.length
    ? $postRoot.find(".blog-meta-item--tags[data-content-field='tags']")
    : $(".blog-meta-item--tags[data-content-field='tags']")
  )
    .first()
    .detach();

  const $htmlContent = $container.find(".sqs-layout").first();
  if (!$metaWrapper.length || !$htmlContent.length) return;

  // Build columns
  const $metaCol = $("<div class='dd-blog-meta-column'></div>").append($metaWrapper);
  const $contentCol = $("<div class='dd-blog-content-column'></div>").append($htmlContent);
  $container.empty().append($metaCol, $contentCol);

  // Add tags to meta wrapper
  if ($tags.length) $metaWrapper.append($tags);

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
  const words = textContent ? textContent.split(/\s+/).length : 0;
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
      $metaWrapper.append(`
        <div class="blog-meta-item blog-meta-item--date">
          <div class="meta-label">Date:</div>
          <div class="meta-data">${dateText}</div>
        </div>
      `);
    }

    if ($author.length) {
      const $authorLink = $author.find("a").first();
      if ($authorLink.length) {
        $metaWrapper.append(`
          <div class="blog-meta-item blog-meta-item--author">
            <div class="meta-label">Author:</div>
            <div class="meta-data">${$authorLink.prop("outerHTML")}</div>
          </div>
        `);
      }
    }

    $authorDateWrapper.remove();
  }

  /* MOVE DOWNLOAD BUTTON TO SIDEBAR */
  const $button = $htmlContent
    .find("a.sqs-block-button-element")
    .filter(function () {
      return $(this).text().trim() === "Download PDF";
    })
    .first()
    .detach();

  if ($button.length) {
    const $buttonBlock = $(`<div class="blog-meta-cta blog-meta-item--pdf-download"></div>`).append($button);
    $container.find(".dd-blog-meta-column").append($buttonBlock);
  }
}


/* ========== BACK TO ARTICLES BUTTON ========== */

function addBackToArticlesButton() {
  const $wrap = $(".dd-blog-meta-column");
  if (!$wrap.length) return;

  if ($wrap.find(".blog-back-button").length) return; // prevent duplicates

  $wrap.append(
    '<div class="blog-back-button">' +
      '<a class="item-pagination-link back-button" href="/research-hub">Back to Articles</a>' +
    "</div>"
  );
}

/* ========== STACKED QUOTE: MOVE SOURCE IMAGE/NAME/BUTTON INTO ONE WRAP ========== */
function restructureStackedQuoteSources() {
  const $article = $("#article");
  if (!$article.length) return;

  $article.find("figure.design-layout-stack").each(function () {
    const $figure = $(this);

    if ($figure.data("kolQuoteProcessed")) return;

    const $intrinsic = $figure.children(".intrinsic").first(); 
    const $caption = $figure.find("figcaption.image-card-wrapper").first();
    const $card = $caption.find(".image-card").first();

    if (!$intrinsic.length || !$caption.length || !$card.length) return;

    const $subtitleWrapper = $card.find(".image-subtitle-wrapper").first();
    if (!$subtitleWrapper.length) return;

    const $sourceH4 = $card.find(".image-subtitle h4").first().length
      ? $card.find(".image-subtitle h4").first()
      : $card.find("h4").first();

    const $buttonWrap = $card.find(".image-button-wrapper").first();

    if (!$sourceH4.length && !$buttonWrap.length) return;

    let $sourceWrap = $card.find(".kol-quote-source").first();
    if (!$sourceWrap.length) {
      $sourceWrap = $("<div class='kol-quote-source'></div>");
      $sourceWrap.insertAfter($subtitleWrapper);
    }

    let $attrText = $sourceWrap.find(".kol-attr-text").first();
    if (!$attrText.length) {
      $attrText = $("<div class='kol-attr-text'></div>");
      $sourceWrap.append($attrText);
    }

    $sourceWrap.prepend($intrinsic);

    if ($sourceH4.length) $attrText.append($sourceH4);
    if ($buttonWrap.length) $attrText.append($buttonWrap);

    $figure.data("kolQuoteProcessed", true);
  });
}

/* ========== INIT (Squarespace PJAX safe) ========== */
$(document).ready(function () {
  injectBlogMetaCleanly();
  addBackToArticlesButton();
  restructureStackedQuoteSources();
});

$(document).on("pjax:end", function () {
  injectBlogMetaCleanly();
  addBackToArticlesButton();
  restructureStackedQuoteSources();
  initReferencesAccordion();
});
