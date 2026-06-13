import type { AdFormat } from "./config";

/**
 * Paste each provider snippet in the matching entry.
 *
 * Optional tokens:
 * - {{PLACEMENT}} becomes the logical placement name.
 * - {{SLOT_ID}} becomes a page-unique DOM id.
 *
 * Keep unused formats empty. Only the selected snippet is mounted and its
 * scripts are executed.
 */
const AD_SNIPPETS: Record<AdFormat, string> = {
  "320x50": `<script>
  atOptions = {
    'key' : 'ebf9a0644f9d4569b6814e266d0238af',
    'format' : 'iframe',
    'height' : 50,
    'width' : 320,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/ebf9a0644f9d4569b6814e266d0238af/invoke.js"></script>
`,
  "468x60": `<script>
  atOptions = {
    'key' : '11ae5069fbbdf02e69eaf448d658cf1a',
    'format' : 'iframe',
    'height' : 60,
    'width' : 468,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/11ae5069fbbdf02e69eaf448d658cf1a/invoke.js"></script>
`,
  "728x90": `<script>
  atOptions = {
    'key' : 'f2ca46a5df33ae788f238425fd8d414f',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/f2ca46a5df33ae788f238425fd8d414f/invoke.js"></script>
`,
  "300x250": `<script>
  atOptions = {
    'key' : '8f626910ab5d7bceca83bee9c11c4e9d',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/8f626910ab5d7bceca83bee9c11c4e9d/invoke.js"></script>
`,
  "160x300": `<script>
  atOptions = {
    'key' : 'cf4597deb896e441e0e22d8f3bd737ba',
    'format' : 'iframe',
    'height' : 300,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/cf4597deb896e441e0e22d8f3bd737ba/invoke.js"></script>
`,
  "160x600": `<script>
  atOptions = {
    'key' : '0791a92c3ce1a86982c8ba7982928d11',
    'format' : 'iframe',
    'height' : 600,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/0791a92c3ce1a86982c8ba7982928d11/invoke.js"></script>
`,
};

export function getConfiguredAdFormats(): AdFormat[] {
  return (Object.keys(AD_SNIPPETS) as AdFormat[]).filter(
    (format) => AD_SNIPPETS[format].trim().length > 0,
  );
}

export function hasConfiguredAds(): boolean {
  return getConfiguredAdFormats().length > 0;
}

function prepareSnippet(
  snippet: string,
  placement: string,
  slotId: string,
): DocumentFragment {
  const template = document.createElement("template");
  template.innerHTML = snippet
    .replaceAll("{{PLACEMENT}}", placement)
    .replaceAll("{{SLOT_ID}}", slotId);

  template.content.querySelectorAll("script").forEach((sourceScript) => {
    const executableScript = document.createElement("script");

    Array.from(sourceScript.attributes).forEach((attribute) => {
      executableScript.setAttribute(attribute.name, attribute.value);
    });

    executableScript.textContent = sourceScript.textContent;
    sourceScript.replaceWith(executableScript);
  });

  return template.content;
}

export function mountProviderAd(
  container: HTMLElement,
  format: AdFormat,
  placement: string,
  slotId: string,
): boolean {
  const snippet = AD_SNIPPETS[format].trim();

  if (!snippet) {
    return false;
  }

  container.replaceChildren(prepareSnippet(snippet, placement, slotId));
  return true;
}
