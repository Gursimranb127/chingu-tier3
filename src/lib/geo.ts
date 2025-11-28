// @ts-expect-error library has no types package
import geo from 'countries-cities-geo';

interface CountryCoords {
  lat: number;
  lng: number;
}

interface GeoCountry {
  cca2: string;
  latlng?: [number, number];
}

export function getCountryCoords(
  countryCode: string | null
): CountryCoords | null {
  const countries = geo.getCountries();

  const country = countries.find(
    (c: GeoCountry) => c.cca2.toUpperCase() === countryCode?.toUpperCase()
  );

  if (!country || !country.latlng) {
    return null;
  }

  const [lat, lng] = country.latlng;

  return { lat, lng };
}
