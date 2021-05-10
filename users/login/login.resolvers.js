import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client.js";

export default {
    Mutation: {
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