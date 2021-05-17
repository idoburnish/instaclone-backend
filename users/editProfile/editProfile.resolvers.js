import {createWriteStream} from "fs";
import bcrypt from "bcrypt";
import client from "../../client.js";
import { protectedResolver } from "../users.utils.js";

const resolverFn = async (
    _, 
    { firstName, lastName, userName, email, password:newPassword, bio, avatar },
    {loggedInUser}
) => {
    let avatarUrl = null;
    if (avatar) {
        const {filename, createReadStream} = await avatar;
        const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;    //랜덤한 파일 생성
        const readStream = createReadStream();
        const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFilename);
        readStream.pipe(writeStream);   // 사진저장
        avatarUrl = `http://localhost:4000/static/${newFilename}`;
    }
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
            bio,
            ...(uglyPassword && { password: uglyPassword }),
            ...(avatarUrl) && { avatar: avatarUrl },
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