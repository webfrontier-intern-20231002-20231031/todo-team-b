import { NextRequest} from 'next/server';
import jwt from 'jsonwebtoken';

export async function auth_jwt(req: NextRequest){
    const token = req.cookies.get("auth-token")
    if(typeof token === "undefined"){
        console.log("token : 未定義")
        return false
    }
    try{
        const secretKey = String(process.env.SECRET_KEY);
        const decoded = jwt.verify(token.value, secretKey);
        console.log(decoded);
        return true;
    }catch(err){
        console.log("トークンの検証に失敗しました: ", err);
        return false;
    }
}