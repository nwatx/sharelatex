import { check, validationResult } from "express-validator";
import { NextApiRequest, NextApiResponse } from "next";
import initMiddleware from "../../../lib/api/initMiddleware";
import validateMiddleware from "../../../lib/api/validateMiddleware";
import { db } from "../../../lib/firebase/firestore";

const validateGET = initMiddleware(
  validateMiddleware(
    [check("id").isString().isLength({ min: 1 })],
    validationResult
  )
);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { id } = req.query;
    await validateGET(req, res);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array });
    }

    return new Promise((resolve, reject) => {
      db.docs
        .doc(`${id}`)
        .get()
        .then((doc) => {
          if (!doc.exists) return reject("Could not find document");
          else return doc.data();
        })
        .then((data) => {
          if(data) res.status(200).json(data);
          resolve("Succesfully parsed data");
        })
    }).catch(e => res.status(400).json({error: e}));
  }
}
