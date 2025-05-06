export const parseMetaTags = (htmlString: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const getMeta = (selector: string, attr = "content") =>
    doc.querySelector(selector)?.getAttribute(attr) || "";

  return {
    title: doc.querySelector("title")?.textContent || "",
    canonical: getMeta('link[rel="canonical"]', "href"),
    og_title: getMeta('meta[property="og:title"]'),
    og_description: getMeta('meta[property="og:description"]'),
    og_url: getMeta('meta[property="og:url"]'),
    og_locale: getMeta('meta[property="og:locale"]'),
    og_type: getMeta('meta[property="og:type"]'),
    og_site_name: getMeta('meta[property="og:site_name"]'),
    twitter_card: getMeta('meta[name="twitter:card"]'),
  };
};
