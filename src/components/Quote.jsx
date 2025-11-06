/* global chrome */
import axios from "axios";
import { useEffect, useState } from "react";
import { useFocusStore } from "../store/useFocusStore";

function Quote() {
    const { isDarkText } = useFocusStore();
    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        chrome.storage.sync.get(["dailyQuote", "quoteTimestamp"], (data) => {
            const now = Date.now();

            if (
                data.dailyQuote &&
                now - data.quoteTimestamp < 12 * 60 * 60 * 1000
            ) {
                // Use cached quote
                setQuote(data.dailyQuote.content);
                setAuthor(data.dailyQuote.author);
                setLoading(false);
            } else {
                // Fetch a new quote from ZenQuotes
                axios
                    .get("https://zenquotes.io/api/random")
                    .then((res) => {
                        const quoteData = res.data[0];
                        const content = quoteData.q;
                        const author = quoteData.a;

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
                    .finally(() => setLoading(false));
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
        </div>
    );
}

export default Quote;
