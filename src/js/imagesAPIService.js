const axios = require('axios').default; // node

export class ImagesAPIService {
  static #FETCH_URL = 'https://pixabay.com/api/';
  static #API_KEY = '36145663-8013b2e066e1601ccab665a97';
  itemsPerPage = 40;

  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.receivedItemsCount = 0;
    this.cardsCount = 0;
  }

  #makeURL() {
    return `${ImagesAPIService.#FETCH_URL}?key=${ImagesAPIService.#API_KEY}&q=${
      this.searchQuery
    }&image_type=photo&orientation=horizontal&safesearch=true&per_page=${
      this.itemsPerPage
    }&page=${this.page}`;
  }

  async fetch() {
    const fetchResponce = await axios.get(this.#makeURL());
    const { data } = fetchResponce;

    if (data.hits.length === 0) {
      throw new Error();
    }
    this.incrementPage();
    this.cardsCount += data.hits.length;

    return data;
  }

  async fetchOnSubmit() {
    this.resetPage();
    try {
      const data = await this.fetch();
      this.receivedItemsCount = data.totalHits;
      this.cardsCount = 0;

      return data;
    } catch (e) {
      throw new Error();
    }
  }

  async loadMore() {
    try {
      if (Math.ceil(this.receivedItemsCount / 40) < this.page) {
        throw new Error();
      }

      const data = await this.fetch();

      return data;
    } catch (e) {
      throw new Error();
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    if (newQuery.includes(' ')) {
      this.searchQuery = newQuery.replaceAll(' ', '+');
    } else {
      this.searchQuery = newQuery;
    }
  }
}
