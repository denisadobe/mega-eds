/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: mega sections.
 * Inserts section breaks (<hr>) and Section Metadata blocks based on
 * template sections defined in page-templates.json.
 * Runs only in afterTransform hook.
 *
 * Template sections (article-page):
 *   1. Article Header — selector: div.contenedor-contenido
 *   2. Article Body — selector: div.contenido-nota
 *   3. Article Tags — selector: div.area-usuario-articulo.leer-mas
 *   4. Related Articles — selector: div.masContenido
 *
 * All selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const sections = template.sections;

    // Process sections in reverse order to avoid DOM position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Insert <hr> before every section except the first to create section breaks
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
