import { Copy, Download, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

const ViewPaste = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pastes = useSelector((state) => state.paste.pastes);

  const paste = pastes.find((paste) => paste._id === id);

  const downloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([paste?.content || ""], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${paste?.title || "Untitled"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0">
      <div className="flex flex-col gap-y-5 items-start">
        <input
          type="text"
          placeholder="Title"
          value={paste?.title || ""}
          disabled
          className="w-full text-black dark:text-white dark:bg-black border border-input dark:border-gray-600 rounded-md p-2 text-2xl text-bold font-bold hover:scale-105 transition duration-300"
        />
        <div
          className="w-full flex flex-col items-start relative rounded bg-opacity-10 border border-[rgba(128,121,121,0.3)] dark:bg-black dark:border-gray-600 backdrop-blur-2xl hover:scale-105 transition duration-300"
        >
          <div
            className="w-full rounded-t flex items-center justify-between gap-x-4 px-4 py-2 border-b border-[rgba(128,121,121,0.3)] dark:border-gray-600 bg-black"
          >
            <div className="w-full flex gap-x-[6px] items-center select-none group ">
              <div className="w-[13px] h-[13px] rounded-full bg-[rgb(232,154,27)]" />
              <div className="w-[13px] h-[13px] rounded-full bg-[rgb(248,250,250)]" />
              <div className="w-[13px] h-[13px] rounded-full bg-[rgb(18,87,27)]" />
            </div>
            <div className="w-fit rounded-t flex items-center gap-x-4 px-4 bg-black">
              <button
                className="flex justify-center items-center transition-all duration-300 ease-in-out group relative hover:scale-110"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="group-hover:text-success-500 dark:text-white" size={20} />
                <span className="absolute top-8 text-xs bg-gray-700 text-white rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Back
                </span>
              </button>
              <button
                className="flex justify-center items-center transition-all duration-300 ease-in-out group relative hover:scale-110"
                onClick={downloadContent}
              >
                <Download className="group-hover:text-success-500 dark:text-white" size={20} />
                <span className="absolute top-8 text-xs bg-gray-700 text-white rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Download
                </span>
              </button>
              <button
                className="flex justify-center items-center transition-all duration-300 ease-in-out group relative hover:scale-110"
                onClick={() => {
                  navigator.clipboard.writeText(paste?.content || "");
                  toast.success("Copied to Clipboard");
                }}
              >
                <Copy className="group-hover:text-success-500 dark:text-white" size={20} />
                <span className="absolute top-8 text-xs bg-gray-700 text-white rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Copy
                </span>
              </button>
            </div>
          </div>

          {/* TextArea */}
          <textarea
            value={paste?.content || ""}
            disabled
            placeholder="Write Your Content Here...."
            className="w-full p-3 focus-visible:ring-0 dark:text-white dark:bg-gray-800"
            style={{
              caretColor: "#000",
            }}
            rows={20}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewPaste;




