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
