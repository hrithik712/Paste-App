import {
  Calendar,
  Clock,
  Copy,
  Eye,
  PencilLine,
  Trash2,
  Share2,
  Heart,
  Filter,
  BarChart, 
} from "lucide-react";
import React from 'react';
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { removeFromPastes } from "../redux/pasteSlice";
import { FormatDate } from "../utlis/formatDate";
import ActivityGraph from "./ActivityGraph";


const Paste = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [likedPastes, setLikedPastes] = useState({});
  
  const [viewCounts, setViewCounts] = useState(() => {
    const storedCounts = localStorage.getItem("viewCounts");
    return storedCounts ? JSON.parse(storedCounts) : {};
  });
  const [shareCounts, setShareCounts] = useState({});
  const [isGraphVisible, setIsGraphVisible] = useState(false);
  const [selectedPaste, setSelectedPaste] = useState(null);
  const [filter, setFilter] = useState("Most Recent");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const handleDelete = (id) => {
    dispatch(removeFromPastes(id));
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.add(theme);
  }, [theme]);

  const applyFilter = (pastes) => {
    switch (filter) {
      case "Most Recent":
        return [...pastes].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "Most Liked":
        return [...pastes].sort(
          (a, b) => (likedPastes[b._id] || 0) - (likedPastes[a._id] || 0)
        );
      case "Most Shared":
        return [...pastes].sort(
          (a, b) => (shareCounts[b._id] || 0) - (shareCounts[a._id] || 0)
        );
      default:
        return pastes;
    }
  };

  const filteredPastes = applyFilter(
    pastes.filter((paste) =>
      paste.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  // hadleing the share function ... 
  const handleShare = (paste) => {
    if (navigator.share) {
      navigator
        .share({
          title: paste.title,
          text: paste.content,
          url: `/?pasteId=${paste._id}`,
        })
        .then(() => {
          toast.success("Shared successfully!");
          setShareCounts((prev) => ({
            ...prev,
            [paste._id]: (prev[paste._id] || 0) + 1,
          }));
        })
        .catch((error) => toast.error("Error in Sharing. Try! Again"));
    } 
    else {
      toast.error("Sharing not supported in this browser.");
    }
  };

  const formatTime = (dateString) => {
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    return new Date(dateString).toLocaleTimeString([], options);
  };
  // like function     .. 
  const handleLike = (pasteId) => {
    setLikedPastes((prev) => ({
      ...prev,
      [pasteId]: (prev[pasteId] || 0) + 1,
    }));
    toast.success("Liked Successfully");
  };
  // view function 
  const handleViewContent = (pasteId) => {
    setViewCounts((prev) => {
      const updatedCounts = { ...prev, [pasteId]: (prev[pasteId] || 0) + 1 };
      localStorage.setItem("viewCounts", JSON.stringify(updatedCounts));
      return updatedCounts;
    });

    window.location.href = `/pastes/${pasteId}`;
  };
  // edit function .. 
  const handleEdit = (pasteId) => {
    setEditCounts((prev) => {
      const updatedCounts = { ...prev, [pasteId]: (prev[pasteId] || 0) + 1 };
      localStorage.setItem("editCounts", JSON.stringify(updatedCounts));
      return updatedCounts;
    });
  
    window.location.href = `/edit/${pasteId}`;
  };

  const [editCounts, setEditCounts] = useState(() => {
    const storedCounts = localStorage.getItem("editCounts");
    return storedCounts ? JSON.parse(storedCounts) : {};
  });


  // Graph functin .... 
  const handleShowGraph = (paste) => {
    setSelectedPaste({
      ...paste,
      likes: likedPastes[paste._id] || 0,
      shares: shareCounts[paste._id] || 0,
      views: viewCounts[paste._id] || 0,
      edits: editCounts[paste._id] || 0, 
    });
    setIsGraphVisible(true);
  };

  const handleCloseGraph = () => {
    setIsGraphVisible(false);
    setSelectedPaste(null);
  };

  return (
    <div className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0">
      <div className="flex flex-col gap-y-3">
        <div className="w-full flex gap-3 px-4 py-2 rounded-[0.3rem] border border-[rgba(128,121,121,0.3)] mt-6 dark:bg-black dark:border-gray-600 hover:scale-105 transition-transform duration-200 ">
          <input
            type="search"
            placeholder="Search here..."
            className="focus:outline-none w-full bg-transparent dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Header Section */}
        <div className="flex flex-col border border-[rgba(128,121,121,0.3)] py-4 rounded-[0.4rem] dark:bg-black dark:border-gray-600">
          <div className="flex justify-between px-4 pb-4">
            <h2 className="text-4xl font-bold dark:text-white hover:scale-110 transition-transform duration-300">
              All Pastes
            </h2>

            {/* // Filter Button*/}
            <div className="relative">
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-blue-950 text-white dark:text-gray-300 rounded-md hover:scale-110 transform transition duration-300 hover:shadow-md"
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              >
                <Filter size={20} />
                <span>Filter</span>
              </button>

              {isFilterMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 text-white bg-white dark:bg-gray-900 border dark:border-gray-900 rounded-md shadow-lg z-10">
                  <ul className="py-2">
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => {
                        setFilter("Most Recent");
                        setIsFilterMenuOpen(false);
                      }}
                    >
                      Most Recent
                    </li>
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => {
                        setFilter("Most Liked");
                        setIsFilterMenuOpen(false);
                      }}
                    >
                      Most Liked
                    </li>
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => {
                        setFilter("Most Shared");
                        setIsFilterMenuOpen(false);
                      }}
                    >
                      Most Shared
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* FunctionalitY Section with icon ..  */}
          <div className="w-full px-4 pt-4 flex flex-col gap-y-5">
            {filteredPastes.length > 0 ? (
              filteredPastes.map((paste) => (
                <div
                  key={paste?._id}
                  className="paste-item transition-transform duration-200 transform hover:scale-105 hover:shadow-md hover:overflow-hidden border border-[rgba(128,121,121,0.3)] w-full gap-y-6 justify-between flex  sm:flex-row p-4 rounded-[0.3rem] dark:bg-slate-900 dark:border-gray-600
                   "
                >
                  <div className="w-[32%] flex flex-col space-y-4">
                    <div className="relative flex items-center ">
                      <p className="text-4xl font-semibold dark:text-white flex-1">
                        {paste?.title}
                      </p>

                      <div className="items-center gap-1 text-black text-lg bg-white px-2 py-1 rounded-md hover:scale-110 transition duration-300 hidden sm:flex">
                        <Eye size={18} />
                        <span>{viewCounts[paste?._id] || 0}</span>
                      </div>
                    </div>

                    <p className="text-[15px] font-bold dark:text-white line-clamp-2">
                      {paste?.content}
                    </p>

                    <p className="text-lg text-gray-400">
                      {FormatDate(paste?.createdAt)}
                    </p>
                  </div>

                  <div className="w-full gap-2 sm:w-auto flex flex-col sm:flex-row items-center sm:items-start flex-wrap justify-center sm:justify-start">
                    {/* Like Button icon*/}
                    <div className="relative group">
                      <button
                        className="p-2 rounded-[0.2rem] bg-white border border-[#c7c7c7] hover:bg-transparent group hover:border-red-600 dark:bg-gray-700 dark:border-gray-600 hover:scale-125 transition duration-200"
                        onClick={() => handleLike(paste._id)}
                      >
                        <Heart
                          size={20}
                          className={`${
                            likedPastes[paste._id]
                              ? "fill-red-500"
                              : "text-black"
                          } text-red-500 group-hover:text-red-600 transition-colors duration-300`}
                        />
                      </button>
                 
                      <span className="absolute top-full  left-1/2 transform -translate-x-1/2 mt-1 p-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        Like
                      </span>
                    </div>
                    {/* 
                   
                    {/* Read Button */}
                    <div className="relative group">
                      <button
                        className="p-2 rounded-[0.2rem] bg-white border border-[#c7c7c7] hover:bg-transparent group hover:border-green-500 dark:bg-gray-700 dark:border-gray-600 hover:scale-125 transition duration-200"
                        onClick={() => handleViewContent(paste._id)}
                      >
                        <Eye
                          size={20}
                          className="text-green-500 group-hover:text-green-600"
                        />
                      </button>
                     
                      <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 p-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        Read
                      </span>
                    </div>

                    {/* EDIT BUTTON */}
                    <div className="relative group">
                      <button
                        className="p-2 rounded-[0.2rem] bg-white border border-[#c7c7c7] hover:bg-transparent group hover:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 hover:scale-125 transition duration-200"
                        // onClick={() => alert("Edit function here")
                        // onClick={() => handleEdit(paste._id)}
                      >
                        <a href={`/?pasteId=${paste?._id}`}>
                          <PencilLine
                            size={20}
                            className="text-yellow-500 group-hover:text-yellow-600"
                          />
                        </a>
                      </button>

                      <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 p-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        Edit
                      </span>
                    </div>

                    {/* share button  */}
                    <div className="relative group">
                      <button
                        onClick={() => handleShare(paste)}
                        className="p-2  rounded-[0.2rem] bg-white border border-[#c7c7c7] hover:bg-transparent group hover:border-sky-500 dark:bg-gray-700 dark:border-gray-600 hover:scale-125 transition duration-200"
                        // onClick={() => alert("Share function here")}
                      >
                        <Share2
                          size={20}
                          className="text-sky-500 group-hover:text-sky-600"
                        />
                      </button>
                   
                      <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 p-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        Share
                      </span>
                    </div>

                    {/* Graph Button ..  */}

                    <div className="relative group">
                      <button
                        className="p-2 rounded-[0.2rem] bg-white border border-[#c7c7c7] hover:bg-transparent group hover:border-purple-500 dark:bg-gray-700 dark:border-gray-600 hover:scale-125 transition duration-200"
                        onClick={() => handleShowGraph(paste)}
                      >
                        <BarChart
                          size={20}
                          className="text-purple-500 group-hover:text-purple-600"
                        />
                      </button>
                      <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 p-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        Graph
                      </span>
                    </div>

                    {/* Delete  Button */}

                    <div className="relative group">
                      <button
                        className="p-2 rounded-[0.2rem] bg-white border border-[#c7c7c7] hover:bg-transparent group hover:border-sky-500 dark:bg-gray-700 dark:border-gray-600 hover:scale-125 transition duration-200 "
                        onClick={() => handleDelete(paste._id)}
                      >
                        <Trash2
                          size={20}
                          className="text-sky-500 group-hover:text-sky-600"
                        />
                      </button>
                  
                      <span className="absolute items-center top-full left-1/2 transform -translate-x-1/2 mt-1 p-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        Delete
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center dark:text-white mt-10">
                No Pastes Found
              </p>
            )}
          </div>
        </div>
      </div>

     
      {isGraphVisible && selectedPaste && (
        <ActivityGraph paste={selectedPaste} onClose={handleCloseGraph} />
      )}
    </div>
  );
};

export default Paste;



