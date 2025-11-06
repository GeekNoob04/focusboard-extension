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
            className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-105 transition-all duration-200 overflow-hidden relative cursor-pointer"
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
