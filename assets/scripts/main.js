class App {
  constructor({ input, store, Alpine }) {
    const options = {
      // componentRestrictions: { country: "us" },
      // fields: ["address_components", "geometry", "icon", "name"],
      // strictBounds: false,
      // types: ["establishment"],
    };
    this.autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById(input)
    );
    this.places = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    this.store = store;

    const handleChange = () => {
      const place = this.autocomplete.getPlace();
      // console.log({ place });
      this.store.setPlace(place);
    }

    this.autocomplete.addListener('place_changed', handleChange)

  }
}



document.addEventListener('alpine:init', () => {
  Alpine.store('global', {
    place: null,
    setPlace(place) {
      this.place = place;
    },
    imageSrc() {
      if (this.place) {
        return place.photos[0].getUrl();
      }
      return '/assets/images/Image_Clubhouse.jpg';
    },
  })
  const app = window.app = new App({
    Alpine,
    store: Alpine.store('global'),
    input: 'search'
  });
});


function parsePlace(place = {}) {
  var byType = (place.address_components || []).reduce(function (acc, data) {
    data.types.forEach(function (type) {
      acc[type] = data;
    });
    return acc;
  }, {});

  var result = {
    name: getName(place),
    address_1: `${placeGet('street_number')} ${placeGet('route')}`,
    city:
      placeGet('locality') ||
      placeGet('sublocality') ||
      placeGet('sublocality_level_1') ||
      placeGet('neighborhood') ||
      placeGet('administrative_area_level_3') ||
      placeGet('administrative_area_level_2'),
    state: placeGet('administrative_area_level_1', true),
    country: placeGet('country', true),
    postal_code: placeGet('postal_code'),
    latitude: place.geometry ? place.geometry.location.lat() : undefined,
    longitude: place.geometry ? place.geometry.location.lng() : undefined,
    google_place_id: place.id || place.place_id
  };

  return result;

  function getName(place) {
    return place.types.includes('establishment') ? place.name : null;
  }

  function placeGet(key, short) {
    if (!(key in byType)) return '';

    return short ? byType[key].short_name : byType[key].long_name;
  }
}




// (function myFunction() {



// }())
