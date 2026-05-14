/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article
 * Base block: cards
 * Source selector: div.masContenido
 * Source structure: ul.notas > li.item > a > (figure > img) + p
 * Target: 2-column table, N rows. Col 1 = image, Col 2 = headline link.
 * Generated: 2026-05-14
 */
export default function parse(element, { document }) {
  // Select all card items from the related articles list
  const items = element.querySelectorAll('ul.notas > li.item');

  const cells = [];

  items.forEach((item) => {
    // Each li.item contains an anchor wrapping figure>img and a p
    const anchor = item.querySelector('a');
    const img = item.querySelector('figure img, img');
    const headline = item.querySelector('p');

    if (!anchor || !img) return;

    // Column 1: image element
    const image = img.cloneNode(true);

    // Column 2: headline text as a link
    const link = document.createElement('a');
    link.href = anchor.href || anchor.getAttribute('href') || '';
    link.textContent = headline
      ? headline.textContent.trim()
      : img.alt || img.getAttribute('alt') || '';

    cells.push([image, link]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-article',
    cells,
  });

  element.replaceWith(block);
}
