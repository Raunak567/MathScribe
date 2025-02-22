import { useState } from "react";
import { Tldraw, TldrawEditor, useEditor } from "@tldraw/tldraw";
import axios from "axios";
import "@tldraw/tldraw/tldraw.css";

export default function Whiteboard() {
  const editor = useEditor();
  const [recognizedText, setRecognizedText] = useState("");
  const [recognizedMath, setRecognizedMath] = useState("");
  const [shapeImproved, setShapeImproved] = useState(false);

  const handwritingApiKey = import.meta.env.VITE_HF_API_KEY;
  const mathpixAppId = import.meta.env.VITE_MATHPIX_APP_ID;
  const mathpixAppKey = import.meta.env.VITE_MATHPIX_APP_KEY;

  const handleHandwritingRecognition = async () => {
    if (!editor) return;
    const imageData = await editor.getSvg();
    const blob = new Blob([imageData.outerHTML], { type: "image/svg+xml" });

    const formData = new FormData();
    formData.append("file", blob);

    try {
      const response = await axios.post("YOUR_HF_HANDWRITING_API_ENDPOINT", formData, {
        headers: { Authorization: `Bearer ${handwritingApiKey}` },
      });
      setRecognizedText(response.data.text);
    } catch (error) {
      console.error("Handwriting recognition failed:", error);
    }
  };

  const handleShapePrediction = () => {
    if (!editor) return;
    editor.store.allShapes().forEach((shape) => {
      if (shape.type === "draw") {
        editor.updateShape({
          id: shape.id,
          type: "geo",
          props: { geo: "rectangle" },
        });
      }
    });
    setShapeImproved(true);
  };

  const handleMathRecognition = async () => {
    if (!editor) return;
    const imageData = await editor.getSvg();
    const blob = new Blob([imageData.outerHTML], { type: "image/svg+xml" });

    const formData = new FormData();
    formData.append("file", blob);

    try {
      const response = await axios.post("https://api.mathpix.com/v3/text", formData, {
        headers: {
          app_id: mathpixAppId,
          app_key: mathpixAppKey,
          "Content-Type": "multipart/form-data",
        },
      });
      setRecognizedMath(response.data.latex_normal);
    } catch (error) {
      console.error("Math recognition failed:", error);
    }
  };

  return (
    <div className="w-screen h-screen flex">
      {/* Whiteboard Section */}
      <div className="flex-1 relative">
        <TldrawEditor>
          <Tldraw />
        </TldrawEditor>

        {/* Sidebar for AI Actions */}
        <div className="absolute right-0 top-0 h-full w-72 bg-gray-100 border-l border-gray-300 p-4 space-y-6 shadow-lg z-10">
          <h2 className="text-lg font-semibold text-center">🤖 AI Tools</h2>

          <button
            onClick={handleHandwritingRecognition}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            📝 Handwriting Recognition
          </button>

          <button
            onClick={handleShapePrediction}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            🔵 Improve Shapes
          </button>

          <button
            onClick={handleMathRecognition}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            🤖 Math Recognition
          </button>

          {/* Results Section */}
          <div className="space-y-4">
            {recognizedText && (
              <div>
                <h3 className="font-semibold">Recognized Text:</h3>
                <p className="bg-gray-200 p-2 rounded-lg text-sm">{recognizedText}</p>
              </div>
            )}

            {recognizedMath && (
              <div>
                <h3 className="font-semibold">Recognized Math (LaTeX):</h3>
                <code className="bg-gray-200 p-2 rounded-lg text-sm">{recognizedMath}</code>
              </div>
            )}

            {shapeImproved && (
              <div className="text-green-600 font-medium text-center">
                ✅ Shapes improved!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
