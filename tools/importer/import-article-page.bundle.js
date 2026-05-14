/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-article-page.js
  var import_article_page_exports = {};
  __export(import_article_page_exports, {
    default: () => import_article_page_default
  });

  // tools/importer/parsers/embed-video.js
  function parse(element, { document }) {
    const iframe = element.querySelector("iframe");
    if (!iframe) {
      return;
    }
    const iframeSrc = iframe.getAttribute("src");
    if (!iframeSrc) {
      return;
    }
    let videoUrl;
    try {
      const url = new URL(iframeSrc);
      videoUrl = `${url.origin}${url.pathname}`;
    } catch (e) {
      videoUrl = iframeSrc.split("?")[0] || iframeSrc;
    }
    const link = document.createElement("a");
    link.href = videoUrl;
    link.textContent = videoUrl;
    const cells = [
      [link]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse2(element, { document }) {
    const items = element.querySelectorAll("ul.notas > li.item");
    const cells = [];
    items.forEach((item) => {
      const anchor = item.querySelector("a");
      const img = item.querySelector("figure img, img");
      const headline = item.querySelector("p");
      if (!anchor || !img) return;
      const image = img.cloneNode(true);
      const link = document.createElement("a");
      link.href = anchor.href || anchor.getAttribute("href") || "";
      link.textContent = headline ? headline.textContent.trim() : img.alt || img.getAttribute("alt") || "";
      cells.push([image, link]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-article",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/mega-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#top",
        "#stickyunit_dsk",
        ".slotAds",
        ".slots-on-paragraph",
        '[id*="google_ads"]',
        ".boxAds"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "section.alertas",
        ".patrocinador-article"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header#header",
        "nav",
        ".temasDelMomento",
        "#menu-overlay"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer.hero-mega-footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "ul.compartir-nota",
        ".seguirGuardar",
        ".btn-seguir"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".loMasVisto"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".boxLaterales"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript"
      ]);
      WebImporter.DOMUtils.remove(element, [
        '[id*="consent"]',
        '[class*="consent"]',
        '[id*="cookie"]',
        '[class*="cookie"]',
        '[id*="onetrust"]',
        '[class*="onetrust"]',
        ".fc-consent-root"
      ]);
      element.querySelectorAll("p, h1, h2").forEach((el) => {
        const text = el.textContent.trim();
        if (text === "Do Not Sell or Share My Personal Information" || text === "Opt out of the sale or sharing of personal information" || text.startsWith("We won't sell or share your personal information") || text === "Dismiss" || text === "Opt out") {
          el.remove();
        }
      });
    }
  }

  // tools/importer/transformers/mega-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-article-page.js
  var PAGE_TEMPLATE = {
    name: "article-page",
    description: "TV show article page featuring video highlights, article text, and related content",
    urls: [
      "https://www.mega.cl/programas/el-internado/mejores-momentos/215071-agustina-pontoriero-destrozo-romance-tom-brusse-camila-nash-cruel-prediccion.html"
    ],
    blocks: [
      {
        name: "embed-video",
        instances: ["div.portada-video"]
      },
      {
        name: "cards-article",
        instances: ["div.masContenido"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Article Header",
        selector: "div.contenedor-contenido",
        style: null,
        blocks: ["embed-video"],
        defaultContent: ["ul.categoria", "h1", "div.creditosRedes", "div.fechaHora"]
      },
      {
        id: "section-2",
        name: "Article Body",
        selector: "div.contenido-nota",
        style: null,
        blocks: [],
        defaultContent: ["div.contenido-nota > p", "figure.creditosImgBody", "h2", "a.btn-siguienteNota", "div.textoFinalNota", "a.btn-nota-megago"]
      },
      {
        id: "section-3",
        name: "Article Tags",
        selector: "div.area-usuario-articulo.leer-mas",
        style: null,
        blocks: [],
        defaultContent: ["div.contenedor-temas ul"]
      },
      {
        id: "section-4",
        name: "Related Articles",
        selector: "div.masContenido",
        style: null,
        blocks: ["cards-article"],
        defaultContent: ["h4"]
      }
    ]
  };
  var parsers = {
    "embed-video": parse,
    "cards-article": parse2
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_article_page_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_article_page_exports);
})();
