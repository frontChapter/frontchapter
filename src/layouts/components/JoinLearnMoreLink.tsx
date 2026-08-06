import { JOIN_LEARN_MORE_HREF } from '@lib/membership/join-presets';
import Link from 'next/link';

type Props = {
  className?: string;
};

const JoinLearnMoreLink = ({ className }: Props) => (
  <p className={className ?? 'text-center text-sm text-muted'}>
    هنوز مطمئن نیستی؟{' '}
    <Link
      href={JOIN_LEARN_MORE_HREF}
      className="carrot-text-link inline-flex items-center gap-1 font-medium text-primary"
    >
      درباره جامعه فرانت‌چپتر بیشتر بدانید
      <span aria-hidden>↗</span>
    </Link>
  </p>
);

export default JoinLearnMoreLink;
