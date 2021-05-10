import client from "../client.js"

export default {
    Mutation: {
        createAccount: async (
            _, 
            {firstName, lastName, userName, email, password} // data from user
        ) => {
            // 1) check if userName of email are already on DB.
            const existingUser = await client.user.findFirst({
                where: {
                    OR: [
                        {
                            userName: userName,
                        },
                        {
                            email,
                        },
                    ]
                }
            })
            console.log(existingUser);
            // 2) if not, hash password
            
            // 3) then save and return the user
        },
    },
};