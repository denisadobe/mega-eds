/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import embedVideoParser from './parsers/embed-video.js';
import cardsArticleParser from './parsers/cards-article.js';

// TRANSFORMER IMPORTS
import megaCleanupTransformer from './transformers/mega-cleanup.js';
import megaSectionsTransformer from './transformers/mega-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'article-page',
  description: 'TV show article page featuring video highlights, article text, and related content',
  urls: [
    'https://www.mega.cl/programas/el-internado/mejores-momentos/215071-agustina-pontoriero-destrozo-romance-tom-brusse-camila-nash-cruel-prediccion.html',
  ],
  blocks: [
    {
      name: 'embed-video',
      instances: ['div.portada-video'],
    },
    {
      name: 'cards-article',
      instances: ['div.masContenido'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Article Header',
      selector: 'div.contenedor-contenido',
      style: null,
      blocks: ['embed-video'],
      defaultContent: ['ul.categoria', 'h1', 'div.creditosRedes', 'div.fechaHora'],
    },
    {
      id: 'section-2',
      name: 'Article Body',
      selector: 'div.contenido-nota',
      style: null,
      blocks: [],
      defaultContent: ['div.contenido-nota > p', 'figure.creditosImgBody', 'h2', 'a.btn-siguienteNota', 'div.textoFinalNota', 'a.btn-nota-megago'],
    },
    {
      id: 'section-3',
      name: 'Article Tags',
      selector: 'div.area-usuario-articulo.leer-mas',
      style: null,
      blocks: [],
      defaultContent: ['div.contenedor-temas ul'],
    },
    {
      id: 'section-4',
      name: 'Related Articles',
      selector: 'div.masContenido',
      style: null,
      blocks: ['cards-article'],
      defaultContent: ['h4'],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'embed-video': embedVideoParser,
  'cards-article': cardsArticleParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  megaCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [megaSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
