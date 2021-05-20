import { gql } from "apollo-server-core";

export default gql`
    type UnFollowUserResult {
        ok: Boolean!
        error: String
    }
    type Mutation {
        unfollowUser(userName: String!): UnFollowUserResult
    }
`;