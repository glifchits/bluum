const my_coffees = [
  {
    roaster: "Phil & Sebastian",
    name: "Gaharo Hill",
    region: "Burundi",
    roast: "Light",
    type: "Filter",
    description:
      "This is our second year offering Gaharo Hill from Burundi and it continues to be a privilege to work with the Long Miles team. Despite the civil unrest present there, Burundi’s specialty coffee sector is developing, and the quality of coffees produced there are truly world class. This quality potential, coupled with an opportunity to affect change in one of the world’s poorest countries is what attracted Ben and Kristy Carlson, the founders of Long Miles Coffee Project. Ben reports that he spent two years tasting coffee from 187 washing stations in Burundi before honing in on the Gaharo Hill area to begin their Coffee Project.",
    origin: "Bukeye Commune, Muramvya Province",
    elevation: "1801m",
  },
  {
    roaster: "Phil & Sebastian",
    name: "Alfonso Mateus",
    region: "Columbia",
    roast: "Light",
    type: "Filter",
  },
  {
    roaster: "Phil & Sebastian",
    name: "Gatuyaini",
    region: "Kenya",
    roast: "Light",
    type: "Filter",
  },
  {
    name: "Guarnizo Bros.",
    region: "Colombia",
    type: "Filter",
    roaster: "Phil & Sebastian",
  },
  {
    name: "Hartmanns' Maragogype",
    region: "Panama",
    type: "Filter",
    roaster: "Phil & Sebastian",
  },
  {
    roaster: "La Cabra",
    name: "Pinheirnho",
    region: "Brazil",
    roast: "Light",
    type: "Filter",
  },
  {
    roaster: "Smile Tiger",
    name: "Nightmare Hippy Girl",
    region: "Nicaragua",
    roast: "Medium/Dark",
    type: "Filter",
  },
  {
    name: "Detour Dark",
    type: "Filter",
    roast: "Dark",
    region: "Guatemala, Brazil",
    roaster: "Detour Coffee Roasters",
  },
  {
    name: "Santa Teresa",
    type: "Espresso",
    region: "Costa Rica",
    roaster: "Detour Coffee Roasters",
  },
  {
    name: "Smart Ass",
    region: "Africa, Central America, South America",
    roaster: "Kicking Horse",
  },
  {
    name: "Hola",
    region: "Central America, South America",
    roaster: "Kicking Horse",
  },
  {
    name: "Cachoeira MicroLot",
    region: "Brazil",
    origin: "Cachoeira Farm",
    roaster: "Detour Coffee Roasters",
  },
];

function choose(arr, nullProbability = 0) {
  if (Math.random() < nullProbability) {
    return null;
  }
  const idx = Math.floor(arr.length * Math.random());
  return arr[idx];
}

function generateBrew(coffeeID) {
  const rating = choose([1, 2, 3, 4, 5], 0.1);

  // notes probability
  let notes = null;
  if (Math.random() > 0.8) {
    if (rating >= 4) {
      // prettier-ignore
      notes = choose([
        "One of my favourites", "Good brew, very sweet",
        "Delicate and tealike", "Crazy peanut butter notes",
      ]);
    } else if (rating === 3) {
      notes = choose([
        "Tried out the new stainless steel cone, good but too much sediment",
        "Okay, not very strong though",
        "Decent flavour",
      ]);
    } else if (rating === 2) {
      notes = choose(["Getting a lot of bitter flavours", "Weak AF"]);
    } else if (rating === 1) {
      notes = choose(["Truly awful", "Jim brewed this one"]);
    }
  }

  // flavours
  // prettier-ignore
  const flavourOptions = [
    "Apricot", "Stonefruit", "Honey", "Cola", "Tea",
    "Bitter", "Sour", "Sweet", "Strawberry", "Cranberry", "Butterscotch",
    "Chocolate", "Jam", "Peanut Butter", "Caramel", "Vanilla",
    "Roasted Almond", "Tropical Fruit", "Eucalyptus", "Melon", "Peach",
  ];
  let flavours = null;
  if (Math.random() > 0.5) {
    flavours = [choose(flavourOptions)];
    const numMoreFlavours = Math.floor(Math.random() * 3);
    for (let x = 0; x < numMoreFlavours; x++) {
      const flavour = choose(flavourOptions);
      if (!flavours.includes(flavour)) {
        flavours.push(flavour);
      }
    }
  }

  const metadata = {};
  if (Math.random() > 0.7) {
    metadata["Grind Coarseness"] = choose("3456789".split(""));
  }
  if (Math.random() > 0.8) {
    const ratio = 16 + Math.random() * 7;
    const coffee = 20 + Math.floor(Math.random() * 30);
    metadata["Coffee Weight (g)"] = coffee;
    metadata["Water Weight (g)"] = Math.round(coffee * ratio);
  }

  return {
    coffee_id: coffeeID,
    rating,
    method: choose(["French Press", "Chemex", "Pourover", "Drip"], 0.5),
    notes,
    flavours: flavours ? JSON.stringify(flavours) : null,
    metadata:
      metadata && Object.keys(metadata).length
        ? JSON.stringify(metadata)
        : null,
  };
}

exports.seed = async function(knex, Promise) {
  // wipe out coffees table
  await knex("coffees").del();
  // wipe out the roasters table
  await knex("roasters").del();
  // wipe out brews table
  await knex("brews").del();

  // start off with creating roasters
  const roasters = Array.from(new Set(my_coffees.map(c => c.roaster)));

  const roasterMap = {};
  for (let roasterName of roasters) {
    const r = await knex("roasters").insert({ name: roasterName }, "id");
    roasterMap[roasterName] = r[0];
  }

  // create coffees
  const coffeesToInsert = my_coffees.map(coffee => {
    const {
      roaster,
      name,
      region,
      roast,
      type,
      description,
      ...metadata
    } = coffee;

    return {
      name,
      description,
      roast_style: roast,
      roast_type: type,
      regions: region ? JSON.stringify(region.split(", ")) : null,
      metadata,
      roaster_id: roasterMap[roaster],
    };
  });

  const coffees = await knex.insert(coffeesToInsert, "id").into("coffees");

  // create brews
  const brews = [];
  for (let i = 0; i < 100; i++) {
    brews.push(generateBrew(choose(coffees)));
  }
  return knex("brews").insert(brews);
};
