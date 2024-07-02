import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const apiKey = '44685335-fea0dcf7b7c0436df223e42aa';

export async function fetchImages(searchTerm) {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
    searchTerm
  )}&image_type=photo&orientation=horizontal&safesearch=true&order=popular&per_page=15`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.hits;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw new Error('Failed to fetch images from Pixabay');
  }
}
