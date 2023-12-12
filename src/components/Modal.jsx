import { useEffect } from 'react';

export const Modal = ({ closeModal, image }) => {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    const handleKeyDownEvent = e => {
      handleKeyDown(e);
    };

    document.addEventListener('keydown', handleKeyDownEvent);

    return () => {
      document.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, [closeModal]);

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  let { largeImageURL, tags } = image;
  return (
    <>
      <div className="Overlay" onClick={handleBackdropClick}>
        <div className="Modal">
          <img src={largeImageURL} alt={tags} />
        </div>
      </div>
    </>
  );
};
