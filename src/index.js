import './css/styles.css';
import { refs } from './js/refs';
import { ImagesAPIService } from './js/imagesAPIService';
import { renderCards } from './js/renderCards';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { autoScrollToNewPage } from './js/autoScrollToNewPage';
import { Spinner } from './js/spinner';

refs.form.addEventListener('submit', handleSubmit);

const imagesAPIService = new ImagesAPIService();
var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
});

function handleSubmit(e) {
  e.preventDefault();

  const { searchQuery } = e.target;

  if (searchQuery.value === '') {
    imagesAPIService.resetPage();
    Notify.failure('Input field is empty!');
    return;
  }

  const searchItem = searchQuery.value.trim();

  imagesAPIService.query = searchItem;

  imagesAPIService
    .fetchOnSubmit()
    .then(data => {
      refs.galleryBlock.innerHTML = '';
      spinner.show();
      setTimeout(() => {
        spinner.hide();
        refs.galleryBlock.insertAdjacentHTML(
          'beforeend',
          renderCards(data.hits)
        );
        lightbox.refresh();
        Notify.success(`Hooray! We found ${data.totalHits} images.`);

        applyObserve();
      }, 1500);
    })
    .catch(() => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
  e.target.reset();
}

const infiniteObserver = new IntersectionObserver(([entry], observer) => {
  if (entry.isIntersecting) {
    observer.unobserve(entry.target);

    imagesAPIService
      .loadMore()
      .then(data => {
        if (
          imagesAPIService.cardsCount === imagesAPIService.receivedItemsCount
        ) {
          throw new Error();
        }
        spinner.show();
        setTimeout(() => {
          spinner.hide();
          refs.galleryBlock.insertAdjacentHTML(
            'beforeend',
            renderCards(data.hits)
          );
          autoScrollToNewPage();
          lightbox.refresh();

          applyObserve();
        }, 1500);
      })
      .catch(() => {
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      });
  }
});

function applyObserve() {
  const lastCard = document.querySelector('li:last-child .photo-card');

  if (lastCard) {
    infiniteObserver.observe(lastCard);
  }
}

const spinner = new Spinner('.lds-ellipsis');
