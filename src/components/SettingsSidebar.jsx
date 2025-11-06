/* global chrome */
import { useEffect, useState } from "react";
import isDarkColor from "../utils/isDarkColor";

function SettingsSidebar({
    isOpen,
    onClose,
    setBgColor,
    setBgImage,
    setIsDarkText,
}) {
    const presetColors = [
        // Light tones
        "#e8edfc",
        "#f5f5f5",
        "#fff3e0",
        "#e0f7fa",
        "#ede7f6",
        "#ffe0e0",
        "#d1ffd6",
        "#fce4ec",
        "#e3f2fd",
        "#f3e5f5",
        "#e8f5e9",
        "#fff8e1",
        "#edeef7",
        "#eaf4fc",
        "#d7ccc8",
        "#cfd8dc",
        "#fbe9e7",
        "#f0f4c3",
        "#ffe082",
        "#c8e6c9",

        // Dark tones
        "#1e1e1e",
        "#2c2f33",
        "#3a3b3c",
        "#242526",
        "#37474f",
        "#263238",
        "#212121",
        "#1b1b1b",
        "#0d1117",
        "#191919",
    ];

    const [selectedColor, setSelectedColor] = useState("#e8edfc");
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        chrome.storage.sync.get(["bgColor", "isDarkText"], (data) => {
            if (data.bgColor) setSelectedColor(data.bgColor);
            if (data.isDarkText) setIsDarkMode(data.isDarkText);
        });
    }, []);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        setBgColor(color);
        setBgImage("");

        const dark = isDarkColor(color);
        setIsDarkText(dark);
        setIsDarkMode(dark);

        chrome.storage.sync.set({
            bgColor: color,
            bgImage: "",
            isDarkText: dark,
        });
    };

    const handleResetBackground = () => {
        chrome.storage.sync.remove(["bgColor", "bgImage", "isDarkText"], () => {
            setBgColor("#e8edfc");
            setBgImage("");
            setIsDarkText(false);
            setIsDarkMode(false);
        });
    };

    return (
        <div
            className={`fixed top-0 right-0 h-full w-64 z-50 transform transition-transform duration-300 ${
                isOpen ? "translate-x-0" : "translate-x-full"
            } ${
                isDarkMode
                    ? "bg-[#1e1e1e] text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                    : "bg-white text-gray-800 shadow-2xl"
            }`}
        >
            <div
                className={`flex justify-between items-center p-4 border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
            >
                <h2
                    className={`font-semibold text-lg ${
                        isDarkMode ? "text-white" : "text-[#5062f0]"
                    }`}
                >
                    Settings
                </h2>
                <button
                    onClick={onClose}
                    className={`hover:opacity-80 ${
                        isDarkMode
                            ? "text-gray-400 hover:text-white"
                            : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                    ✕
                </button>
            </div>

            <div className="p-4">
                <h3
                    className={`font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-800"
                    }`}
                >
                    Light Colors
                </h3>
                <div className="grid grid-cols-4 gap-2 mb-4">
                    {presetColors.slice(0, 20).map((color) => (
                        <div
                            key={color}
                            className={`w-8 h-8 rounded-full cursor-pointer border ${
                                color === selectedColor
                                    ? "ring-2 ring-[#5062f0]"
                                    : ""
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorSelect(color)}
                        ></div>
                    ))}
                </div>
            </div>

            <div
                className={`p-4 border-t ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
            >
                <h3
                    className={`font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-800"
                    }`}
                >
                    Dark Mode
                </h3>
                <div className="grid grid-cols-4 gap-2">
                    {presetColors.slice(20).map((color) => (
                        <div
                            key={color}
                            className={`w-8 h-8 rounded-full cursor-pointer border ${
                                color === selectedColor
                                    ? "ring-2 ring-[#5062f0]"
                                    : ""
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorSelect(color)}
                        ></div>
                    ))}
                </div>
            </div>

            <div
                className={`p-4 border-t ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
            >
                <button
                    onClick={handleResetBackground}
                    className={`w-full py-2 rounded-xl transition ${
                        isDarkMode
                            ? "bg-white text-black hover:bg-gray-300"
                            : "bg-[#5062f0] text-white hover:bg-[#3b4ad4]"
                    }`}
                >
                    Reset to Default
                </button>
            </div>
        </div>
    );
}

export default SettingsSidebar;
