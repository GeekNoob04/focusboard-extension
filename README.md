# FocusBoard 🚀

A customizable new tab page Chrome extension designed to enhance focus and productivity. FocusBoard provides a clean and personalized dashboard with key information at a glance, including the current time, a customizable list of links, a daily quote, and a settings sidebar for personalization. It solves the problem of distracting new tab pages by offering a focused and efficient starting point for browsing.

## 🌟 Key Features

- **Customizable Links:** Add, delete, and manage your frequently visited websites for quick access. 🔗
- **Time Display:** Always know the current time with a prominently displayed clock. ⏰
- **Daily Quote:** Get inspired with a new quote each day. 💬
- **Background Customization:** Set a background color or image to personalize your new tab page. 🎨
- **Text Color Adjustment:** The text color automatically adjusts based on the background to ensure readability. 👓
- **Settings Sidebar:** Easily access and modify application settings. ⚙️
- **Search Functionality:** Quickly search the web using the Chrome Search API or a fallback Google search. 🔍
- **Data Persistence:** Your settings and links are saved and restored across sessions using Chrome's storage API. 💾

## 🛠️ Tech Stack

| Category    | Technology               | Description                                                              |
|-------------|--------------------------|--------------------------------------------------------------------------|
| Frontend    | React                    | JavaScript library for building user interfaces                         |
|             | React DOM                | Provides DOM-specific methods for React                                  |
|             | Tailwind CSS             | Utility-first CSS framework for styling                                  |
| State Management | Zustand                  | Minimalist state management library                                    |
| API         | Chrome Extension API     | For storage and search functionality                                     |
| HTTP Client | Axios                    | Promise-based HTTP client for making API requests                        |
| Build Tool  | Vite                     | Build tool for modern web development                                    |
| Plugins     | @vitejs/plugin-react     | Vite plugin for React support                                            |
|             | @tailwindcss/vite        | Vite plugin for Tailwind CSS integration                                 |
|             | @types/chrome            | TypeScript definitions for the Chrome browser extension API              |
| Utilities   | isDarkColor.js           | Determines if a given color is dark                                      |
|             | getAccentColor.js        | Returns an appropriate accent color based on the background color        |

## 📦 Getting Started

### Prerequisites

-   Node.js (>=16)
-   npm or yarn

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/GeekNoob04/focusboard-extension
    cd focusboard
    ```

2.  Install dependencies:

    ```bash
    npm install # or yarn install
    ```

### Running Locally

1.  Build the project:

    ```bash
    npm run build # or yarn build
    ```

2.  Load the extension in Chrome:
    -   Open Chrome and go to `https://chromewebstore.google.com/detail/focusboard/bjpogkbhfgaklhieoiaepibminlehdol?authuser=1&hl=en`.
    -   Enable "Developer mode" in the top right corner.
    -   Click "Load unpacked" and select the `dist` directory in your project folder.

## 💻 Project Structure

```
focusboard/
├── src/
│   ├── components/
│   │   ├── LinkIcon.jsx
│   │   ├── Quote.jsx
│   │   ├── SettingsSidebar.jsx
│   ├── store/
│   │   ├── useFocusStore.js
│   ├── utils/
│   │   ├── isDarkColor.js
│   │   ├── getAccentColor.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
├── vite.config.js
├── package.json
├── README.md
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request.
## 📬 Contact

If you have any questions or suggestions, feel free to contact me at [harshitbudhraja0@gmail.com](mailto:harshitbudhraja0@gmail.com).

## 💖 Thanks

Thank you for checking out FocusBoard! I hope it helps you stay focused and productive.

This is written by [readme.ai](https://readme-generator-phi.vercel.app/).
