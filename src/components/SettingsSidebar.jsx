/* global chrome */
import { useEffect, useState } from "react";
import isDarkColor from "../utils/isDarkColor";
import { useFocusStore } from "../store/useFocusStore";

function SettingsSidebar({ isOpen, onClose }) {
    const { bgColor, setBgColor, setBgImage, isDarkText, setIsDarkText } =
        useFocusStore();

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

    const [selectedColor, setSelectedColor] = useState(bgColor);

    useEffect(() => {
        setSelectedColor(bgColor);
    }, [bgColor]);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        setBgColor(color);
        setBgImage("");
        const dark = isDarkColor(color);
        setIsDarkText(dark);
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
        });
    };

    return (
        <>
            {/* Backdrop overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-72 z-50 transform transition-all duration-300 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } backdrop-blur-2xl shadow-2xl`}
                style={{
                    backgroundColor: isDarkText
                        ? "rgba(30, 30, 30, 0.95)"
                        : "rgba(255, 255, 255, 0.95)",
                    borderLeft: `1px solid ${
                        isDarkText
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)"
                    }`,
                }}
            >
                {/* Header */}
                <div
                    className="flex justify-between items-center p-6 border-b"
                    style={{
                        borderColor: isDarkText
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <h2
                        className="font-bold text-xl"
                        style={{
                            background: isDarkText
                                ? "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)"
                                : "linear-gradient(135deg, #5062f0 0%, #7c3aed 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                        style={{
                            backgroundColor: isDarkText
                                ? "rgba(255, 255, 255, 0.1)"
                                : "rgba(0, 0, 0, 0.05)",
                            color: isDarkText
                                ? "rgba(255, 255, 255, 0.8)"
                                : "rgba(0, 0, 0, 0.6)",
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto h-[calc(100%-80px)] p-6 space-y-6">
                    {/* Light Colors Section */}
                    <div>
                        <h3
                            className="font-semibold mb-3 text-sm uppercase tracking-wide"
                            style={{
                                color: isDarkText
                                    ? "rgba(255, 255, 255, 0.7)"
                                    : "rgba(0, 0, 0, 0.6)",
                            }}
                        >
                            Light Colors
                        </h3>
                        <div className="grid grid-cols-5 gap-2.5">
                            {presetColors.slice(0, 20).map((color) => (
                                <button
                                    key={color}
                                    className={`w-full aspect-square rounded-xl cursor-pointer transition-all duration-200 hover:scale-110 ${
                                        color === selectedColor
                                            ? "ring-3 ring-[#5062f0] ring-offset-2 scale-105"
                                            : "hover:ring-2 hover:ring-gray-400"
                                    }`}
                                    style={{
                                        backgroundColor: color,
                                        boxShadow:
                                            color === selectedColor
                                                ? "0 4px 12px rgba(80, 98, 240, 0.4)"
                                                : "0 2px 8px rgba(0, 0, 0, 0.1)",
                                        ringOffsetColor: isDarkText
                                            ? "#1e1e1e"
                                            : "#ffffff",
                                    }}
                                    onClick={() => handleColorSelect(color)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Dark Mode Colors Section */}
                    <div>
                        <h3
                            className="font-semibold mb-3 text-sm uppercase tracking-wide"
                            style={{
                                color: isDarkText
                                    ? "rgba(255, 255, 255, 0.7)"
                                    : "rgba(0, 0, 0, 0.6)",
                            }}
                        >
                            Dark Mode
                        </h3>
                        <div className="grid grid-cols-5 gap-2.5">
                            {presetColors.slice(20).map((color) => (
                                <button
                                    key={color}
                                    className={`w-full aspect-square rounded-xl cursor-pointer transition-all duration-200 hover:scale-110 border ${
                                        color === selectedColor
                                            ? "ring-3 ring-[#5062f0] ring-offset-2 scale-105"
                                            : "hover:ring-2 hover:ring-gray-400"
                                    }`}
                                    style={{
                                        backgroundColor: color,
                                        borderColor: "rgba(255, 255, 255, 0.1)",
                                        boxShadow:
                                            color === selectedColor
                                                ? "0 4px 12px rgba(80, 98, 240, 0.4)"
                                                : "0 2px 8px rgba(0, 0, 0, 0.2)",
                                        ringOffsetColor: isDarkText
                                            ? "#1e1e1e"
                                            : "#ffffff",
                                    }}
                                    onClick={() => handleColorSelect(color)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Reset Button */}
                    <div className="pt-4">
                        <button
                            onClick={handleResetBackground}
                            className="w-full py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                            style={{
                                background: isDarkText
                                    ? "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)"
                                    : "linear-gradient(135deg, #5062f0 0%, #7c3aed 100%)",
                                color: isDarkText ? "#000000" : "#ffffff",
                                boxShadow: isDarkText
                                    ? "0 4px 12px rgba(255, 255, 255, 0.2)"
                                    : "0 4px 12px rgba(80, 98, 240, 0.4)",
                            }}
                        >
                            Reset to Default
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SettingsSidebar;
