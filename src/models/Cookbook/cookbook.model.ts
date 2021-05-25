import { model } from "mongoose";
import { ICookbookDocument, ICookbookModel } from "./cookbook.types";
import CookbookSchema from "./cookbook.schema";

export const CookbookModel = model<ICookbookDocument, ICookbookModel>(
  "cookbook",
  CookbookSchema
);
