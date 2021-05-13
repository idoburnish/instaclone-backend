import jwt from "jsonwebtoken";
import client from "../client.js";

export const getUser = async(token) => {
    try {
        // 토큰이 없는 경우
        if (!token){
            return null;
        }
        const { id } = await jwt.verify(token, process.env.SECRET_KEY);
        const user = await client.user.findUnique({where:{id}});
        if (user) {
            return user;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

export const protectResolver = (user) => {
    if (!user){
        return {
            ok: false,
            error: "You need to login",
        };
    }
};