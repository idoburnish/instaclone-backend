import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../client.js";

export default {
    Mutation: {
        createAccount: async (_,  {firstName, lastName, userName, email, password}) => 
        { 
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
                    throw new Error("This userName/email is already taken.");
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

        login: async (_, {userName, password}) => {
            // find user with args.userName
            const user = await client.user.findFirst({where:{userName}})
            if (!user) {
                return{
                    ok: false,
                    error: "User not found"
                };
            }

            // if userName exist, check password with args.password
            const passwordOK = await bcrypt.compare(password, user.password)
            if (!passwordOK) {
                return {
                    ok: false,
                    error: "Incorrect password"
                };
            }

            // if correct password, issue a token amd send it to the user
            const token = await jwt.sign({id:user.id}, process.env.SECRET_KEY);   
            return {
                ok: true,
                token,
            };
        },
    },
};