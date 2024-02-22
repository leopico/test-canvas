import { useRef, useState } from "react";
import { useEffect } from "react";
import {
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvaseMouseMove,
  handleResize,
  initializeFabric
} from "./libs/canvas";
import { defaultTextElement, imageElements, textElements } from "./constants";
import { handleDelete, handleImageUpload } from "./libs/shapes";


function App() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const shapeRef = useRef(null);
  const selectedShapeRef = useRef(null);
  const activeObjectRef = useRef(null);
  const imageInputRef = useRef(null);

  // console.log(selectedShapeRef.current);


  const [activeElement, setActiveElement] = useState({
    icon: "/assets/text.svg",
    value: "text",
    name: "Text",
  });


  const handleActiveElment = (elem) => {
    setActiveElement(elem);

    switch (elem.value) {
      case 'reset':
        fabricRef.current.clear();
        setActiveElement(defaultTextElement);
        break;
      
      case "delete":
        handleDelete(fabricRef.current);
        setActiveElement(defaultTextElement);
        break;

      case "image":
        imageInputRef.current.click();
        break;

      default:
        selectedShapeRef.current = elem.value;
        break;
    }
  };

  useEffect(() => {
    const canvas = initializeFabric({ fabricRef, canvasRef });

    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        shapeRef,
        selectedShapeRef
      });
    });

    canvas.on("mouse:move", (options) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        shapeRef,
        selectedShapeRef
      });
    });

    canvas.on("mouse:up", () => {
      handleCanvasMouseUp({
        canvas,
        shapeRef,
        selectedShapeRef,
        setActiveElement,
        activeObjectRef,
      });
    });

    canvas.on("object:selected", (options) => {
      const activeObject = options.target;
      activeObjectRef.current = activeObject;
    });

    window.addEventListener("resize", () => {
      handleResize({ fabricRef })
    });

    return () => {
      canvas.dispose();

      window.removeEventListener("resize", () => {
        handleResize({
          canvas: null,
        });
      });
    }

  }, [canvasRef]);

  const isActive = (value) =>
    (activeElement && activeElement.value === value);
  
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="h-20 w-full bg-slate-600 flex items-center justify-around">
        <div>
          <ul className="flex fexl-row space-x-6">
            {
              textElements.map((item) => (
                <li key={item.name}
                  onClick={() => {
                    if (Array.isArray(item.value)) return;
                    handleActiveElment(item);
                  }}
                >
                  <button
                    className={
                      `w-10 h-10 bg-slate-500 hover:bg-red-400 rounded
                        ${isActive(item.value) && "bg-red-400"}
                      `}
                  >
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="object-cover p-3"
                    />
                  </button>
                </li>
              ))
            }
          </ul>
        </div>
        <div>
            <ul className="flex fexl-row space-x-6">
            {
              imageElements.map((item) => (
                <li key={item.name}
                  onClick={() => {
                    if (Array.isArray(item.value)) return;
                    handleActiveElment(item);
                  }}
                >
                  <button
                    className={
                      `w-10 h-10 bg-slate-500 hover:bg-red-400 rounded
                        ${isActive(item.value) && "bg-red-400"}
                      `}
                  >
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="object-cover p-3"
                    />
                  </button>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
      <div className="h-[610px] w-full bg-yellow-600" id="canvas">
        <canvas ref={canvasRef} />
      </div>
      <input
        type="file"
        className="hidden"
        ref={imageInputRef}
        accept="image/*"
        onChange={(e) => {
          e.stopPropagation();
          handleImageUpload({
            file: e.target.files[0],
            canvas: fabricRef,
            shapeRef,
          })
        }}
      />
    </div>
  )
}

export default App
