import { fabric } from "fabric";
import { createSpecificShape } from "./shapes";
import { defaultTextElement } from "../constants";

export const initializeFabric = ({ fabricRef, canvasRef }) => {

  const canvasElement = document.getElementById("canvas");

  const canvas = new fabric.Canvas(canvasRef.current, {
    width: canvasElement?.clientWidth,
    height: canvasElement?.clientHeight,
  });

  fabricRef.current = canvas;

  return canvas;
};

export const handleCanvasMouseDown = ({
  options,
  canvas,
  shapeRef,
  selectedShapeRef,
}) => {
  // get pointer coordinates
  const pointer = canvas.getPointer(options.e);

  const target = canvas.findTarget(options.e, false);

  if (
    target &&
    (target.type === selectedShapeRef.current ||
      target.type === "activeSelection")
  ) {

    // set active object to target
    canvas.setActiveObject(target);

    /**
     * setCoords() is used to update the controls of the object
     * setCoords: http://fabricjs.com/docs/fabric.Object.html#setCoords
     */
    target.setCoords();
  } else {

    // create custom fabric object/shape and set it to shapeRef
    shapeRef.current = createSpecificShape(
      selectedShapeRef.current,
      pointer
    );

    // if shapeRef is not null, add it to canvas
    if (shapeRef.current) {
      // add: http://fabricjs.com/docs/fabric.Canvas.html#add
      canvas.add(shapeRef.current);
    }
  }
};

export const handleCanvaseMouseMove = ({
  options,
  canvas,
  selectedShapeRef,
  shapeRef,
}) => {

  if (selectedShapeRef.current === "freeform") return;
  // get pointer coordinates
  const pointer = canvas.getPointer(options.e);

  // depending on the selected shape, set the dimensions of the shape stored in shapeRef in previous step of handelCanvasMouseDown
  // calculate shape dimensions based on pointer coordinates
  switch (selectedShapeRef?.current) {
    case "image":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;

    default:
      break;
  }

  // render objects on canvas
  // renderAll: http://fabricjs.com/docs/fabric.Canvas.html#renderAll
  canvas.renderAll();
};

export const handleCanvasMouseUp = ({
  canvas,
  shapeRef,
  activeObjectRef,
  selectedShapeRef,
  setActiveElement,
}) => {
  if (selectedShapeRef.current === "freeform") return

  if (selectedShapeRef.current === "reset") {
    canvas.clear();
  }

  // set everything to null
  shapeRef.current = null;
  activeObjectRef.current = null;
  selectedShapeRef.current = null;


  // if canvas is not in drawing mode, set active element to default nav element after 700ms
  setTimeout(() => {
    setActiveElement(defaultTextElement);
  }, 700);
};

export const handleResize = ({ canvas }) => {
  const canvasElement = document.getElementById("canvas");
  if (!canvasElement) return;

  if (!canvas) return;

  canvas.setDimensions({
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight,
  });
};