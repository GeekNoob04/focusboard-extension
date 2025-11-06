/* global chrome */
import { useEffect, useState } from "react";
import "./App.css";
import LinkIcon from "./components/LinkIcon";
import Quote from "./components/Quote";
import SettingsSidebar from "./components/SettingsSidebar";
import isDarkColor from "./utils/isDarkColor";
import getAccentColor from "./utils/getAccentColor";

function App() {
    const [time, setTime] = useState(new Date());
    const [username, setUsername] = useState("");
    const [inputname, setInputname] = useState("");
    const [links, setLinks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newLink, setNewLink] = useState({ name: "", url: "" });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [bgColor, setBgColor] = useState("#e8edfc");
    const [bgImage, setBgImage] = useState("");
    const [isDarkText, setIsDarkText] = useState(false);
    const [accentColor, setAccentColor] = useState("#5062f0");

    useEffect(() => {
        chrome.storage.sync.get(
            ["bgColor", "bgImage", "isDarkText", "accentColor"],
            (data) => {
                if (data.bgColor) setBgColor(data.bgColor);
                if (data.bgImage) setBgImage(data.bgImage);
                if (typeof data.isDarkText === "boolean")
                    setIsDarkText(data.isDarkText);
                if (data.accentColor) setAccentColor(data.accentColor);
            }
        );

        const handleStorageChange = (changes, areaName) => {
            if (areaName === "sync" && changes.isDarkText) {
                setIsDarkText(changes.isDarkText.newValue);
            }
            if (areaName === "sync" && changes.bgColor) {
                setBgColor(changes.bgColor.newValue);
            }
            if (areaName === "sync" && changes.bgImage) {
                setBgImage(changes.bgImage.newValue);
            }
            if (areaName === "sync" && changes.accentColor) {
                setAccentColor(changes.accentColor.newValue);
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);
        return () =>
            chrome.storage.onChanged.removeListener(handleStorageChange);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        chrome.storage.sync.get(["username", "links"], (data) => {
            if (data.username) setUsername(data.username);
            if (data.links) setLinks(data.links);
        });
    }, []);

    const handleNameSubmit = () => {
        if (inputname.trim() !== "") {
            chrome.storage.sync.set({ username: inputname });
            setUsername(inputname);
        }
    };

    const hour = time.getHours();
    let greeting = "Good Morning!";
    if (hour >= 12 && hour < 17) greeting = "Good Afternoon!";
    else if (hour >= 17 || hour < 4) greeting = "Good Evening!";

    const addLink = () => {
        if (newLink.name && newLink.url) {
            const updatedLinks = [...links, newLink];
            setLinks(updatedLinks);
            chrome.storage.sync.set({ links: updatedLinks });
            setNewLink({ name: "", url: "" });
            setShowModal(false);
        }
    };

    const deleteLink = (index) => {
        const updated = links.filter((_, i) => i !== index);
        setLinks(updated);
        chrome.storage.sync.set({ links: updated });
    };

    useEffect(() => {
        if (!bgImage) {
            const dark = isDarkColor(bgColor);
            setIsDarkText(dark);
            const accent = getAccentColor(bgColor);
            setAccentColor(accent);

            chrome.storage.sync.set({
                isDarkText: dark,
                accentColor: accent,
            });
        }
    }, [bgColor, bgImage]);

    return (
        <div
            className="h-screen w-screen relative flex flex-col items-center justify-center overflow-hidden"
            style={{
                backgroundColor: bgColor,
                backgroundImage: bgImage ? `url(${bgImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: isDarkText ? "white" : "black",
                transition: "color 0.5s ease, background 0.5s ease",
            }}
        >
            <button
                onClick={() => setIsSidebarOpen(true)}
                className={`absolute top-4 right-4 rounded-full p-2 shadow transition ${
                    isDarkText
                        ? "bg-white/20 text-white hover:bg-white/30"
                        : "bg-white/60 text-gray-700 hover:bg-white/80"
                }`}
            >
                ⚙️
            </button>

            <div className="flex flex-col items-center justify-center space-y-2">
                <div
                    className="text-6xl font-semibold transition-all duration-700 ease-in-out"
                    style={{
                        color: isDarkText ? "#ffffff" : accentColor,
                        filter: "drop-shadow(0 0 8px rgba(0,0,0,0.1))",
                    }}
                >
                    {time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </div>
                <div
                    className={`text-sm transition-colors duration-500 ${
                        isDarkText ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                    {time.toLocaleDateString([], {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                    })}
                </div>
            </div>

            <div className="mt-6 text-center">
                {username ? (
                    <>
                        <div
                            className={`text-xl font-medium transition-colors duration-500 ${
                                isDarkText ? "text-gray-100" : "text-black"
                            }`}
                        >
                            Hi {username}
                        </div>
                        <div
                            className={`text-md transition-colors duration-500 ${
                                isDarkText ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                            {greeting}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center space-y-2">
                        <input
                            type="text"
                            placeholder="Enter Your name..."
                            value={inputname}
                            className="px-3 py-2 rounded-xl border border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-[#5062f0]"
                            onChange={(e) => setInputname(e.target.value)}
                        />
                        <button
                            onClick={handleNameSubmit}
                            className="bg-[#5062f0] text-white px-4 py-2 rounded-xl hover:bg-[#3949c6]"
                        >
                            Save
                        </button>
                    </div>
                )}
            </div>

            <Quote />

            <div className="absolute bottom-8 flex flex-wrap justify-center gap-5">
                {links.map((link, i) => (
                    <div key={i} className="relative group cursor-pointer">
                        <LinkIcon link={link} />
                        <div
                            className={`text-xs text-center mt-1 transition-colors duration-500 ${
                                isDarkText ? "text-gray-300" : "text-black"
                            }`}
                        >
                            {link.name}
                        </div>
                        <button
                            onClick={() => deleteLink(i)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full text-[10px] hidden group-hover:block"
                        >
                            ×
                        </button>
                    </div>
                ))}

                <button
                    onClick={() => setShowModal(true)}
                    className="w-14 h-14 bg-[#5062f0] text-white rounded-full shadow-md flex items-center justify-center text-2xl hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                    +
                </button>
            </div>

            {showModal && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-72 flex flex-col gap-3 shadow-xl">
                        <h2 className="text-lg font-semibold text-center text-[#5062f0]">
                            Add Shortcut
                        </h2>
                        <input
                            type="text"
                            placeholder="Website name"
                            value={newLink.name}
                            onChange={(e) =>
                                setNewLink({ ...newLink, name: e.target.value })
                            }
                            className="border rounded-lg px-3 py-2"
                        />
                        <input
                            type="text"
                            placeholder="URL"
                            value={newLink.url}
                            onChange={(e) =>
                                setNewLink({ ...newLink, url: e.target.value })
                            }
                            className="border rounded-lg px-3 py-2"
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                className="text-gray-500 px-3 py-1 hover:text-gray-700 cursor-pointer"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-[#5062f0] text-white px-4 py-1 rounded-lg hover:bg-[#3949c6] cursor-pointer"
                                onClick={addLink}
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
