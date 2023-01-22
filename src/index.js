import {fetchCountries} from './js/fetchCountries'
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box')
const countryBoxEl = document.querySelector('.country-info')
const countriesListEl = document.querySelector('.country-list')

inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY))

function onInputChange() {
    const name = inputEl.value.trim()
    if (name === '') {
        return (countryBoxEl.innerHTML = '', countriesListEl.innerHTML = '')
    }
    fetchCountries(name)
    .then(countries => {
        countriesListEl.innerHTML = ''
        countryBoxEl.innerHTML = ''
        if (countries.length === 1) {
            // countriesListEl.innerHTML = showCountriesList(countries)
            countryBoxEl.innerHTML = createMarkup(countries)
        } else if (countries.length > 10) {
            showWarningInfo()
        } else {
            countriesListEl.innerHTML = showCountriesList(countries)
        }
    }).catch(showError)
}

function createMarkup(arr) {
    const infoMarkup = arr.map(({name, capital, population, flags, languages}) => {
        return `
        <img class="country-info__img" src="${flags.svg}" alt="" width="45">
        <h2 class="country-info__name">${name.official}</h2>
        <p class="country-info__capital"><span>Capital: </span>${capital}</p>
        <p class="country-info__population"><span>Population:</span> ${population} people</p>
        <p class="country-info__languages"><span>Languages:</span> ${Object.values(languages).join(', ')}</p>`
    }).join('')

    return infoMarkup
}

function showCountriesList(list) {
    const listMarkup = list.map(({flags, name}) => {
        return `
        <li class="country-list__item">
        <img class="country-list__img" src="${flags.svg}" alt="" width="30">
        <p class="country-list__name">${name.official}</p>
        </li>`
    }).join('')

    return listMarkup
}

function showError() {
  Notiflix.Notify.failure('Oops, there is no country with that name')
}

function showWarningInfo() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
}