import { create } from "zustand";

/* global chrome */

export const useFocusStore = create((set, get) => ({
    // --- STATES ---
    username: "",
    links: [],
    bgColor: "#e8edfc",
    bgImage: "",
    isDarkText: false,
    accentColor: "#5062f0",
    isLoading: true,

    // --- ACTIONS ---
    setUsername: (username) => {
        set({ username });
        chrome.storage.sync.set({ username });
    },

    setLinks: (links) => {
        set({ links });
        chrome.storage.sync.set({ links });
    },

    addLink: (link) => {
        let url = link.url.trim();

        if (!/^https?:\/\//i.test(url)) {
            url = "https://" + url;
        }

        try {
            new URL(url);
        } catch (error) {
            console.error("Invalid URL:", error);
            alert(
                "⚠️ Please enter a valid website URL (e.g. https://example.com)"
            );
            return;
        }

        const safeLink = { ...link, url };
        const updated = [...get().links, safeLink];
        set({ links: updated });
        chrome.storage.sync.set({ links: updated });
    },

    deleteLink: (index) => {
        const updated = get().links.filter((_, i) => i !== index);
        set({ links: updated });
        chrome.storage.sync.set({ links: updated });
    },

    setBgColor: (color) => {
        set({ bgColor: color, bgImage: "" });
        chrome.storage.sync.set({ bgColor: color, bgImage: "" });
    },

    setBgImage: (img) => {
        set({ bgImage: img });
        chrome.storage.sync.set({ bgImage: img });
    },

    setIsDarkText: (dark) => {
        set({ isDarkText: dark });
        chrome.storage.sync.set({ isDarkText: dark });
    },

    setAccentColor: (accent) => {
        set({ accentColor: accent });
        chrome.storage.sync.set({ accentColor: accent });
    },

    hydrateFromStorage: () => {
        chrome.storage.sync.get(
            [
                "username",
                "links",
                "bgColor",
                "bgImage",
                "isDarkText",
                "accentColor",
            ],
            (data) => {
                set({
                    username: data.username || "",
                    links: data.links || [],
                    bgColor: data.bgColor || "#e8edfc",
                    bgImage: data.bgImage || "",
                    isDarkText: data.isDarkText || false,
                    accentColor: data.accentColor || "#5062f0",
                });
            }
        );
        set({ isLoading: false });
    },
}));
