import { getListPage } from '@lib/contentParser';
import Cta from '../layouts/components/Cta';
import GSAPWrapper from '../layouts/components/GSAPWrapper';
import Features from '../layouts/partials/Features';
import HomeBanner from '../layouts/partials/HomeBanner';
import SeoMeta from '../layouts/partials/SeoMeta';
import ShortIntro from '../layouts/partials/ShortIntro';
import SpecialFeatures from '../layouts/partials/SpecialFeatures';
import StorySection from '../layouts/partials/StorySection';
import Testimonial from '../layouts/partials/Testimonial';
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
    features,
    intro,
    speciality,
    testimonial,
    storySection,
    yearTwo,
    yearThree,
    yearFour,
  } = frontmatter;
  return (
    <GSAPWrapper>
      <SeoMeta title="خانه" />
      <HomeBanner banner={banner} brands={brands} />
      <Features features={features} />
      <ShortIntro intro={intro} />
      <StorySection {...storySection} />
      <SpecialFeatures speciality={speciality} />
      <Testimonial testimonial={testimonial} />
      <YearOneStats
        title={frontmatter.yearOne.title}
        year={frontmatter.yearOne.year}
        stats={frontmatter.yearOne.stats}
        gatherings={frontmatter.yearOne.gatherings}
        conference={frontmatter.yearOne.conference}
        images={frontmatter.yearOne.images}
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
        events={yearFour.events}
      />
      <Cta />
    </GSAPWrapper>
  );
};

export default Home;
