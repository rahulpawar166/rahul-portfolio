const SVG_NS = "http://www.w3.org/2000/svg";
let nextID = 0;

function svgElement(name, attributes = {}) {
  const element = document.createElementNS(SVG_NS,name);
  for(const [key,value] of Object.entries(attributes)) element.setAttribute(key,String(value));
  return element;
}

// The signed-distance normal of a rounded rectangle describes the glass bevel.
// Interior pixels remain neutral; only the convex edge redirects the sample ray.
function lensMap(width,height,scale,radius) {
  const canvas = document.createElement("canvas");
  canvas.width=width; canvas.height=height;
  const context=canvas.getContext("2d");
  const pixels=context.createImageData(width,height);
  const bevel=Math.min(16,height*.25);
  for(let y=0;y<height;y++) {
    for(let x=0;x<width;x++) {
      const px=x+.5-width/2, py=y+.5-height/2;
      const qx=Math.abs(px)-(width/2-radius), qy=Math.abs(py)-(height/2-radius);
      const ox=Math.max(qx,0), oy=Math.max(qy,0);
      const length=Math.hypot(ox,oy);
      const distance=-(length+Math.min(Math.max(qx,qy),0)-radius);
      let nx=0,ny=0;
      if(length>0) { nx=Math.sign(px)*ox/length; ny=Math.sign(py)*oy/length; }
      else if(qx>qy) nx=Math.sign(px);
      else ny=Math.sign(py);
      const edge=Math.max(0,Math.min(1,1-distance/bevel));
      const bend=distance>=0 ? Math.sin(edge*Math.PI/2)**2*10 : 0;
      const offset=(y*width+x)*4;
      pixels.data[offset]=Math.round((.5-nx*bend/scale)*255);
      pixels.data[offset+1]=Math.round((.5-ny*bend/scale)*255);
      pixels.data[offset+2]=128;
      pixels.data[offset+3]=255;
    }
  }
  context.putImageData(pixels,0,0);
  return canvas.toDataURL();
}

