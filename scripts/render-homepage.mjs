import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { runInNewContext } from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const template = await readFile(resolve(root, "scripts/george-seamless.template.html"), "utf8");
const mockup = await readFile(resolve(root, "public/george-mockup.html"), "utf8");
const script = template.match(/<script>\s*(\(async\(\)=>\{[\s\S]*?)<\/script>\s*<\/body>/)?.[1];
if (!script) throw new Error("Homepage template script not found");

let rendered = "";
const document = {
  open() {},
  write(html) { rendered = html; },
  close() {},
  body: { innerHTML: "" },
};
await runInNewContext(script, {
  fetch: async () => ({ text: async () => mockup }),
  document,
});
if (!rendered.includes("<h1>New Zealand Radiata Pine.") || !rendered.includes("<footer>")) {
  throw new Error("Homepage did not render expected content");
}

// Keep the page metadata in the generated HTML so it is available before JavaScript runs.
rendered = rendered.replace(
  /<script>if \(location\.pathname === '\/george-mockup\.html'\) location\.replace\('\/george-seamless\.html'\)<\/script>/,
  "",
);
rendered = rendered.replace(
  "</head>",
  '<link rel="preload" as="image" href="/images/fpx-hero-timber-yard.webp" fetchpriority="high">\n' +
  '<link rel="preload" as="image" href="/images/LaptopPhone2.webp">\n</head>',
);
rendered = rendered.replace(
  '<div class="footer-sub"><div><span>SAW POINT</span><b>Monthly NZ timber updates.</b></div>',
  '<div class="footer-sub" data-nosnippet><div><span>SAW POINT</span> <b>Monthly NZ timber updates.</b></div>',
);
rendered = rendered.replace('<div class="footer-bottom">', '<div class="footer-bottom" data-nosnippet>');
if ((rendered.match(/<meta name="description"/g) ?? []).length !== 1) {
  throw new Error("Homepage must contain exactly one meta description");
}
await writeFile(resolve(root, "public/george-seamless.html"), rendered);
