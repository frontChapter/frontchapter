import { markdownify } from '@lib/utils/textConverter';
import React from 'react';
import ImageFallback from '../components/ImageFallback';

interface SpecialitySection {
  image: string;
  subtitle: string;
  title: string;
  description: string;
}

interface SpecialFeaturesProps {
  speciality: {
    primary: SpecialitySection;
    secondary: SpecialitySection;
  };
}

const SpecialFeatures: React.FC<SpecialFeaturesProps> = ({ speciality }) => {
  return (
    <section className="section">
      <div className="container">
        <div className="row items-center justify-center">
          <div className="animate lg:col-6 lg:order-2">
            <ImageFallback
              className="mx-auto"
              src={speciality.primary.image}
              width={575}
              height={511}
              alt="primary speciality"
              fallback="/images/fallback.png"
            />
          </div>
          <div className="animate lg:col-5 lg:order-1">
            <p>{speciality.primary.subtitle}</p>
            {markdownify({
              content: speciality.primary.title,
              tag: 'h2',
              className: 'mt-4 section-title bar-left',
            })}
            {markdownify({
              content: speciality.primary.description,
              tag: 'p',
              className: 'mt-10',
            })}
          </div>
        </div>
        <div className="row items-center">
          <div className="animate lg:col-6">
            <ImageFallback
              className="mx-auto"
              src={speciality.secondary.image}
              width={575}
              height={511}
              alt="secondary speciality"
              fallback="/images/fallback.png"
            />
          </div>
          <div className="animate lg:col-5">
            <p>{speciality.secondary.subtitle}</p>
            {markdownify({
              content: speciality.secondary.title,
              tag: 'h2',
              className: 'mt-4 section-title bar-left',
            })}
            {markdownify({
              content: speciality.secondary.description,
              tag: 'p',
              className: 'mt-10',
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialFeatures;
