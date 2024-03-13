import {Request,Response,NextFunction} from 'express';

export function isLoggedIn(req:Request,res:Response,next:NextFunction){
    if(req.session['user']){
        next();
        return;
    }else{
        console.log("You are not allowed to go to protected pages  ")
        res.redirect('/');
    }
}