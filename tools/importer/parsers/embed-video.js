/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-video
 * Base block: embed
 * Source selector: div.portada-video
 * Extracts video URL from mdstrm.com iframe and produces an Embed block table
 * Generated: 2026-05-14
 */
export default function parse(element, { document }) {
  // Extract the iframe element — source HTML nests it inside div.video-destacado > div#mdstrm-player
  const iframe = element.querySelector('iframe');

  if (!iframe) {
    // No iframe found — nothing to extract
    return;
  }

  const iframeSrc = iframe.getAttribute('src');
  if (!iframeSrc) {
    return;
  }

  // Clean the URL: extract base embed URL without query parameters
  // Source URL pattern: https://mdstrm.com/embed/{id}?jsapi=true&...
  let videoUrl;
  try {
    const url = new URL(iframeSrc);
    videoUrl = `${url.origin}${url.pathname}`;
  } catch (e) {
    // Fallback: use raw src if URL parsing fails
    videoUrl = iframeSrc.split('?')[0] || iframeSrc;
  }

  // Create an anchor element with the video URL as both href and text
  const link = document.createElement('a');
  link.href = videoUrl;
  link.textContent = videoUrl;

  // Build cells: single row with the video link
  // Matches library example: | <a href="...">...</a> |
  const cells = [
    [link],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-video', cells });
  element.replaceWith(block);
}
