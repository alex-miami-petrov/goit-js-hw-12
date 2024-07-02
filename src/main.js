import iziToast from 'izitoast';
import axios from 'axios';
import { renderImages } from './js/render-functions.js';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const loader = document.getElementById('loader');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('load-more');

let searchTerm = '';
let currentPage = 1;
let totalHits = 0;
let cardHeight = 0;

searchForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  searchTerm = searchInput.value.trim();

  if (searchTerm === '') {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search term',
      position: 'topRight',
    });
    return;
  }

  currentPage = 1;
  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';

  await fetchImagesAndUpdateDOM();
});

loadMoreBtn.addEventListener('click', async function () {
  currentPage += 1;
  loadMoreBtn.style.display = 'none';
  await fetchImagesAndUpdateDOM();
});

async function fetchImagesAndUpdateDOM() {
  try {
    loader.style.display = 'block';
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '44685335-fea0dcf7b7c0436df223e42aa',
        q: searchTerm,
        image_type: 'photo',
        page: currentPage,
        per_page: 15,
      },
    });

    const { hits, totalHits: newTotalHits } = response.data;
    totalHits = newTotalHits;

    if (cardHeight === 0) {
      const firstCard = gallery.querySelector('.gallery-item');
      if (firstCard) {
        cardHeight = firstCard.getBoundingClientRect().height;
      }
    }

    renderImages(hits);

    if (hits.length > 0) {
      loadMoreBtn.style.display = 'block';
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    } else {
      showErrorMessage();
    }

    if (totalHits <= currentPage * 15) {
      loadMoreBtn.style.display = 'none';
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    console.error('Error searching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to search images. Please try again later.',
      position: 'topRight',
    });
  } finally {
    loader.style.display = 'none';
    searchInput.value = '';
  }
}

function showErrorMessage() {
  iziToast.error({
    title: 'Error',
    message:
      'Sorry, there are no images matching your search query. Please try again!',
    position: 'topRight',
  });
}
