import NotFound from "../../layouts/404";
import About from "../../layouts/About";
import GSAPWrapper from "../../layouts/components/GSAPWrapper";
import Contact from "../../layouts/Contact";
import Default from "../../layouts/Default";
import SeoMeta from "../../layouts/partials/SeoMeta";
import { getRegularPage, getSinglePage, RegularPageData, SinglePageData } from "../../lib/contentParser";



type RegularPagesProps = {
  params: {
    regular: string;
  };
};

const RegularPages = async ({ params }: RegularPagesProps): Promise<React.JSX.Element> => {
  const { regular } = params;
  const pageData: RegularPageData = await getRegularPage(regular);
  const { title, meta_title, description, image, noindex, canonical, layout } = pageData.frontmatter;
  const { content } = pageData;

  // Type guards for About, Contact, Default
  // Local Frontmatter types for each layout
  // Type checks for required frontmatter fields
  const fm = pageData.frontmatter as any;
  const isAbout =
    typeof fm.title === "string" &&
    fm.about_us && fm.works && fm.mission && fm.video && fm.clients && fm.our_member && fm.our_office;
  const isContact = typeof fm.title === "string" && layout === "contact";
  const isDefault = typeof fm.title === "string" && typeof pageData.content === "string";

  return (
    <GSAPWrapper>
      <SeoMeta
        title={title}
        description={description ? description : content.slice(0, 120)}
        meta_title={meta_title}
        image={image}
        noindex={noindex}
        canonical={canonical}
      />

      {layout === "404" ? (
        <NotFound data={pageData} />
      ) : layout === "about" && isAbout ? (
        <About data={pageData as unknown as { frontmatter: any }} />
      ) : isContact ? (
        <Contact data={pageData as unknown as { frontmatter: any }} />
      ) : isDefault ? (
        <Default data={pageData as unknown as { frontmatter: any; content: string }} />
      ) : (
        <NotFound data={pageData} />
      )}
    </GSAPWrapper>
  );
};

export default RegularPages;



export async function generateStaticParams(): Promise<{ regular: string }[]> {
  const slugs: SinglePageData[] = getSinglePage("content");
  return slugs.map((item) => ({
    regular: item.slug,
  }));
}
