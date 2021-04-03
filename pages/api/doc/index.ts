import { check, validationResult } from "express-validator";
import { firestore } from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";
import initMiddleware from "../../../lib/api/initMiddleware";
import validateMiddleware from "../../../lib/api/validateMiddleware";
import { db } from "../../../lib/firebase/firestore";

const validatePOST = initMiddleware(
  validateMiddleware(
    [check("content").isString().isLength({ min: 1 })],
    validationResult
  )
);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await validatePOST(req, res);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array });
    }
    const { content } = req.body;
    db.docs
      .add({
        content,
        date: firestore.Timestamp.fromDate(new Date()),
      })
      .then((value) => {
        res.status(200).json({ id: value.id });
      })
      .catch((e) => res.status(400).json({ error: e }));
  }
}
