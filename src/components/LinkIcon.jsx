import { useState } from "react";

function LinkIcon({ link }) {
    const domain = new URL(link.url).hostname;
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    const [imgError, setImgError] = useState(false);

    return (
        <div
            onClick={() => window.open(link.url, "_self")}
            className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-105 transition-all duration-200 overflow-hidden relative"
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
                    {link.name[0].toUpperCase()}
                </span>
            )}
        </div>
    );
}

export default LinkIcon;
