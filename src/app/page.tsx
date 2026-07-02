import { getListPage } from '@lib/contentParser';
import { buildHomeJsonLd } from '@lib/seo/jsonLd';
import { homeMetadata } from '@lib/seo/metadata';
import Cta from '../layouts/components/Cta';
import GSAPWrapper from '../layouts/components/GSAPWrapper';
import ContinuedStory from '../layouts/partials/ContinuedStory';
import ExecutiveTeam from '../layouts/partials/ExecutiveTeam';
import HomeBanner from '../layouts/partials/HomeBanner';
import JsonLd from '../layouts/partials/JsonLd';
import StorySection from '../layouts/partials/StorySection';
import YearFourStats from '../layouts/partials/YearFourStats';
import YearOneStats from '../layouts/partials/YearOneStats';
import YearThreeStats from '../layouts/partials/YearThreeStats';
import YearTwoStats from '../layouts/partials/YearTwoStats';

export const metadata = homeMetadata;

const Home = async () => {
  const homepage = await getListPage('src/content/_index.md');
  const { frontmatter } = homepage;
  const {
    banner,
    sponsors,
    storySection,
    yearOne,
    yearTwo,
    yearThree,
    yearFour,
    continuedStory,
    executiveTeam,
  } = frontmatter;

  const mapSpeakers = (speakers?: { list?: { name: string }[] }) =>
    speakers?.list?.map((speaker) => speaker.name) ?? [];

  const jsonLd = buildHomeJsonLd([
    {
      name: yearOne.conference.title,
      description: yearOne.conference.description,
      year: yearOne.year,
      startDate: yearOne.conference.startDate,
      endDate: yearOne.conference.endDate,
      locationName: yearOne.conference.locationName,
      performers: mapSpeakers(yearOne.speakers),
    },
    {
      name: yearThree.conference.title,
      description: yearThree.conference.description,
      year: yearThree.year,
      startDate: yearThree.conference.startDate,
      endDate: yearThree.conference.endDate,
      locationName: yearThree.conference.locationName,
      performers: mapSpeakers(yearThree.speakers),
    },
    {
      name: yearFour.conference?.title ?? 'همایش فرانت‌چپتر',
      description: yearFour.conference?.description,
      year: yearFour.year,
      startDate: yearFour.conference.startDate,
      endDate: yearFour.conference.endDate,
      locationName: yearFour.conference.locationName,
      performers: mapSpeakers(yearFour.speakers),
    },
    {
      name: yearThree.festival.title,
      description: yearThree.festival.description,
      year: yearThree.year,
      startDate: yearThree.festival.startDate,
      endDate: yearThree.festival.endDate,
      locationName: yearThree.festival.locationName,
      eventAttendanceMode: yearThree.festival.eventAttendanceMode,
      offersUrl: yearThree.festival.link.href,
    },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <GSAPWrapper>
        <main id="main-content">
          <HomeBanner banner={banner} sponsors={sponsors} />
          <StorySection {...storySection} />
          <YearOneStats
            title={yearOne.title}
            year={yearOne.year}
            stats={yearOne.stats}
            gatherings={yearOne.gatherings}
            conference={yearOne.conference}
            images={yearOne.images}
            video={yearOne.video}
            galleryTitle={yearOne.galleryTitle}
            speakers={yearOne.speakers}
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
            speakers={yearThree.speakers}
            magazine={yearThree.magazine}
            festival={yearThree.festival}
          />
          <YearFourStats
            title={yearFour.title}
            year={yearFour.year}
            stats={yearFour.stats}
            birthday={yearFour.birthday}
            conference={yearFour.conference}
            speakers={yearFour.speakers}
            events={yearFour.events}
            communityCollaboration={yearFour.communityCollaboration}
          />
          <ExecutiveTeam
            title={executiveTeam.title}
            list={executiveTeam.list}
          />
          <ContinuedStory
            subtitle={continuedStory.subtitle}
            title={continuedStory.title}
            description={continuedStory.description}
          />
          <Cta />
        </main>
      </GSAPWrapper>
    </>
  );
};

export default Home;
