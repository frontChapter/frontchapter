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
      <Cta />
    </GSAPWrapper>
  );
};

export default Home;
