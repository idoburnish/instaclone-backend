import client from "../../client"

export default {
    Query: {
        seeFollowers: async(_, {userName, page}) => {
            const aFollowers = await client.user
                .findUnique({where: {userName}})
                .followers();
            console.log(aFollowers);
        }
    }
}