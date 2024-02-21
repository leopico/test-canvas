import { v4 as uuidv4 } from "uuid";
import { fabric } from "fabric";

export const createText = (pointer, text) => {
  return new fabric.IText(text, {
    left: pointer.x,
    top: pointer.y,
    fill: "#aabbcc",
    fontFamily: "Helvetica",
    fontSize: 36,
    fontWeight: "400",
    objectId: uuidv4()
  });
};

export const createSpecificShape = (
  shapeType,
  pointer
) => {
  switch (shapeType) {
    case "text":
      return createText(pointer, "Tap to Type");

    default:
      return null;
  }
};