import cardMarkupTemplate from '../templates/photoCardTemplate.pug';

export function makeCard(data) {
  return cardMarkupTemplate(data);
}
