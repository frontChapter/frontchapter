import JoinCommunityGallery from './JoinCommunityGallery';
import JoinLearnMoreLink from './JoinLearnMoreLink';

const JoinOnboardingSidebar = () => (
  <aside className="join-layout__aside" aria-label="تصاویر و معرفی جامعه">
    <JoinCommunityGallery />
    <JoinLearnMoreLink className="mt-5 text-sm text-muted" />
  </aside>
);

export default JoinOnboardingSidebar;
