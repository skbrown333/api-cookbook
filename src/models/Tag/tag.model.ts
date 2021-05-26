import { model } from "mongoose";
import { ITagDocument, ITagModel } from "./tag.types";
import TagSchema from "./tag.schema";

export const TagModel = model<ITagDocument, ITagModel>("tag", TagSchema);
