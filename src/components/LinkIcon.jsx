import { useState } from "react";

function LinkIcon({ link }) {
    const [imgError, setImgError] = useState(false);

    let domain = "example.com";
    try {
        domain = new URL(link.url).hostname;
    } catch {
        console.warn("⚠️ Invalid URL skipped:", link.url);
    }

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    const handleClick = (e) => {
        e.preventDefault();

        try {
            new URL(link.url);

            if (e.metaKey || e.ctrlKey || e.button === 1) {
                window.open(link.url, "_blank");
            } else {
                window.open(link.url, "_self");
            }
        } catch {
            alert("⚠️ Invalid URL for this shortcut.");
        }
    };

    return (
        <div
            onClick={handleClick}
            onAuxClick={handleClick}
            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300 overflow-hidden relative cursor-pointer border border-white/20"
        >
            {!imgError ? (
                <img
                    src={faviconUrl}
                    alt={link.name}
                    onError={() => setImgError(true)}
                    className="w-6 h-6"
                />
            ) : (
                <span className="text-sm font-semibold text-[#5062f0]">
                    {link.name[0]?.toUpperCase() || "?"}
                </span>
            )}
        </div>
    );
}

export default LinkIcon;
