import config from '@config/config.json';
import { markdownify } from '@lib/utils/textConverter';
import {
  CarrotBackground,
  CarrotBadge,
  CarrotButton,
} from './carrot';
import ImageFallback from './ImageFallback';

function Cta() {
  const { title, content, button, enable } = config.call_to_action;
  if (!enable) return;

  return (
    <section className="cta section pt-0">
      <div className="container-xl">
        <div className="section relative px-4">
          <div className="bg-theme animated-bg absolute top-0 left-0 h-full w-full after:hidden md:h-auto">
            <ImageFallback
              src="/images/wave.svg"
              fill={true}
              sizes="100vw"
              alt=""
              aria-hidden="true"
              fallback={''}
            />
          </div>
          <CarrotBackground className="animate relative z-10 mx-auto max-w-3xl px-6 py-12 text-center md:px-10 md:py-14">
            <CarrotBadge accent className="mb-5">
              جامعه فرانت‌چپتر
            </CarrotBadge>
            {markdownify({
              content: title,
              tag: 'h2',
              className: 'section-title',
            })}
            {markdownify({
              content: content,
              tag: 'p',
              className: 'mx-auto mt-6 max-w-lg',
            })}
            <CarrotButton
              href={button.link}
              variant="community"
              className="mt-8"
            >
              {button.label}
            </CarrotButton>
          </CarrotBackground>
        </div>
      </div>
    </section>
  );
}

export default Cta;
