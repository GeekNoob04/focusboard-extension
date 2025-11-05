/* global chrome */
import { useEffect, useState } from "react";
import "./App.css";
import LinkIcon from "./components/LinkIcon";

function App() {
    const [time, setTime] = useState(new Date());
    const [username, setUsername] = useState("");
    const [inputname, setInputname] = useState("");
    const [links, setLinks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newLink, setNewLink] = useState({ name: "", url: "" });

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

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#e8edfc] text-gray-800 relative">
            <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-6xl font-semibold text-[#5062f0]">
                    {time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </div>
                <div className="text-sm opacity-70">
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
                        <div className="text-xl font-medium">Hi {username}</div>
                        <div className="text-md text-gray-600">{greeting}</div>
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
            <div className="absolute bottom-8 flex flex-wrap justify-center gap-5">
                {links.map((link, i) => (
                    <div key={i} className="relative group cursor-pointer">
                        <LinkIcon link={link} />
                        <div className="text-xs text-center mt-1">
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
                            placeholder="website name"
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
        </div>
    );
}

export default App;
