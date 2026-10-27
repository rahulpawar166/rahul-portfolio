// Refresh the three featured articles from Medium's public RSS feed.
// A checked-in snapshot keeps builds and the site working if Medium is unavailable.
import { readFile, writeFile, mkdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const dataFile = new URL("src/mediumArticles.json", root);
const imageDirectory = new URL("public/images/medium/", root);
const decode = value => value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, entity => {
  const named = { "&amp;":"&", "&quot;":'"', "&apos;":"'", "&lt;":"<", "&gt;":">" };
  if (named[entity]) return named[entity];
  return String.fromCodePoint(entity.startsWith("&#x") ? parseInt(entity.slice(3,-1),16) : Number(entity.slice(2,-1)));
});
const tag = (xml, name) => decode((xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1] || "").replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1").trim());
async function request(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error(`Medium returned ${response.status}`);
  return response;
}
try {
  const xml = await (await request("https://medium.com/feed/@rahulpawar166")).text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0,3);
  if (items.length !== 3) throw new Error("Expected three Medium articles");
  const downloads = await Promise.all(items.map(async ([,item]) => {
    const title = tag(item,"title");
    const link = new URL(tag(item,"link"));
    link.search = "";
    if (link.hostname !== "medium.com") throw new Error("Unexpected article host");
    const id = link.pathname.match(/-([a-f\d]{12})$/)?.[1];
    const sourceCover = decode(tag(item,"content:encoded").match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1] || "");
    const imageURL = new URL(sourceCover);
    if (imageURL.protocol !== "https:" || !/^(cdn-images-\d+|miro)\.medium\.com$/.test(imageURL.hostname)) throw new Error("Unexpected image host");
    const pubDate = tag(item,"pubDate");
    if (!title || !id || Number.isNaN(Date.parse(pubDate))) throw new Error("Incomplete article metadata");
    const response = await request(sourceCover);
    const type = response.headers.get("content-type")?.split(";")[0];
    const extension = {"image/jpeg":"jpg","image/png":"png","image/webp":"webp"}[type];
    if (!extension) throw new Error("Unsupported cover image format");
    const filename = `${id}.${extension}`;
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (!bytes.length || bytes.length > 10_000_000) throw new Error("Invalid cover image size");
    return {filename,bytes,article:{title,link:link.href,pubDate,cover:`/images/medium/${filename}`,sourceCover}};
  }));
  await mkdir(imageDirectory,{recursive:true});
  for (const {filename,bytes} of downloads) await writeFile(new URL(filename,imageDirectory),bytes);
  await writeFile(dataFile,JSON.stringify(downloads.map(item=>item.article),null,2)+"\n");
  console.log("Updated three Medium articles and their original cover images.");
} catch (error) {
  const cached = JSON.parse(await readFile(dataFile,"utf8"));
  if (cached.length !== 3) throw error;
  for (const article of cached) await readFile(new URL(`public${article.cover}`,root));
  console.warn(`Medium refresh unavailable (${error.message}); using the saved articles and covers.`);
}
