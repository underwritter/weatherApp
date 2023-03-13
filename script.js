const apiKey = `ae57f872e3d6debba838d4ba5c8f560a`;
const root = document.getElementById("root");
const textInput = document.getElementById("text-input");
const form = document.getElementById("form");
const close = document.getElementById("close");

let store = {
  city: "Gurzuf",
  observationTime: "00:00 AM",
  temperature: 0,
  isDay: "yes",
  properties: {
    cloudcover: {},
    humidity: {},
    windSpeed: {},
    uvIndex: {},
    pressure: {},
    visibility: {},
  },
};

const fetchData = async () => {
  const query = localStorage.getItem("query") || store.city;
  const result = await fetch(
    `http://api.weatherstack.com/current?access_key=${apiKey}&query=${query}`
  );
  const data = await result.json();

  const {
    current: {
      cloudcover,
      humidity,
      observation_time: observationTime,
      pressure,
      temperature,
      uv_index: uvIndex,
      wind_speed: windSpeed,
      is_day: isDay,
      weather_descriptions: descriptions,
      visibility,
    },
    location: {name},
  } = data;

  store = {
    ...store,
    city: name,
    observationTime,
    temperature,
    isDay,
    descriptions: descriptions[0],
    properties: {
      cloudcover: {
        title: "облачность",
        value: `${cloudcover}%`,
        icon: "cloud.png",
      },

      humidity: {
        title: "влажность",
        value: `${humidity}%`,
        icon: "humidity.png",
      },
      windSpeed: {
        title: "порывы ветра до",
        value: `${windSpeed}м/с`,
        icon: "wind.png",
      },
      uvIndex: {
        title: "УФ индекс",
        value: `${uvIndex}`,
        icon: "uv-index.png",
      },
      pressure: {
        title: "давление",
        value: `${Math.round(pressure / 1.333)}мм рт.ст`,
        icon: "press.png",
      },

      visibility: {
        title: "видимость",
        value: `${visibility}км`,
        icon: "visibility.png",
      },
    },
  };

  renderComponent();
};

const getImage = (descriptions) => {
  const value = descriptions.toLowerCase();

  switch (value) {
    case "overcast":
      return "overcast.png";
    case "cloud":
      return "cloud.png";
    case "partly cloudy":
      return "partlyCloud.png";
    case "sunny":
      return "sunny.png";
    case "heavy snow shower":
      return "HeavySnow.png";
    case "light snow shower":
      return "HeavySnow.png";
    case "light snow shower, heavy snow shower":
      return "HeavySnow.png";
    case "clear":
      return "clear.png";
    default:
      return "the.png";
  }
};

const renderProperty = (properties) => {
  return Object.values(properties)
    .map(({title, value, icon}) => {
      return `<div class="property">
            <div class="property-icon">
              <img src="./img/icons/${icon}" alt="">
            </div>
            <div class="property-info">
              <div class="property-info__value">${value}</div>
              <div class="property-info__description">${title}</div>
            </div>
          </div>`;
    })
    .join("");
};

const murkup = () => {
  const {
    city,
    descriptions,
    observationTime,
    temperature,
    isDay,
    properties,
  } = store;

  const containerClass = isDay === "yes" ? "is-day" : "";

  return `<div class="container ${containerClass}">
    <div class="top">
        <div class="city">
            <div class="city-subtitle">Погода сегодня в</div>
            <div class="city-title" id="city">
                <span>${city ?? ""}</span>
            </div>
        </div>
        <div class="city-info">
            <div class="top-left">
                <img class="icon" src="./img/${getImage(descriptions)}" alt="">
                <div class="description">${descriptions ?? ""}</div>
            </div>

            <div class="top-right">
                <div class="city-info__subtitle">на ${
                  observationTime ?? ""
                }</div>
                <div class="city-info__title">${temperature ?? ""}°</div>
            </div>
        </div>
    </div>
    <div id="properties">${renderProperty(properties)}</div>
</div>`;
};

const togglePopupClass = () => {
  const popup = document.getElementById("popup");
  popup.classList.toggle("active");
};
const closePopup = () => {
  togglePopupClass();
};

close.addEventListener("click", closePopup);

const renderComponent = () => {
  root.innerHTML = murkup();

  const city = document.getElementById("city");
  city.addEventListener("click", togglePopupClass);
};

const handleInput = (e) => {
  store = {
    ...store,
    city: e.target.value,
  };
};

const handleSubmit = (e) => {
  e.preventDefault();
  const value = store.city;
  if (!store.city) return null;
  localStorage.setItem("query", value);
  fetchData();
  togglePopupClass();

  console.log(store.city);
};

form.addEventListener("submit", handleSubmit);
textInput.addEventListener("input", handleInput);

fetchData();
