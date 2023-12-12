import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar';
import { ImageGallery } from './ImageGallery';
import { fetchPhotosByQuery } from 'services/PixabayApi';
import { Button } from './Button';
import { InfinitySpin } from 'react-loader-spinner';
import { Modal } from './Modal';

const DEFAULT_PAGE_NUM = 1;

export const Gallery = () => {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [page, setPage] = useState(DEFAULT_PAGE_NUM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalHits, setTotalHits] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery) return;
      try {
        setLoading(true);
        setError(null);

        const { hits, totalHits } = await fetchPhotosByQuery({
          q: searchQuery,
          page,
        });

        setImages(prevState =>
          page === DEFAULT_PAGE_NUM ? hits : [...prevState, ...hits]
        );
        setTotalHits(totalHits);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery, page]);

  const handleSetSearchQuery = text => {
    setSearchQuery(text);
    setImages([]);
    setPage(DEFAULT_PAGE_NUM);
  };

  const handleLoadMore = () => {
    setPage(prevState => prevState + 1);
  };

  const handleClickImage = image => {
    setCurrentImage(image);
    setIsOpenModal(true);
  };

  const handleToggleModal = () => {
    setIsOpenModal(prevState => !prevState);
  };

  const totalImagesLoaded = images.length;
  return (
    <div>
      <Searchbar handleSetSearchQuery={handleSetSearchQuery} />
      {loading && !totalImagesLoaded && (
        <div
          style={{
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <InfinitySpin
            visible={true}
            height="180"
            width="180"
            ariaLabel="comment-loading"
            wrapperStyle={{}}
            wrapperClass="comment-wrapper"
          />
        </div>
      )}
      {error && <h2 className="Error-Message">{error}</h2>}

      <ImageGallery images={images} onClickImage={handleClickImage} />

      {totalImagesLoaded && totalImagesLoaded < totalHits ? (
        <Button loading={loading} handleLoadMore={handleLoadMore} />
      ) : null}
      {isOpenModal ? (
        <Modal image={currentImage} closeModal={handleToggleModal} />
      ) : null}
    </div>
  );
};
