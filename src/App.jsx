/* global chrome */
import { useEffect, useState } from "react";
import "./App.css";
import LinkIcon from "./components/LinkIcon";
import Quote from "./components/Quote";
import SettingsSidebar from "./components/SettingsSidebar";
import isDarkColor from "./utils/isDarkColor";
import getAccentColor from "./utils/getAccentColor";
import { useFocusStore } from "./store/useFocusStore";

function App() {
    const {
        username,
        links,
        bgColor,
        bgImage,
        isDarkText,
        accentColor,
        isLoading,
        setUsername,
        addLink,
        deleteLink,
        setBgColor,
        setBgImage,
        setIsDarkText,
        setAccentColor,
        hydrateFromStorage,
    } = useFocusStore();

    const [time, setTime] = useState(new Date());
    const [inputname, setInputname] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newLink, setNewLink] = useState({ name: "", url: "" });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [tempName, setTempName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        hydrateFromStorage();
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!bgImage) {
            const dark = isDarkColor(bgColor);
            setIsDarkText(dark);
            const accent = getAccentColor(bgColor);
            setAccentColor(accent);
        }
    }, [bgColor, bgImage]);

    const handleNameSubmit = () => {
        if (inputname.trim()) setUsername(inputname);
    };

    // FIXED: Use Chrome Search API instead of hardcoded Google search
    const handleSearch = (e) => {
        if (e.key === "Enter" && searchQuery.trim() !== "") {
            // Check if chrome.search API is available (it should be in a Chrome extension)
            if (
                typeof chrome !== "undefined" &&
                chrome.search &&
                chrome.search.query
            ) {
                chrome.search.query({
                    text: searchQuery.trim(),
                    disposition: "CURRENT_TAB",
                });
            } else {
                // Fallback for development/testing outside extension context
                const query = encodeURIComponent(searchQuery.trim());
                window.open(
                    `https://www.google.com/search?q=${query}`,
                    "_self"
                );
            }
            setSearchQuery("");
        }
    };

    const hour = time.getHours();
    let greeting = "Good Morning!";
    if (hour >= 12 && hour < 17) greeting = "Good Afternoon!";
    else if (hour >= 17 || hour < 4) greeting = "Good Evening!";

    return (
        <div
            className="h-screen w-screen relative flex flex-col items-center justify-center overflow-hidden"
            style={{
                backgroundColor: bgColor,
                backgroundImage: bgImage ? `url(${bgImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: isDarkText ? "white" : "black",
                transition: isLoading
                    ? "none"
                    : "color 0.5s ease, background 0.5s ease",
            }}
        >
            {/* Subtle gradient overlay for better readability */}
            <div className="absolute inset-0 bg-linear-to-b from-black/5 via-transparent to-black/10 pointer-events-none"></div>

            <button
                onClick={() => setIsSidebarOpen(true)}
                className="absolute top-6 right-6 rounded-2xl p-3 shadow-xl transition-all duration-300 hover:scale-110 z-10 backdrop-blur-md"
                style={{
                    backgroundColor: isDarkText
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(255, 255, 255, 0.7)",
                    border: `1px solid ${
                        isDarkText
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(0, 0, 0, 0.1)"
                    }`,
                }}
            >
                <span className="text-xl">⚙️</span>
            </button>

            <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                {/* Enhanced Time Display */}
                <div className="flex flex-col items-center justify-center space-y-3">
                    <div
                        className="text-8xl font-bold tracking-tight"
                        style={{
                            color: isDarkText ? "#ffffff" : accentColor,
                            textShadow: isDarkText
                                ? "0 4px 20px rgba(0,0,0,0.4)"
                                : "0 2px 10px rgba(0,0,0,0.1)",
                            transition: isLoading ? "none" : "all 0.7s ease",
                        }}
                    >
                        {time.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                    <div
                        className="text-lg font-medium tracking-wide"
                        style={{
                            color: isDarkText
                                ? "rgba(255, 255, 255, 0.8)"
                                : "rgba(0, 0, 0, 0.7)",
                        }}
                    >
                        {time.toLocaleDateString([], {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                        })}
                    </div>
                </div>

                {/* Greeting Section */}
                <div className="mt-4 text-center">
                    {username ? (
                        <div className="flex flex-col items-center space-y-2">
                            {editingName ? (
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) =>
                                        setTempName(e.target.value)
                                    }
                                    onBlur={() => {
                                        const newName = tempName.trim();
                                        if (newName) setUsername(newName);
                                        setEditingName(false);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") e.target.blur();
                                        if (e.key === "Escape")
                                            setEditingName(false);
                                    }}
                                    autoFocus
                                    className="bg-transparent text-2xl font-medium text-center border-b-2 focus:outline-none w-48"
                                    style={{
                                        borderColor: isDarkText
                                            ? "#ffffff"
                                            : accentColor,
                                        color: isDarkText
                                            ? "#ffffff"
                                            : "inherit",
                                    }}
                                />
                            ) : (
                                <div
                                    className="text-2xl font-semibold cursor-pointer hover:opacity-80 transition-all duration-200 px-6 py-2 rounded-2xl backdrop-blur-sm"
                                    onClick={() => {
                                        setEditingName(true);
                                        setTempName(username);
                                    }}
                                    title="Click to edit your name"
                                    style={{
                                        backgroundColor: isDarkText
                                            ? "rgba(255, 255, 255, 0.05)"
                                            : "rgba(255, 255, 255, 0.5)",
                                    }}
                                >
                                    Hi, {username}
                                </div>
                            )}
                            <div
                                className="text-lg font-light"
                                style={{
                                    color: isDarkText
                                        ? "rgba(255, 255, 255, 0.7)"
                                        : "rgba(0, 0, 0, 0.6)",
                                }}
                            >
                                {greeting}
                            </div>
                        </div>
                    ) : (
                        <div
                            className="flex flex-col items-center space-y-3 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
                            style={{
                                backgroundColor: isDarkText
                                    ? "rgba(255, 255, 255, 0.1)"
                                    : "rgba(255, 255, 255, 0.8)",
                                border: `1px solid ${
                                    isDarkText
                                        ? "rgba(255, 255, 255, 0.2)"
                                        : "rgba(0, 0, 0, 0.1)"
                                }`,
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Enter your name..."
                                value={inputname}
                                onChange={(e) => setInputname(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleNameSubmit()
                                }
                                className="px-4 py-3 rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-[#5062f0] transition-all duration-200"
                                style={{
                                    backgroundColor: isDarkText
                                        ? "rgba(255, 255, 255, 0.1)"
                                        : "rgba(255, 255, 255, 0.9)",
                                    border: `1px solid ${
                                        isDarkText
                                            ? "rgba(255, 255, 255, 0.3)"
                                            : "rgba(0, 0, 0, 0.2)"
                                    }`,
                                    color: isDarkText ? "#ffffff" : "#000000",
                                }}
                            />
                            <button
                                onClick={handleNameSubmit}
                                className="bg-[#5062f0] text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 hover:bg-[#3949c6] transition-all duration-200 shadow-lg"
                            >
                                Get Started
                            </button>
                        </div>
                    )}
                </div>

                {/* Enhanced Search Bar - Now uses Chrome Search API */}
                <div className="mt-4 flex justify-center">
                    <div className="relative group">
                        <div
                            className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200"
                            style={{
                                color: isDarkText
                                    ? "rgba(255, 255, 255, 0.5)"
                                    : "rgba(0, 0, 0, 0.5)",
                            }}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search the web..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className="w-96 md:w-[500px] pl-12 pr-12 py-3.5 rounded-2xl shadow-xl focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-xl group-hover:shadow-2xl"
                            style={{
                                backgroundColor: isDarkText
                                    ? "rgba(255, 255, 255, 0.15)"
                                    : "rgba(255, 255, 255, 0.9)",
                                border: `1px solid ${
                                    isDarkText
                                        ? "rgba(255, 255, 255, 0.3)"
                                        : "rgba(0, 0, 0, 0.1)"
                                }`,
                                color: isDarkText ? "#ffffff" : "#000000",
                                focusRingColor: isDarkText
                                    ? "rgba(255, 255, 255, 0.5)"
                                    : "#5062f0",
                            }}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
                                style={{
                                    color: isDarkText
                                        ? "rgba(255, 255, 255, 0.5)"
                                        : "rgba(0, 0, 0, 0.5)",
                                }}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <Quote />
            </div>

            {/* Enhanced Shortcuts */}
            <div className="absolute bottom-12 flex flex-wrap justify-center gap-6 px-8 z-10">
                {links.map((link, i) => (
                    <div key={i} className="relative group cursor-pointer">
                        <LinkIcon link={link} />
                        <div
                            className="text-sm text-center mt-2 font-medium"
                            style={{
                                color: isDarkText
                                    ? "rgba(255, 255, 255, 0.9)"
                                    : "rgba(0, 0, 0, 0.8)",
                                textShadow: isDarkText
                                    ? "0 2px 8px rgba(0,0,0,0.3)"
                                    : "none",
                            }}
                        >
                            {link.name}
                        </div>
                        <button
                            onClick={() => deleteLink(i)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:bg-red-600 hover:scale-110"
                        >
                            ×
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => setShowModal(true)}
                    className="w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center text-3xl font-light hover:scale-110 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                    style={{
                        background:
                            "linear-gradient(135deg, #5062f0 0%, #7c3aed 100%)",
                        color: "white",
                        boxShadow: "0 8px 32px rgba(80, 98, 240, 0.4)",
                    }}
                >
                    +
                </button>
            </div>

            {/* Enhanced Modal */}
            {showModal && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
                    <div
                        className="backdrop-blur-xl rounded-3xl p-8 w-96 flex flex-col gap-4 shadow-2xl animate-in fade-in zoom-in duration-200"
                        style={{
                            backgroundColor: isDarkText
                                ? "rgba(30, 30, 30, 0.95)"
                                : "rgba(255, 255, 255, 0.95)",
                            border: `1px solid ${
                                isDarkText
                                    ? "rgba(255, 255, 255, 0.2)"
                                    : "rgba(0, 0, 0, 0.1)"
                            }`,
                        }}
                    >
                        <h2
                            className="text-2xl font-bold text-center"
                            style={{
                                background:
                                    "linear-gradient(135deg, #5062f0 0%, #7c3aed 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Add Shortcut
                        </h2>
                        <input
                            type="text"
                            placeholder="Website name"
                            value={newLink.name}
                            onChange={(e) =>
                                setNewLink({ ...newLink, name: e.target.value })
                            }
                            className="rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5062f0] transition-all duration-200"
                            style={{
                                backgroundColor: isDarkText
                                    ? "rgba(255, 255, 255, 0.1)"
                                    : "rgba(0, 0, 0, 0.05)",
                                border: `2px solid ${
                                    isDarkText
                                        ? "rgba(255, 255, 255, 0.2)"
                                        : "rgba(0, 0, 0, 0.1)"
                                }`,
                                color: isDarkText ? "#ffffff" : "#000000",
                            }}
                        />
                        <input
                            type="text"
                            placeholder="URL"
                            value={newLink.url}
                            onChange={(e) =>
                                setNewLink({ ...newLink, url: e.target.value })
                            }
                            className="rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5062f0] transition-all duration-200"
                            style={{
                                backgroundColor: isDarkText
                                    ? "rgba(255, 255, 255, 0.1)"
                                    : "rgba(0, 0, 0, 0.05)",
                                border: `2px solid ${
                                    isDarkText
                                        ? "rgba(255, 255, 255, 0.2)"
                                        : "rgba(0, 0, 0, 0.1)"
                                }`,
                                color: isDarkText ? "#ffffff" : "#000000",
                            }}
                        />
                        <div className="flex gap-3 justify-end mt-2">
                            <button
                                className="px-5 py-2 font-medium rounded-xl transition-all duration-200 hover:scale-105"
                                style={{
                                    color: isDarkText
                                        ? "rgba(255, 255, 255, 0.7)"
                                        : "rgba(0, 0, 0, 0.6)",
                                    backgroundColor: isDarkText
                                        ? "rgba(255, 255, 255, 0.1)"
                                        : "rgba(0, 0, 0, 0.05)",
                                }}
                                onClick={() => {
                                    setShowModal(false);
                                    setNewLink({ name: "", url: "" });
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-2 rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg text-white"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #5062f0 0%, #7c3aed 100%)",
                                }}
                                onClick={() => {
                                    addLink(newLink);
                                    setNewLink({ name: "", url: "" });
                                    setShowModal(false);
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SettingsSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                setBgColor={setBgColor}
                setBgImage={setBgImage}
                setIsDarkText={setIsDarkText}
            />
        </div>
    );
}

export default App;
