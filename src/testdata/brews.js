// Dummy brew data for Coffee Profile screen.

const brews = [
  {
    date: { label: "Date Brewed", value: "2018-03-05" },
    rating: { label: "Your Rating", value: 4 },
    method: { label: "Brew Method", value: "Chemex" },
    notes: { label: "Notes", value: "Favorite brew so far." },
    coarseness: { label: "Grind Coarseness", value: 3 },
    coffee_weight: { label: "Amount of Coffee (g)", value: 17 },
    water_weight: { label: "Amount of Coffee (g)", value: 300 },
  },
  {
    date: { label: "Date Brewed", value: "2018-02-05" },
    rating: { label: "Your Rating", value: 3 },
    method: { label: "Brew Method", value: "Pourover" },
    notes: {
      label: "Notes",
      value: "Used a stainless steel cone. Not as good.",
    },
    coarseness: { label: "Grind Coarseness", value: 2 },
    coffee_weight: { label: "Amount of Coffee (g)", value: 15 },
    water_weight: { label: "Amount of Coffee (g)", value: 300 },
  },
  {
    date: { label: "Date Brewed", value: "2018-01-05" },
    rating: { label: "Your Rating", value: 2 },
    method: { label: "Brew Method", value: "French Press" },
    notes: { label: "Notes", value: "Pretty awful." },
    coarseness: { label: "Grind Coarseness", value: 7 },
    coffee_weight: { label: "Amount of Coffee (g)", value: 30 },
    water_weight: { label: "Amount of Coffee (g)", value: 550 },
  },
];

export default brews;
