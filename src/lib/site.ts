export const SITE_URL = "https://www.epsprojects.in";
export const SITE_NAME = "EPS Projects Pvt. Ltd.";
export const SITE_LOGO =
  "https://customer-assets.emergentagent.com/job_engineeringsps/artifacts/vuj1ba3q_edit1%20epsp%20%281%29.png";

export type PageHeadOptions = {
  title?: string;
  description?: string;
  path?: string;
};

export const buildPageHead = ({ title, description, path = "" }: PageHeadOptions) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonical = `${SITE_URL}${path}`;
  const meta: Array<Record<string, string>> = [
    { title: fullTitle },
    { property: "og:title", content: fullTitle },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:url", content: canonical },
  ];
  if (description) {
    meta.push({ name: "description", content: description });
    meta.push({ property: "og:description", content: description });
  }
  return {
    meta,
    links: [{ rel: "canonical", href: canonical }],
  };
};
