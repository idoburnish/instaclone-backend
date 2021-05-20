import client from "../../client.js";

export default {
    Query: {
        seeProfile: (_, {userName}) => 
            client.user.findUnique({
                where: {
                    userName,
                },
                include: {
                    followers: true,
                    following: true
                }
        })
    },
}