export function liquidGlass(element,{sourceSelector=".rp-portfolio main"}={}) {
  if(!element) return {destroy(){}};
  const surface=element.parentElement;
  const id=`optical-glass-${++nextID}`;
  const svg=svgElement("svg",{width:0,height:0,"aria-hidden":"true"});
  svg.style.position="absolute"; svg.style.pointerEvents="none";
  const defs=svgElement("defs");
  const filter=svgElement("filter",{id,filterUnits:"userSpaceOnUse",primitiveUnits:"userSpaceOnUse",x:0,y:0,"color-interpolation-filters":"sRGB"});
  const map=svgElement("feImage",{result:"lens",preserveAspectRatio:"none",x:0,y:0});
  const bend=svgElement("feDisplacementMap",{in:"SourceGraphic",in2:"lens",scale:28,xChannelSelector:"R",yChannelSelector:"G",result:"refracted"});
  const polish=svgElement("feGaussianBlur",{in:"refracted",stdDeviation:.55,result:"polished"});
  const color=svgElement("feColorMatrix",{in:"polished",type:"saturate",values:1.25});
  filter.append(map,bend,polish,color); defs.append(filter); svg.append(defs); document.body.append(svg);

  // SVG backdrop filters are not consistently implemented in WebKit/Gecko.
  // Their fallback refracts an inert, scroll-aligned rendering of the same scene
  // through a regular SVG filter. No canvas screenshot or remote texture is used.
  const agent=navigator.userAgent;
  const nativeBackdrop=CSS.supports("backdrop-filter",`url(#${id})`) && /Chrome|Chromium|Edg\//.test(agent);
  let scene=null,source=null,mutation=null;
  let frame=0,rebuildFrame=0;
  let destroyed=false;
  if(nativeBackdrop) {
    element.style.backdropFilter=`url(#${id})`;
    element.dataset.refraction="svg-backdrop";
  } else {
    element.style.filter=`url(#${id})`;
    element.dataset.refraction="svg-scene";
    scene=document.createElement("div");
    scene.className="optical-glass-scene";
    scene.setAttribute("inert",""); scene.setAttribute("aria-hidden","true");
    element.append(scene);
  }

  function syncPosition() {
    frame=0;
    if(!scene || !source || destroyed) return;
    const rect=surface.getBoundingClientRect();
    const sourceRect=source.getBoundingClientRect();
    scene.style.width=`${document.documentElement.clientWidth}px`;
    scene.style.transform=`translate3d(${-rect.left}px,${sourceRect.top-rect.top}px,0)`;
  }
  function queuePosition() { if(!frame) frame=requestAnimationFrame(syncPosition); }
  function rebuildScene() {
    rebuildFrame=0;
    if(!scene || destroyed) return;
    source=document.querySelector(sourceSelector);
    if(!source) return;
    const clone=source.cloneNode(true);
    clone.removeAttribute("id");
    for(const node of clone.querySelectorAll("[id]")) node.removeAttribute("id");
    for(const dialog of clone.querySelectorAll("dialog")) dialog.remove();
    // Reveal animations belong to the page, not to its optical reflection.
    for(const node of [clone,...clone.querySelectorAll("[style]")]) {
      node.style.removeProperty("opacity"); node.style.removeProperty("transform");
    }
    for(const image of clone.querySelectorAll("img")) image.loading="eager";
    scene.replaceChildren(clone);
    syncPosition();
  }
  function queueRebuild() { if(!rebuildFrame) rebuildFrame=requestAnimationFrame(rebuildScene); }
  function resize() {
    const width=Math.round(element.offsetWidth),height=Math.round(element.offsetHeight);
    if(!width || !height || destroyed) return;
    filter.setAttribute("width",width); filter.setAttribute("height",height);
    map.setAttribute("width",width); map.setAttribute("height",height);
    const radius=Math.min(width/2,height/2,parseFloat(getComputedStyle(surface).borderTopLeftRadius) || height/2);
    map.setAttribute("href",lensMap(width,height,28,radius));
    if(scene) rebuildScene();
  }
  function pointer(event) {
    const rect=surface.getBoundingClientRect();
    surface.style.setProperty("--glass-light-x",`${(event.clientX-rect.left)/rect.width*100}%`);
    surface.style.setProperty("--glass-light-y",`${(event.clientY-rect.top)/rect.height*100}%`);
  }
  function resetPointer() {
    surface.style.removeProperty("--glass-light-x"); surface.style.removeProperty("--glass-light-y");
  }
  const observer=new ResizeObserver(resize); observer.observe(surface);
  if(scene) {
    rebuildScene();
    if(source) { mutation=new MutationObserver(queueRebuild); mutation.observe(source,{subtree:true,childList:true,characterData:true}); }
    window.addEventListener("scroll",queuePosition,{passive:true});
    window.addEventListener("resize",queuePosition,{passive:true});
    source?.addEventListener("toggle",queueRebuild,true);
    source?.addEventListener("load",queuePosition,true);
  }
  surface.addEventListener("pointermove",pointer,{passive:true});
  surface.addEventListener("pointerleave",resetPointer,{passive:true});
  resize();
  return {destroy() {
    destroyed=true; observer.disconnect(); mutation?.disconnect();
    cancelAnimationFrame(frame); cancelAnimationFrame(rebuildFrame);
    window.removeEventListener("scroll",queuePosition); window.removeEventListener("resize",queuePosition);
    source?.removeEventListener("toggle",queueRebuild,true); source?.removeEventListener("load",queuePosition,true);
    surface.removeEventListener("pointermove",pointer); surface.removeEventListener("pointerleave",resetPointer);
    resetPointer(); scene?.remove(); svg.remove();
    element.style.backdropFilter=""; element.style.filter=""; delete element.dataset.refraction;
  }};
}
