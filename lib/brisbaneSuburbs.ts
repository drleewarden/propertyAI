// Brisbane suburbs with approximate geographic boundaries
// Using rough polygon coordinates for major Brisbane suburbs

export const brisbaneSuburbsGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Brisbane City",
        suburb: "Brisbane",
        avgPrice: 750000,
        properties: 245,
        medianRent: 450,
        growthRate: 4.2,
        postcode: 4000,
        description: "Brisbane's vibrant CBD featuring modern apartments, CBD offices, and prime riverfront locations.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [153.0102, -27.4679],
            [153.0289, -27.4679],
            [153.0289, -27.4598],
            [153.0102, -27.4598],
            [153.0102, -27.4679],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "South Bank",
        suburb: "South Bank",
        avgPrice: 850000,
        properties: 312,
        medianRent: 520,
        growthRate: 5.1,
        postcode: 4101,
        description: "Cultural precinct with gardens, museums, and riverside living. Popular with families and professionals.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [153.0102, -27.4798],
            [153.0289, -27.4798],
            [153.0289, -27.4679],
            [153.0102, -27.4679],
            [153.0102, -27.4798],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Fortitude Valley",
        suburb: "Fortitude Valley",
        avgPrice: 1250000,
        properties: 198,
        medianRent: 620,
        growthRate: 6.3,
        postcode: 4006,
        description: "Inner-city entertainment district with trendy restaurants, bars, and premium residential apartments.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [153.0289, -27.4598],
            [153.0476, -27.4598],
            [153.0476, -27.4479],
            [153.0289, -27.4479],
            [153.0289, -27.4598],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Spring Hill",
        suburb: "Spring Hill",
        avgPrice: 920000,
        properties: 267,
        medianRent: 480,
        growthRate: 4.8,
        postcode: 4004,
        description: "Established residential area with character homes and close proximity to city and transport.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [153.0289, -27.4479],
            [153.0476, -27.4479],
            [153.0476, -27.4360],
            [153.0289, -27.4360],
            [153.0289, -27.4479],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Newstead",
        suburb: "Newstead",
        avgPrice: 1050000,
        properties: 223,
        medianRent: 540,
        growthRate: 5.5,
        postcode: 4006,
        description: "Trendy riverside suburb with converted warehouses, boutique shops, and vibrant community.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [153.0476, -27.4598],
            [153.0663, -27.4598],
            [153.0663, -27.4479],
            [153.0476, -27.4479],
            [153.0476, -27.4598],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Kangaroo Point",
        suburb: "Kangaroo Point",
        avgPrice: 1150000,
        properties: 189,
        medianRent: 580,
        growthRate: 5.9,
        postcode: 4169,
        description: "Cliff-top suburb with spectacular city views, outdoor recreation, and premium residential options.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [153.0289, -27.4917],
            [153.0476, -27.4917],
            [153.0476, -27.4798],
            [153.0289, -27.4798],
            [153.0289, -27.4917],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "West End",
        suburb: "West End",
        avgPrice: 1000000,
        properties: 278,
        medianRent: 500,
        growthRate: 4.5,
        postcode: 4101,
        description: "Inner-west suburb with bohemian vibe, eclectic mix of restaurants, cafes, and creative community.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [152.9915, -27.4798],
            [153.0102, -27.4798],
            [153.0102, -27.4679],
            [152.9915, -27.4679],
            [152.9915, -27.4798],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Paddington",
        suburb: "Paddington",
        avgPrice: 880000,
        properties: 234,
        medianRent: 460,
        growthRate: 3.9,
        postcode: 4064,
        description: "Charming hilly suburb with heritage homes, quiet streets, and easy access to city amenities.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [152.9915, -27.4679],
            [153.0102, -27.4679],
            [153.0102, -27.4560],
            [152.9915, -27.4560],
            [152.9915, -27.4679],
          ],
        ],
      },
    },
  ],
};

export const getSuburbColor = (avgPrice: number): string => {
  if (avgPrice >= 1200000) return "#1D7874"; // Darkest - highest price
  if (avgPrice >= 1000000) return "#2B9E8F";
  if (avgPrice >= 850000) return "#4DAEA5";
  if (avgPrice >= 700000) return "#7FBDB5";
  return "#B8D6D0"; // Lightest - lowest price
};
