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
      document.createElement("div")
    );

    this.store = store;

    const handleChange = () => {
      const place = parsePlace(this.autocomplete.getPlace());
      if (!place.formattedAddress) {
        window.alert('Please select an address');
        return;
      }
      this.store.setState({ place });
    };

    this.autocomplete.addListener("place_changed", handleChange);
  }
}

// sets place and returns image to card
document.addEventListener("alpine:init", () => {
  let position = window.localStorage.getItem('position');
  try {
    position = JSON.parse(position);
  } catch (error) {

  }

  Alpine.store("global", {
    state: {
      position,
      granted: !!position,
      place: defaultPlace
    },

    setState(state) {
      this.state = {
        ...this.state,
        ...state
      }
    },

    calculateDistance() {
      if (!this.state.position || !this.state.place) {
        return '';
      }

      const position = this.state.position;
      const place = this.state.place

      console.log({ position, place })

      var R = 3958.8; // Radius of the Earth in miles
      var rlat1 = position.latitude * (Math.PI/180); // Convert degrees to radians
      var rlat2 = place.latitude * (Math.PI/180); // Convert degrees to radians
      var difflat = rlat2-rlat1; // Radian difference (latitudes)
      var difflon = (place.longitude-position.longitude) * (Math.PI/180); // Radian difference (longitudes)

      var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));

      const miles = Math.round(d);

      return `${miles} miles away`
    },

    acceptPermissions() {
      const handleSuccess = (position) => {
        window.localStorage.setItem('position', JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        this.setState({
          granted: true,
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        });
      };

      const handleError = (error) => {
        if (error.code && error.code === 1) {
          // The user denied geolocation permission.
          window.alert('Kick Rocks. Your promised not to deny');
          return;
        }
        window.alert(error.message || 'There was an unexpected error')
      };

      this.locationWatcher = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError
      );
      // TODO: clear the watch
      // navigator.geolocation.clearWatch(this.locationWatcher);
    },

    denyPermissions() {
      window.alert('Kick Rocks')
    }
  });

  const globalStore = Alpine.store("global");

  if (position) {
    globalStore.acceptPermissions();
  }

  const app = new App({
    Alpine,
    store: globalStore,
    input: "search",
  });
});

const parsePlace = (place = {}) => {
  // User ternary for assignment
  const images = place.photos ? place.photos.map((photo) => {
    const copy = {
      ...photo,
      src: photo.getUrl()
    }
    return copy;
  }) : [];

  const image = images.length
    ? images[0]
    : { src: '/assets/images/Image_Clubhouse.jpg' }

  const latitude = place.geometry
    ? place.geometry.location.lat()
    : null;

  const longitude = place.geometry
    ? place.geometry.location.lng()
    : null;

  var result = {
    // shorthand property assignment
    images,
    image,
    latitude,
    longitude,
    name: place.name,
    formattedAddress: place.formatted_address,
    url: place.url
  };

  // console.log(JSON.stringify(result, null, 2));

  return result;
}



