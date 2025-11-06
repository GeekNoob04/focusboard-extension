/* global chrome */
import axios from "axios";
import { useEffect, useState } from "react";

function Quote() {
    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
    const [loading, setLoading] = useState(true);
    const [isDarkText, setIsDarkText] = useState(false);

    useEffect(() => {
        chrome.storage.sync.get(["isDarkText"], (data) => {
            if (typeof data.isDarkText === "boolean") {
                setIsDarkText(data.isDarkText);
            }
        });
        const handleStorageChange = (changes, areaName) => {
            if (areaName === "sync" && changes.isDarkText) {
                setIsDarkText(changes.isDarkText.newValue);
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);
        return () =>
            chrome.storage.onChanged.removeListener(handleStorageChange);
    }, []);
    useEffect(() => {
        chrome.storage.sync.get(["dailyQuote", "quoteTimestamp"], (data) => {
            const now = Date.now();

            if (
                data.dailyQuote &&
                now - data.quoteTimestamp < 12 * 60 * 60 * 1000
            ) {
                setQuote(data.dailyQuote.content);
                setAuthor(data.dailyQuote.author);
                setLoading(false);
            } else {
                axios
                    .get("https://api.quotable.io/random")
                    .then((res) => {
                        const { content, author } = res.data;
                        setQuote(content);
                        setAuthor(author);

                        chrome.storage.sync.set({
                            dailyQuote: { content, author },
                            quoteTimestamp: now,
                        });
                    })
                    .catch(() => {
                        setQuote("Stay focused. Stay humble.");
                        setAuthor("FocusBoard");
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        });
    }, []);
    if (loading) {
        return (
            <div
                className={`text-sm mt-4 animate-pulse ${
                    isDarkText ? "text-gray-300" : "text-gray-500"
                }`}
            >
                Fetching your quote...
            </div>
        );
    }
    return (
        <div
            className="mt-8 max-w-xl text-center transition-colors duration-500"
            style={{ minHeight: "80px" }}
        >
            {loading ? (
                <div
                    className={`text-sm animate-pulse ${
                        isDarkText ? "text-gray-300" : "text-gray-500"
                    }`}
                >
                    Fetching your quote...
                </div>
            ) : (
                <>
                    <p
                        className={`text-lg italic transition-opacity duration-500 ${
                            isDarkText ? "text-gray-100" : "text-gray-700"
                        } ${loading ? "opacity-0" : "opacity-100"}`}
                    >
                        “{quote}”
                    </p>

                    <p
                        className={`text-sm mt-1 ${
                            isDarkText ? "text-gray-400" : "text-gray-500"
                        }`}
                    >
                        — {author}
                    </p>
                </>
            )}
        </div>
    );
}

export default Quote;
