import React from 'react';
import NotFound from '../../layouts/404';
import About from '../../layouts/About';
import GSAPWrapper from '../../layouts/components/GSAPWrapper';
import Contact from '../../layouts/Contact';
import Default from '../../layouts/Default';
import JsonLd from '../../layouts/partials/JsonLd';
import { buildAboutJsonLd } from '../../lib/seo/jsonLd';
import { buildPageMetadata } from '../../lib/seo/metadata';
import {
  getRegularPage,
  getSinglePage,
  RegularPageData,
  SinglePageData,
} from '../../lib/contentParser';
import type { Metadata } from 'next';

type RegularPagesProps = {
  params: {
    regular: string;
  };
};

export async function generateMetadata({
  params,
}: RegularPagesProps): Promise<Metadata> {
  const pageData: RegularPageData = await getRegularPage(params.regular);
  const {
    title,
    meta_title,
    description,
    image,
    noindex,
    canonical,
    keywords,
  } = pageData.frontmatter;

  return buildPageMetadata({
    title,
    meta_title,
    description: description ?? pageData.content.slice(0, 120),
    image,
    noindex,
    canonical: canonical ?? `/${params.regular}/`,
    keywords: Array.isArray(keywords) ? keywords : undefined,
  });
}

const collectSameAs = (social?: Record<string, string | undefined>) =>
  social
    ? Object.values(social).filter(
        (url): url is string => typeof url === 'string' && url.startsWith('http')
      )
    : [];

const RegularPages = async ({
  params,
}: RegularPagesProps): Promise<React.JSX.Element> => {
  const { regular } = params;
  const pageData: RegularPageData = await getRegularPage(regular);
  const { layout } = pageData.frontmatter;

  // Type guards for About, Contact, Default
  // Local Frontmatter types for each layout
  // Type checks for required frontmatter fields
  const fm = pageData.frontmatter as any;
  const isAbout =
    typeof fm.title === 'string' &&
    fm.about_us &&
    fm.works &&
    fm.mission &&
    fm.video &&
    fm.clients &&
    fm.core_team &&
    fm.executive_team &&
    fm.our_office;
  const isContact = typeof fm.title === 'string' && layout === 'contact';
  const isDefault =
    typeof fm.title === 'string' && typeof pageData.content === 'string';

  const aboutJsonLd =
    layout === 'about' && isAbout
      ? buildAboutJsonLd({
          title: fm.meta_title || fm.title,
          description:
            fm.description ||
            fm.about_us?.content ||
            pageData.content.slice(0, 160),
          image: fm.image || fm.about_us?.image,
          people: [
            ...(fm.core_team?.list ?? []).map(
              (member: {
                name: string;
                role: string;
                image?: string;
                social?: Record<string, string | undefined>;
              }) => ({
                name: member.name,
                role: member.role,
                image: member.image,
                sameAs: collectSameAs(member.social),
              })
            ),
            ...(fm.executive_team?.list ?? []).map(
              (member: {
                name: string;
                role: string;
                image?: string;
                linkedin?: string;
                instagram?: string;
                youtube?: string;
              }) => ({
                name: member.name,
                role: member.role,
                image: member.image,
                sameAs: collectSameAs({
                  linkedin: member.linkedin,
                  instagram: member.instagram,
                  youtube: member.youtube,
                }),
              })
            ),
          ],
        })
      : null;

  return (
    <GSAPWrapper>
      {aboutJsonLd ? <JsonLd data={aboutJsonLd} /> : null}
      {layout === '404' ? (
        <NotFound data={pageData} />
      ) : layout === 'about' && isAbout ? (
        <About data={pageData as unknown as { frontmatter: any }} />
      ) : isContact ? (
        <Contact data={pageData as unknown as { frontmatter: any }} />
      ) : isDefault ? (
        <Default
          data={pageData as unknown as { frontmatter: any; content: string }}
        />
      ) : (
        <NotFound data={pageData} />
      )}
    </GSAPWrapper>
  );
};

export default RegularPages;

export async function generateStaticParams(): Promise<{ regular: string }[]> {
  const slugs: SinglePageData[] = getSinglePage('src/content');
  return slugs.map((item) => ({
    regular: item.slug,
  }));
}
