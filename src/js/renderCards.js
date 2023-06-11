import { makeCard } from '../js/makeCardMarkup';

export function renderCards(data) {
  return data.map(item => makeCard(item)).join('');
}
