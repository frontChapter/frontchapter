// SSR doesn't work with ES Modules so we need to import the UMD files instead
import { gsap } from 'gsap/dist/gsap';
import ScrollTriggerAlias, { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// configure/register once we're running in the browser
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// export anything that you might need a reference to
export { gsap } from 'gsap/dist/gsap';
export { ScrollTriggerAlias as ScrollTrigger };
