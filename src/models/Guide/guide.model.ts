import { model } from "mongoose";
import { IGuideDocument, IGuideModel } from "./guide.types";
import GuideSchema from "./guide.schema";

export const GuideModel = model<IGuideDocument, IGuideModel>(
  "guide",
  GuideSchema
);
