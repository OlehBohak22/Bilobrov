import { useEffect, useState } from "react";
import axios from "axios";
import { parseMetaTags } from "../utils/parseMetaTags";

export const usePageData = (pathname: string | null) => {
  const [html, setHtml] = useState<string | null>(null);
  const [, setLoading] = useState<boolean>(false);
  const [, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(pathname, {
          responseType: "text",
        });
        setHtml(response.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pathname]);

  const parsedMeta = html
    ? parseMetaTags(html)
    : {
        title: "",
        canonical: "",
        og_title: "",
        og_description: "",
        og_url: "",
        og_locale: "",
        og_type: "",
        og_site_name: "",
        twitter_card: "",
      };

  return parsedMeta;
};
