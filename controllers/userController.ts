import { UserService } from "../services/userService";
import { Request, Response } from "express";
import { hashPassword, checkPassword } from "../utils/hash";
// import { v4 as uuidv4 } from 'uuid';
import fetch from "node-fetch";

export class UserController {
  constructor(private readonly userService: UserService) {}

  loginGoogle = async (req: Request, res: Response) => {
    const accessToken = req.session?.["grant"].response.access_token;
    console.log("呢個係google controller access", accessToken);
    const fetchRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await fetchRes.json();
    console.log(result.email);

    const feedBackResult = await this.userService.loginGoogle(result.email, "male");
    console.log(feedBackResult);
    if (req.session) {
      req.session["user"] = { id: feedBackResult["id"] };
    }
    console.log(" req.session[]", req.session["user"])
    res.status(200).redirect("/html/Home.html");

    // res.status(200).json({ message: "success" });
  };

  signUpNewUser = async (req: Request, res: Response) => {
    try {
      const { username, password, gender } = req.body;

      const hashResult = await hashPassword({ password }.password);

      const result = await this.userService.signUpRequest(username, hashResult, gender);

      if (result == "false") {
        res.status(401).json({ Message: "username has already existed" });
        return;
      }
      res.status(200).json(result);
    } catch (e) {
      res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ message: "NO ANY INPUT" });
        return;
      }
      const user = await this.userService.getUsername(username);

      if (!user || !(await checkPassword(password, user.password))) {
        res.status(401).json({ message: "INVALID USERNAME OR PASSWORD" });
        return;
      }
      req.session["user"] = { id: user.id };

      res.status(200).json({ message: "success" });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
  };

logout = async (req: Request, res: Response) => {
    req.session?.destroy(()=>{
      console.log("Destroy req.Session")
      res.status(200).json({message: "Destroy req.Session"})
    })

}

}
