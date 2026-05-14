/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: mega cleanup.
 * Removes non-authorable site chrome, ads, navigation, footer, social widgets,
 * and other dynamic/non-content elements from mega.cl pages.
 * All selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove ad containers and overlays that may interfere with block parsing
    // Found: div#top.section-dfp (line 4), div#stickyunit_dsk (line 16)
    // Found: div.slotAds (lines 442, 539), div.slots-on-paragraph (lines 440, 537)
    // Found: div[id*="google_ads"] (lines 9, 19, 443, 540)
    // Found: div.boxAds (line 663)
    WebImporter.DOMUtils.remove(element, [
      '#top',
      '#stickyunit_dsk',
      '.slotAds',
      '.slots-on-paragraph',
      '[id*="google_ads"]',
      '.boxAds',
    ]);

    // Remove cookie/alert banners that block content
    // Found: section.alertas (line 318)
    // Found: div.patrocinador-article (line 337)
    WebImporter.DOMUtils.remove(element, [
      'section.alertas',
      '.patrocinador-article',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove site-wide navigation and header
    // Found: header#header (line 54), nav elements (lines 28, 83, 123, 293, 744, 835, 849)
    // Found: div.temasDelMomento (line 26), div#menu-overlay (line 122)
    WebImporter.DOMUtils.remove(element, [
      'header#header',
      'nav',
      '.temasDelMomento',
      '#menu-overlay',
    ]);

    // Remove footer
    // Found: footer.hero-mega-footer (line 684)
    WebImporter.DOMUtils.remove(element, [
      'footer.hero-mega-footer',
    ]);

    // Remove social sharing and follow/bookmark widgets
    // Found: ul.compartir-nota (line 398)
    // Found: div.seguirGuardar (line 571), div.btn-seguir (line 572)
    WebImporter.DOMUtils.remove(element, [
      'ul.compartir-nota',
      '.seguirGuardar',
      '.btn-seguir',
    ]);

    // Remove dynamic widget: most viewed sidebar
    // Found: div.loMasVisto (line 451)
    WebImporter.DOMUtils.remove(element, [
      '.loMasVisto',
    ]);

    // Remove lateral ad/widget boxes
    // Found: div.boxLaterales (line 348)
    WebImporter.DOMUtils.remove(element, [
      '.boxLaterales',
    ]);

    // Remove iframes (ad iframes, social embeds, recaptcha)
    // Remove link elements (external stylesheets)
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove browser-injected cookie consent dialogs
    WebImporter.DOMUtils.remove(element, [
      '[id*="consent"]',
      '[class*="consent"]',
      '[id*="cookie"]',
      '[class*="cookie"]',
      '[id*="onetrust"]',
      '[class*="onetrust"]',
      '.fc-consent-root',
    ]);

    // Remove CCPA "Do Not Sell" dialog text that leaks from consent overlays
    element.querySelectorAll('p, h1, h2').forEach((el) => {
      const text = el.textContent.trim();
      if (text === 'Do Not Sell or Share My Personal Information'
        || text === 'Opt out of the sale or sharing of personal information'
        || text.startsWith('We won\'t sell or share your personal information')
        || text === 'Dismiss'
        || text === 'Opt out') {
        el.remove();
      }
    });
  }
}
