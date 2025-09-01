import { getListPage } from '@lib/contentParser';
import Cta from '../layouts/components/Cta';
import GSAPWrapper from '../layouts/components/GSAPWrapper';
import ContinuedStory from '../layouts/partials/ContinuedStory';
import HomeBanner from '../layouts/partials/HomeBanner';
import SeoMeta from '../layouts/partials/SeoMeta';
import StorySection from '../layouts/partials/StorySection';
import YearFourStats from '../layouts/partials/YearFourStats';
import YearOneStats from '../layouts/partials/YearOneStats';
import YearThreeStats from '../layouts/partials/YearThreeStats';
import YearTwoStats from '../layouts/partials/YearTwoStats';

const Home = async () => {
  const homepage = await getListPage('src/content/_index.md');
  const { frontmatter } = homepage;
  const {
    banner,
    brands,
    storySection,
    yearTwo,
    yearThree,
    yearFour,
    continuedStory,
  } = frontmatter;
  return (
    <GSAPWrapper>
      <SeoMeta title="فرانت‌چپتر | جامعه توسعه‌دهندگان فرانت‌اند ایران" />
      <HomeBanner banner={banner} brands={brands} />
      <StorySection {...storySection} />
      <YearOneStats
        title={frontmatter.yearOne.title}
        year={frontmatter.yearOne.year}
        stats={frontmatter.yearOne.stats}
        gatherings={frontmatter.yearOne.gatherings}
        conference={frontmatter.yearOne.conference}
        images={frontmatter.yearOne.images}
        video={frontmatter.yearOne.video}
        galleryTitle={frontmatter.yearOne.galleryTitle}
      />
      <YearTwoStats
        title={yearTwo.title}
        year={yearTwo.year}
        stats={yearTwo.stats}
        memories={yearTwo.memories}
        images={yearTwo.images}
      />
      <YearThreeStats
        title={yearThree.title}
        year={yearThree.year}
        stats={yearThree.stats}
        conference={yearThree.conference}
        magazine={yearThree.magazine}
        festival={yearThree.festival}
      />
      <YearFourStats
        title={yearFour.title}
        year={yearFour.year}
        stats={yearFour.stats}
        birthday={yearFour.birthday}
        conference={yearFour.conference}
        events={yearFour.events}
        communityCollaboration={yearFour.communityCollaboration}
      />
      <ContinuedStory
        subtitle={continuedStory.subtitle}
        title={continuedStory.title}
        description={continuedStory.description}
      />
      <Cta />
    </GSAPWrapper>
  );
};

export default Home;
