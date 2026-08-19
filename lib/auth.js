import jwt from 'jsonwebtoken';
export function signAdmin(){return jwt.sign({role:'admin',phone:process.env.ADMIN_PHONE},process.env.JWT_SECRET,{expiresIn:'7d'})}
export function verify(token){try{return jwt.verify(token,process.env.JWT_SECRET)}catch{return null}}