const defaultPlace = {
  "images": [
    {
      "height": 1365,
      "html_attributions": [
        "<a href=\"https://maps.google.com/maps/contrib/113924288249978074446\">TPC Scottsdale</a>"
      ],
      "width": 2048,
      "src": "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAcYSjRjb4nFMaLgGE1rDyFFf8rmcUr3myYQX__Li5pJyjq13TeEwZ8rSEBEuw698ZNVTSe_p2hSfk4h7_xzJh6yeXx2OHhNTPJeQYTNQN5Tjtqz_KUbsC5gVY05eSP44SAZUs5gdFkS97y06hG-M4mcexisO557kKN1t5i9JYwWnRlGOqXZb&3u2048&5m1&2e1&callback=none&key=AIzaSyApK7DLknqC8rExuFY8t0LqDQT-6HBGeMw&token=48077"
    },
    {
      "height": 3024,
      "html_attributions": [
        "<a href=\"https://maps.google.com/maps/contrib/112908537539621884546\">AK</a>"
      ],
      "width": 4032,
      "src": "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAcYSjRjIJiFbfmrxuytvMLPfQH-pCFr3VCHTAOwp6VafzXOR5XenYwHJUpKa8ZEuT38lOLHTDelB1jDD0_ON-f1E49LwJt8EqBiiD4o-bBde0dsqRkCEav3phTgXSay5QywOdzUrPvB0HNRjJQscUk3xsFzhju88g6hScs1v2bYlBbB9HPSX&3u4032&5m1&2e1&callback=none&key=AIzaSyApK7DLknqC8rExuFY8t0LqDQT-6HBGeMw&token=50288"
    },
    {
      "height": 3024,
      "html_attributions": [
        "<a href=\"https://maps.google.com/maps/contrib/100916527930954371297\">Patrick O&#39; Sullivan</a>"
      ],
      "width": 4032,
      "src": "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAcYSjRhyoun1jpBKc2wNRvwjM3nD1XwF96gP894Jzw2F4PuYqwC1nhcD1P93F0bgBEZrC3HBNFDjTtEJTLMqCi50hN9yMLBceMuSvCDeWZZ1qzP2dWxU6WcBFGYdXidINFYMOgSRrqYcef3B0fom9tish4aFnX-B37D-hoCrCLSMIZU_m5bo&3u4032&5m1&2e1&callback=none&key=AIzaSyApK7DLknqC8rExuFY8t0LqDQT-6HBGeMw&token=11138"
    },
    {
      "height": 1405,
      "html_attributions": [
        "<a href=\"https://maps.google.com/maps/contrib/104005497993895431415\">Mike Wolfe</a>"
      ],
      "width": 2500,
      "src": "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAcYSjRgs0XXOQJgF_XZYJ0UbrNI5NNCCAS5NkS1axcBO6jPj4xMXLs1UlGl18auvI-JVQ-qDSKqPm9y6IMTuiGO2j8tvahqp9u2G08nv7a4IMG0NTkmlnkftun2Puz4kV3Tk6v9z7Z3ZZJ_LtP7KnOQ19lrFuheqzEAdjRzScHzR7rHY4NYR&3u2500&5m1&2e1&callback=none&key=AIzaSyApK7DLknqC8rExuFY8t0LqDQT-6HBGeMw&token=80991"
    },
    {
      "height": 3000,
      "html_attributions": [
        "<a href=\"https://maps.google.com/maps/contrib/112834074643312806359\">David Jackson</a>"
      ],
      "width": 4000,
      "src": "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAcYSjRjrbVanyPT22NlXHO7lNHZbZZViPfkup6a0E38uT8po6JbxRb2Ua1E_cFyMi2KLEb7rVOBMJ5fuwR06dS_KrmaX2PIWJFsnH4N6wFPxZyXUCNqA2gfviVnB-jvTvUO6JskOzXXjJzEYsgdaYP39SrFgZpD4XQFBZy2QRek-a6TqypjR&3u4000&5m1&2e1&callback=none&key=AIzaSyApK7DLknqC8rExuFY8t0LqDQT-6HBGeMw&token=68918"
    },
    {
      "height": 4032,
      "html_attributions": [
        "<a href=\"https://maps.google.com/maps/contrib/107911591341840348727\">Claudio Gonzalez</a>"
      ],
      "width": 3024,
      "src": "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAcYSjRjmW51hJuALxS48OTH7Dk8FamlQp2jv8S22AmhbBcyfCUn3ENvaJtpuZbbbC04YW_WJjqUA8u4vk52GLSb9B1F4gZSfherUGaVF1F72QITsyYUAhG1DkBNqFuH_2Rum0dceHp7yfxoQEJPKEuvNdBXO8rHOU5C2Qg1gCqCeyXxX9F4f&3u3024&5m1&2e1&callback=none&key=AIzaSyApK7DLknqC8rExuFY8t0LqDQT-6HBGeMw&token=25526"
    },
    {
      "height": 2897,
      "html_attributions": [
        "<a href=\"https://maps.google.com/maps/contrib/111098595662107375283\">Michael Mills</a>"
      ],
      "width": 3684,
      "src": "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAcYSjRgwKxw2yO-5tSLmVOYpI_2j7mZiY1w5HZn97t_1Fii7HLAi6GIGbhN8zUFmwPdZIBfWs1iJRPo2v6V40gtapnHV0Ms11zcY_p5by2sXSzZyVcZjXSkJAi__AhwTE7R1-EZ5o_Wsp-fQPltC0KcRL-WSVgP-EAEYfi4dI7M1QyHrje5M&3u3684&5m1&2e1&callback=none&key=AIzaSyApK7DLknqC8rExuFY8t0LqDQT-6HBGeMw&token=55812"
    },
    {
      "height": 2268,
      "html_attributions": [
        "<a href=\"https://maps.google.com/maps/contrib/103630966675727119978\">Robert Biggs</a>"
      ],
      "width": 4032,
      "src": "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAcYSjRgBScGS-sXAEuj6ASmq5WAXvPFQS8wABNWroD-YdqM2U7vHJ8XNd00bOA5EC9uSvs9QAeq74y6B5FJOL1DXHD4GGM5fEIj5fgq3nS-peKou3SfkWNJMYb4H5Y-VnKZ8SJO5xj4kQLDG58L_erMBfHmmIG3gIXZ7wX7EFU__E0Y88H0z&3u4032&5m1&2e1&callback=none&key=AIzaSyApK7DLknqC8rExuFY8t0LqDQT-6HBGeMw&token=11653"
    },
    {
      "height": 3024,
      "html_attributions": [
        "<a href=\"https://maps.google.com/maps/contrib/116676676473717913917\">Michael Toll</a>"
      ],
      "width": 4032,
      "src": "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAcYSjRhnnHfS8d3DpCzzn40uMhHsi3Z9Idap28pZt7IXQyGZS3WhonJ97NJkL5v4FLWpO36K26UcRtmlCc3qk3qaIBiuWJDus0hB1UdOH78Ue-W_oo5RslkHw18t1pI9VmHB2H-3GTFO1OYX71Yc2_PESIMGOdgrcxHtxt_WBWCwCvjGlU-z&3u4032&5m1&2e1&callback=none&key=AIzaSyApK7DLknqC8rExuFY8t0LqDQT-6HBGeMw&token=130518"
    },
    {
      "height": 3024,
      "html_attributions": [
        "<a href=\"https://maps.google.com/maps/contrib/105795643470834430615\">Duane Barnard</a>"
      ],
      "width": 4032,
      "src": "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAcYSjRg8s3JM32I1yPWKjNuzmYmm8y8kRFxp0fBaTVl7nduF8GtX0pHY0p3Fgj9sDllY1rdiGAxoRyj52eRyZpcXvX33dipSkHBopILyHCBXn_gbSsKvvIdtmS-G178vv_Z7A96L6ckrcK3EVj-EH-ehe4n8HaZzmEPXThNollwSHOeZfhvh&3u4032&5m1&2e1&callback=none&key=AIzaSyApK7DLknqC8rExuFY8t0LqDQT-6HBGeMw&token=120287"
    }
  ],
  "image": {
    "height": 1365,
    "html_attributions": [
      "<a href=\"https://maps.google.com/maps/contrib/113924288249978074446\">TPC Scottsdale</a>"
    ],
    "width": 2048,
    "src": "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAcYSjRjb4nFMaLgGE1rDyFFf8rmcUr3myYQX__Li5pJyjq13TeEwZ8rSEBEuw698ZNVTSe_p2hSfk4h7_xzJh6yeXx2OHhNTPJeQYTNQN5Tjtqz_KUbsC5gVY05eSP44SAZUs5gdFkS97y06hG-M4mcexisO557kKN1t5i9JYwWnRlGOqXZb&3u2048&5m1&2e1&callback=none&key=AIzaSyApK7DLknqC8rExuFY8t0LqDQT-6HBGeMw&token=48077"
  },
  "latitude": 33.64057399999999,
  "longitude": -111.90888,
  "name": "TPC Scottsdale",
  "formattedAddress": "17020 N Hayden Rd, Scottsdale, AZ 85255, USA",
  "url": "https://maps.google.com/?cid=8723552099633411112"
}
