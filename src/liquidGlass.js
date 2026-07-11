const SVG_NS = "http://www.w3.org/2000/svg";

let uid = 0;
let svgDefs = null;

function canUseFilteredBackdrop() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  const ua = window.navigator.userAgent;
  const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua);
  const isFirefox = /Firefox/.test(ua);

  if (isSafari || isFirefox || !window.CSS?.supports("backdrop-filter", "url(#lg)")) {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 4;
    canvas.height = 4;
    canvas.getContext("2d").getImageData(0, 0, 1, 1);
    return true;
  } catch {
    return false;
  }
}

function ensureDefs() {
  if (svgDefs) return svgDefs;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true");
  svg.style.position = "absolute";
  svg.style.pointerEvents = "none";

  svgDefs = document.createElementNS(SVG_NS, "defs");
  svg.appendChild(svgDefs);
  document.body.appendChild(svg);

  return svgDefs;
}

function makeMap(width, height, radius, border, mapBlur) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  const ctx = canvas.getContext("2d");
  const gx = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gx.addColorStop(0, "rgb(0,0,0)");
  gx.addColorStop(1, "rgb(255,0,0)");
  ctx.fillStyle = gx;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gy = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gy.addColorStop(0, "rgb(0,0,0)");
  gy.addColorStop(1, "rgb(0,0,255)");
  ctx.globalCompositeOperation = "difference";
  ctx.fillStyle = gy;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";

  const inset = border * Math.min(canvas.width, canvas.height);
  ctx.filter = `blur(${mapBlur}px)`;
  ctx.fillStyle = "rgba(128,128,128,0.93)";
  ctx.beginPath();
  ctx.roundRect(
    inset,
    inset,
    canvas.width - inset * 2,
    canvas.height - inset * 2,
    Math.max(radius - inset, 2),
  );
  ctx.fill();
  ctx.filter = "none";

  return canvas.toDataURL();
}

function buildFilter(id, scales) {
  const filter = document.createElementNS(SVG_NS, "filter");
  filter.setAttribute("id", id);
  filter.setAttribute("x", "0");
  filter.setAttribute("y", "0");
  filter.setAttribute("width", "100%");
  filter.setAttribute("height", "100%");
  filter.setAttribute("color-interpolation-filters", "sRGB");

  const feImage = document.createElementNS(SVG_NS, "feImage");
  feImage.setAttribute("x", "0");
  feImage.setAttribute("y", "0");
  feImage.setAttribute("result", "map");
  feImage.setAttribute("preserveAspectRatio", "none");
  filter.appendChild(feImage);

  const channelMatrices = [
    "1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0",
    "0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0",
    "0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0",
  ];
  const channels = [];

  for (let index = 0; index < 3; index += 1) {
    const displacement = document.createElementNS(SVG_NS, "feDisplacementMap");
    displacement.setAttribute("in", "SourceGraphic");
    displacement.setAttribute("in2", "map");
    displacement.setAttribute("scale", scales[index]);
    displacement.setAttribute("xChannelSelector", "R");
    displacement.setAttribute("yChannelSelector", "B");
    displacement.setAttribute("result", `d${index}`);
    filter.appendChild(displacement);

    const colorMatrix = document.createElementNS(SVG_NS, "feColorMatrix");
    colorMatrix.setAttribute("in", `d${index}`);
    colorMatrix.setAttribute("type", "matrix");
    colorMatrix.setAttribute("values", channelMatrices[index]);
    colorMatrix.setAttribute("result", `c${index}`);
    filter.appendChild(colorMatrix);
    channels.push(`c${index}`);
  }

  const blend1 = document.createElementNS(SVG_NS, "feBlend");
  blend1.setAttribute("in", channels[0]);
  blend1.setAttribute("in2", channels[1]);
  blend1.setAttribute("mode", "screen");
  blend1.setAttribute("result", "c01");
  filter.appendChild(blend1);

  const blend2 = document.createElementNS(SVG_NS, "feBlend");
  blend2.setAttribute("in", "c01");
  blend2.setAttribute("in2", channels[2]);
  blend2.setAttribute("mode", "screen");
  filter.appendChild(blend2);

  ensureDefs().appendChild(filter);
  return { filter, feImage };
}

function resolveRadius(element, width, height, override) {
  if (override != null) return override;

  const raw = getComputedStyle(element).borderTopLeftRadius || "0px";
  const value = parseFloat(raw) || 0;

  return raw.trim().endsWith("%") ? (value / 100) * Math.min(width, height) : value;
}

export function liquidGlass(element, options = {}) {
  const opts = {
    scale: -112,
    chroma: 6,
    border: 0.07,
    mapBlur: 12,
    blur: 3,
    saturate: 1.5,
    radius: null,
    fallbackBlur: 18,
    ...options,
  };

  if (!element) {
    return { supported: false, refresh() {}, destroy() {} };
  }

  if (!canUseFilteredBackdrop()) {
    const fallback = `blur(${opts.fallbackBlur}px) saturate(${opts.saturate})`;
    element.style.backdropFilter = fallback;
    element.style.webkitBackdropFilter = fallback;
    element.classList.add("liquid-glass-fallback");

    return {
      supported: false,
      refresh() {},
      destroy() {
        element.style.backdropFilter = "";
        element.style.webkitBackdropFilter = "";
        element.classList.remove("liquid-glass-fallback");
      },
    };
  }

  const id = `liquid-glass-filter-${++uid}`;
  const filterParts = buildFilter(id, [
    opts.scale,
    opts.scale + opts.chroma,
    opts.scale + opts.chroma * 2,
  ]);

  function refresh() {
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    if (!width || !height) return;

    const radius = resolveRadius(element, width, height, opts.radius);
    filterParts.feImage.setAttribute("href", makeMap(width, height, radius, opts.border, opts.mapBlur));
    filterParts.feImage.setAttribute("width", width);
    filterParts.feImage.setAttribute("height", height);
  }

  refresh();
  const filter = `url(#${id}) blur(${opts.blur}px) saturate(${opts.saturate})`;
  element.style.backdropFilter = filter;
  element.style.webkitBackdropFilter = filter;
  element.classList.add("liquid-glass-supported");

  let timer = null;
  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(refresh, 120);
  });
  resizeObserver.observe(element);

  return {
    supported: true,
    refresh,
    destroy() {
      resizeObserver.disconnect();
      clearTimeout(timer);
      filterParts.filter.remove();
      element.style.backdropFilter = "";
      element.style.webkitBackdropFilter = "";
      element.classList.remove("liquid-glass-supported");
    },
  };
}
