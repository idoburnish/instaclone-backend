import bcrypt from "bcrypt";
import { buildClientSchema } from "graphql";
import client from "../../client.js";

export default {
    Mutation: {
        editProfile: async (_, { firstName, lastName, userName, email, password:newPassword }) => {
            let uglyPassword = null;
            if (newPassword) {
                uglyPassword = await bcrypt.hash(newPassword, 10);
            }
            const updatedUser =  await client.user.update({
                where: {
                    id: 1
                }, 
                data:{
                    firstName, 
                    lastName, 
                    userName, 
                    email, 
                    ...(uglyPassword && { password: uglyPassword }),
                }
            });
            if (updatedUser.id) {
                return {
                    ok: true
                };
            } else {
                return {
                    ok: false,
                    error: "Could not update profile."
                };
            }
        }
    },
};