import { Copy, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToPastes, updatePastes } from "../redux/pasteSlice";
import { useSearchParams } from "react-router-dom";

// function for the home section and halder is included e...
const Home = () => {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get("pasteId");
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();
  const [showTooltip, setShowTooltip] = useState(false); // Tooltip visibility state

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to Clipboard", { position: "top-right" });
  };

  const createPaste = () => {
    const paste = {
      title: title,
      content: value,
      _id: pasteId || Date.now().toString(36) + Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
    };

    if (pasteId) {
      dispatch(updatePastes(paste));
    } else {
      dispatch(addToPastes(paste));
    }

    setTitle("");
    setValue("");
    setSearchParams({});
  };

  const resetPaste = () => {
    setTitle("");
    setValue("");
    setSearchParams({});
  };

  useEffect(() => {
    document.documentElement.classList.add(theme);
  }, []);

  useEffect(() => {
    if (pasteId) {
      const paste = pastes.find((p) => p._id === pasteId);
      if (paste) {
        setTitle(paste.title);
        setValue(paste.content);
      }
    }
  }, [pasteId, pastes]);

  return (
    <div className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0">
      <div className="flex flex-col gap-y-5 items-start">
        <div className="w-full flex flex-row gap-x-4 justify-between items-center">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${
              pasteId ? "w-[80%]" : "w-[85%]"
            } text-black dark:text-white dark:bg-black border border-input rounded-md p-2 hover:scale-105 transform transition-transform duration-200`}
          />
          <button
            className="text-white bg-black focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-black hover:scale-105 transform transition duration-300 "
            onClick={createPaste}
          >
            {pasteId ? "Update Paste" : "Create My Paste"}
          </button>

          {pasteId && (
            <button
              className="text-white bg-blue-900 hover:bg-blue-950 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-800 dark:hover:bg-blue-900"
              onClick={resetPaste}
            >
              <PlusCircle size={20} />
            </button>
          )}
        </div>

        <div className="w-full flex flex-col items-start relative rounded bg-opacity-10 border border-[rgba(128,121,121,0.3)] backdrop-blur-2xl dark:bg-black hover:scale-105 transform transition-transform duration-300 hide-scrollbar overflow-y-auto"> {/* Apply class here */}
          <div className="w-full rounded-t flex items-center justify-between gap-x-4 px-4 py-2 border-b border-[rgba(128,121,121,0.3)] dark:border-gray-600">
            <div className="w-full flex gap-x-[6px] items-center select-none group">
              <div className="w-[13px] h-[13px] rounded-full bg-[rgb(221,115,69)]" />
              <div className="w-[13px] h-[13px] rounded-full bg-[rgb(255,255,255)]" />
              <div className="w-[13px] h-[13px] rounded-full bg-[rgb(45,200,66)]" />
            </div>

            <button
              className="flex justify-center items-center transition-all duration-300 ease-in-out group relative"
              onClick={handleCopy}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
               <Copy className="group-hover:text-success-500 dark:text-white" size={20} />
                <span className="absolute top-8 text-xs bg-black text-white rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition duration-300">
                  Copy
                </span>
            </button>
              
          </div>

          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write Your Content Here...."
            className="w-full p-3 focus-visible:ring-0 dark:text-white dark:bg-gray-900 "
            style={{
              caretColor: theme === "light" ? "#000" : "#FFF",
            }}
            onFocus={(e) => (e.target.style.caretColor = "#FFF")} 
            onBlur={(e) => (e.target.style.caretColor = theme === "light" ? "#000" : "#FFF")}
            rows={20}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
