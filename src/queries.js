import gql from "graphql-tag";

export const BREW_FRAGMENT = gql`
  fragment Brew on Brew {
    id
    created_at
    updated_at
    coffee {
      id
    }
    rating
    flavours
    method
    notes
    metadata
  }
`;

// TODO sort brews on server side with a GraphQL argument
export const GET_BREWS_FOR_COFFEE = gql`
  query BrewsForCoffee($id: ID!) {
    brews(coffee: $id) {
      ...Brew
    }
  }
  ${BREW_FRAGMENT}
`;

export const GET_BREW = gql`
  query Brew($id: ID!) {
    brews(id: $id) {
      ...Brew
    }
  }
  ${BREW_FRAGMENT}
`;

export const CREATE_ROASTER = gql`
  mutation CreateRoaster(
    $name: String!
    $location: String
    $description: String
    $metadata: JSON
  ) {
    createRoaster(
      name: $name
      location: $location
      metadata: $metadata
      description: $description
    ) {
      id
      name
      description
      location
      metadata
      created_at
      updated_at
    }
  }
`;

export const CREATE_COFFEE = gql`
  mutation CreateCoffee(
    $name: String!
    $roasterID: ID!
    $description: String
    $roast_type: String
    $roast_style: String
    $regions: [String]
    $metadata: JSON
  ) {
    createCoffee(
      name: $name
      roaster_id: $roasterID
      description: $description
      roast_type: $roast_type
      roast_style: $roast_style
      regions: $regions
      metadata: $metadata
    ) {
      id
      name
      created_at
      updated_at
      roaster {
        id
        name
      }
      description
      roast_type
      roast_style
      regions
      metadata
    }
  }
`;
