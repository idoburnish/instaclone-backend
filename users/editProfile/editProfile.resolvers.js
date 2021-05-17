import bcrypt from "bcrypt";
import client from "../../client.js";
import { protectedResolver } from "../users.utils.js";

const resolverFn = async (
    _, 
    { firstName, lastName, userName, email, password:newPassword },
    {loggedInUser}
) => {
    let uglyPassword = null;
    if (newPassword) {
        uglyPassword = await bcrypt.hash(newPassword, 10);
    }
    const updatedUser =  await client.user.update({
        where: {
            id: loggedInUser.id,
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
};

export default {
    Mutation: {
        editProfile: protectedResolver(resolverFn),
    },
};