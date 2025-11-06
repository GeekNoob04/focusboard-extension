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
                className="text-xs mt-4 animate-pulse"
                style={{
                    color: isDarkText
                        ? "rgba(255, 255, 255, 0.5)"
                        : "rgba(0, 0, 0, 0.4)",
                }}
            >
                Loading quote...
            </div>
        );
    }

    return (
        <div className="mt-4 max-w-xl mx-auto px-4">
            <div
                className="backdrop-blur-md rounded-xl p-4 shadow-lg border"
                style={{
                    backgroundColor: isDarkText
                        ? "rgba(255, 255, 255, 0.04)"
                        : "rgba(255, 255, 255, 0.5)",
                    border: `1px solid ${
                        isDarkText
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.08)"
                    }`,
                }}
            >
                <p
                    className="text-sm italic font-light leading-relaxed"
                    style={{
                        color: isDarkText
                            ? "rgba(255, 255, 255, 0.9)"
                            : "rgba(0, 0, 0, 0.8)",
                    }}
                >
                    "{quote}"
                </p>

                <p
                    className="text-xs mt-2 font-medium"
                    style={{
                        color: isDarkText
                            ? "rgba(255, 255, 255, 0.6)"
                            : "rgba(0, 0, 0, 0.5)",
                    }}
                >
                    — {author}
                </p>
            </div>
        </div>
    );
}

export default Quote;
