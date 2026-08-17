import { mountShell } from '../bootstrap';
import { initUrlTool, urlToolTemplate } from '../components/urlTool';
import {
  benefitsTemplate,
  ctaTemplate,
  faqTemplate,
  howItWorksTemplate,
  initFaq,
  initPlatforms,
  platformsTemplate,
  sobreTemplate,
  trustTemplate,
} from '../components/sections';
import { adContentTemplate, adTopTemplate } from '../components/adSlot';

export function renderHome(): void {
  const { app } = mountShell(`
    <div id="tool-mount">${urlToolTemplate()}</div>

    ${adTopTemplate()}

    ${platformsTemplate()}

    ${howItWorksTemplate()}

    ${benefitsTemplate()}

    ${trustTemplate()}

    ${sobreTemplate()}

    ${faqTemplate()}

    ${adContentTemplate()}

    ${ctaTemplate()}
  `);

  const toolMount = app.querySelector<HTMLElement>('#tool-mount');
  if (toolMount) {
    initUrlTool(toolMount);
  }

  initPlatforms(app);
  initFaq(app);
}