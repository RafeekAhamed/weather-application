import countries from 'i18n-iso-countries'
import englishLocale from 'i18n-iso-countries/langs/en.json'

countries.registerLocale(englishLocale)

export interface Country {
  code: string
  name: string
  flag: string
}

function getCountryFlag(code: string): string {
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split('')
      .map((character) => 127397 + character.charCodeAt(0)),
  )
}

export const countryList: Country[] = Object.entries(
  countries.getNames('en'),
)
  .map(([code, name]) => ({
    code,
    name,
    flag: getCountryFlag(code),
  }))
  .sort((first, second) => first.name.localeCompare(second.name))
