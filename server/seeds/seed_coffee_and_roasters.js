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
    regions: "Colombia",
    type: "Filter",
    roaster: "Phil & Sebastian",
  },
  {
    name: "Hartmanns' Maragogype",
    regions: "Panama",
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
    regions: "Costa Rica",
    roaster: "Detour Coffee Roasters",
  },
  {
    name: "Smart Ass",
    regions: "Africa, Central America, South America",
    roaster: "Kicking Horse",
  },
  {
    name: "Hola",
    regions: "Central America, South America",
    roaster: "Kicking Horse",
  },
  {
    name: "Cachoeira MicroLot",
    regions: "Brazil",
    origin: "Cachoeira Farm",
    roaster: "Detour Coffee Roasters",
  },
];

exports.seed = async function(knex, Promise) {
  // wipe out coffees table
  await knex("coffees").del();
  // wipe out the roasters table
  await knex("roasters").del();
  const roasters = Array.from(new Set(my_coffees.map(c => c.roaster)));

  const roasterMap = {};
  for (let roasterName of roasters) {
    const r = await knex("roasters").insert({ name: roasterName }, "id");
    roasterMap[roasterName] = r[0];
  }

  const insertCoffee = my_coffees.map(coffee => {
    const {
      roaster,
      name,
      region,
      roast,
      type,
      description,
      ...metadata
    } = coffee;

    return knex("coffees").insert({
      name,
      description,
      roast_style: roast,
      roast_type: type,
      regions: region ? JSON.stringify(region.split(", ")) : null,
      metadata,
      roaster_id: roasterMap[roaster],
    });
  });

  return Promise.all(insertCoffee);
};
