import iziToast from 'izitoast';
import axios from 'axios';
import { renderImages } from './js/render-functions.js';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const loader = document.getElementById('loader');
const gallery = document.getElementById('gallery');

searchForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  gallery.innerHTML = '';

  const searchTerm = searchInput.value.trim();

  if (searchTerm === '') {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search term',
      position: 'topRight',
    });
    return;
  }

  try {
    loader.style.display = 'block';
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '44685335-fea0dcf7b7c0436df223e42aa',
        q: searchTerm,
        image_type: 'photo',
      },
    });

    const images = response.data.hits;
    renderImages(images);
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
});
