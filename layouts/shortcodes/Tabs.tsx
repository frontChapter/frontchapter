"use client";

import { ReactNode, useEffect, useRef } from "react";

interface TabsProps {
  children: ReactNode;
}

function Tabs({ children }: TabsProps) {
  //select tabItems
  const tabItemsRef = useRef<HTMLUListElement>(null);

  //change tab item on click
  const handleChangTab = (event: React.MouseEvent<HTMLLIElement>, index: number) => {
    const parentElement = event.currentTarget.parentElement;
    const tabLinks = parentElement ? [...parentElement.children] : [];
    const items = tabItemsRef.current ? [...tabItemsRef.current.children] : [];
    const activeItem = items.find((item) => !item.classList.contains("hidden"));
    const activeTabLink = tabLinks.find((item) =>
      item.classList.contains("active-tab")
    );
    if (activeItem === items[index]) return;
    if (activeTabLink) activeTabLink.classList.remove("active-tab");
    event.currentTarget.classList.add("active-tab");
    activeItem?.classList.add("hidden");
    items[index].classList.remove("hidden");
  };

  //show first tab-item
  useEffect(() => {
    if (tabItemsRef.current) {
      let allItems = [...((tabItemsRef.current as HTMLElement).children || [])];
      allItems[0].classList.remove("hidden");
    }
  }, []);

  return (
    <div className="relative">
      <ul className="mb-0 flex list-none items-center space-x-4 ps-0">
        {Array.isArray(children) && children.map((item, index) => (
          <li
            key={index}
            className={`m-0 cursor-pointer rounded-xl px-8 py-3 font-semibold text-dark ${
              index === 0 && "active-tab"
            }`}
            onClick={(e) => handleChangTab(e, index)}
          >
            {item.props.name}
          </li>
        ))}
      </ul>
      <ul
        className="mb-0 mt-1 list-none rounded-xl bg-theme-light p-6"
        ref={tabItemsRef}
      >
        {children}
      </ul>
    </div>
  );
}

export default Tabs;
