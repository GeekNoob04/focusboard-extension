/* global chrome */
import axios from "axios";
import { useEffect, useState } from "react";

function Quote() {
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
            <div className="text-gray-500 text-sm mt-4 animate-pulse">
                Fetching your quote...
            </div>
        );
    }
    return (
        <div className="mt-8 max-w-xl text-center">
            <p className="text-lg italic text-gray-700">“{quote}”</p>
            <p className="text-sm text-gray-500 mt-1">— {author}</p>
        </div>
    );
}
export default Quote;
