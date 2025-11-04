/* global chrome */
import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [time, setTime] = useState(new Date());
    const [username, setUsername] = useState("");
    const [inputname, setInputname] = useState("");
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    useEffect(() => {
        chrome.storage.sync.get(["username"], (data) => {
            if (data.username) {
                setUsername(data.username);
            }
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
            <div className="absolute bottom-6 flex gap-6">
                <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:scale-105 transition">
                    🌤️
                </div>
                <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:scale-105 transition">
                    🔍
                </div>
                <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:scale-105 transition">
                    🗒️
                </div>
            </div>
        </div>
    );
}

export default App;
