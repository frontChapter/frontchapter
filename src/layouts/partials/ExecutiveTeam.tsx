'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect, useRef } from 'react';
import TeamShowcase, { TeamMember } from '../components/TeamShowcase';

export interface ExecutiveTeamProps {
  title: string;
  list: TeamMember[];
}

const ExecutiveTeam: React.FC<ExecutiveTeamProps> = ({ title, list }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      const teamCards = teamRef.current?.querySelectorAll('.team-card');
      if (teamCards && teamCards.length) {
        gsap.fromTo(
          teamCards,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.5,
            scrollTrigger: {
              trigger: teamRef.current,
              start: 'top bottom',
            },
          }
        );
      }
    }
  }, []);

  if (!list.length) return null;

  return (
    <section
      ref={sectionRef}
      className="w-full flex flex-col items-center justify-center py-10 md:py-16 px-4 md:px-6"
    >
      <div className="w-full max-w-5xl bg-white/50 rounded-2xl backdrop-blur-sm shadow-sm px-6 md:px-10 py-8 md:py-12">
        <TeamShowcase
          title={title}
          members={list}
          containerRef={teamRef}
          titleIcon="✯"
          centered
        />
      </div>
    </section>
  );
};

export default ExecutiveTeam;
