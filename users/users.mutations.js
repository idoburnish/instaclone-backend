import bcrypt from "bcrypt";
import client from "../client.js";

export default {
    Mutation: {
        createAccount: async (
            _,  
            {firstName, lastName, userName, email, password} // data from user
        ) => { 
            try {
                // check if userName of email are already on DB.
                const existingUser = await client.user.findFirst({
                    where: {
                        OR: [
                            { 
                                userName, 
                            },
                            { 
                                email, 
                            },
                        ],
                    },
                });
                if (existingUser) {
                    throw new Error("This username/email is already taken.");
                }
                // if not, hash password
                const uglyPassword = await bcrypt.hash(password, 10);
                // then save and return the user
                return client.user.create({
                    data: {
                        userName, 
                        email, 
                        firstName, 
                        lastName,
                        password: uglyPassword
                }});
            } catch (e) {
                return e; 
            }
        },
    },
};