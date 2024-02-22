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

export const handleDelete = (canvas) => {
  const activeObjects = canvas.getActiveObjects();
  if (!activeObjects || activeObjects.length === 0) return;

  if (activeObjects.length > 0) {
    activeObjects.forEach((obj) => {
      if (!obj.objectId) return;
      canvas.remove(obj);
    });
  }

  canvas.discardActiveObject();
  canvas.requestRenderAll();
};

export const handleImageUpload = ({
  file,
  canvas,
  shapeRef,
}) => {
  const reader = new FileReader();

  reader.onload = () => {
    fabric.Image.fromURL(reader.result, (img) => {
      
      img.scaleToWidth(300);
      img.scaleToHeight(300);

      canvas.current.add(img);

      img.objectId = uuidv4();

      shapeRef.current = img;

      canvas.current.requestRenderAll();
    });
  };

  reader.readAsDataURL(file);
};