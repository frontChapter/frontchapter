'use client';

interface GalleryClickOverlayProps {
  label: string;
  onClick: () => void;
}

const GalleryClickOverlay = ({ label, onClick }: GalleryClickOverlayProps) => (
  <button
    type="button"
    className="absolute inset-0 z-40 m-0 cursor-pointer border-0 bg-transparent p-0"
    aria-label={`مشاهده تصویر: ${label}`}
    onClick={onClick}
  />
);

export default GalleryClickOverlay;
