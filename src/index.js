import './css/styles.css';

import { fetchCountries } from './fetchCountries';
var debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

let nameCountry = '';

const refs = {
  button: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.button.addEventListener(
  'input',
  debounce(onSearchCountry, DEBOUNCE_DELAY)
);

function onSearchCountry(e) {
  nameCountry = e.target.value.trim();

  if (!nameCountry) {
    clearMarkup();
    return;
  }

  fetchCountries(nameCountry)
    .then(countries => {
      if (countries.length > 10) {
        clearMarkup();
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }

      if (countries.length >= 2 && countries.length <= 10) {
        return onCreateSearchCountries(countries);
      }

      if (countries.length === 1) {
        return onCreateSearchCountry(countries[0]);
      }
    })

    .catch(error => Notify.failure('Oops, there is no country with that name'));
}

function onCreateSearchCountries(countries) {
  clearMarkup();

  const markupCountries = countries
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `<li class = "list-item"><img width ="30" height = "30" src="${svg}" alt="${official}"><p class = "description">${official}</p></li>`
    )
    .join('');

  return refs.countryList.insertAdjacentHTML('beforeend', markupCountries);
}

function onCreateSearchCountry(country) {
  clearMarkup();

  const {
    name: { official },
    flags: { svg },
    capital,
    population,
    languages,
  } = country;

  const languageList = Object.values(languages);

  const markupCountry = `<h1 ">
  <img width = "30" height = "30" src = "${svg}">  
  <p>${official}</p>
  </h1>
  
  <p class = "country-info-parameters"><span class = "country-info-features">Capital:</span> ${capital}</p> 
  <p class = "country-info-parameters"><span class = "country-info-features">Capital:</span> ${population}</p> 
  <p class = "country-info-parameters"><span class = "country-info-features">Languages:</span> ${languageList}</p> `;

  return refs.countryInfo.insertAdjacentHTML('beforeend', markupCountry);
}

function clearMarkup() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
