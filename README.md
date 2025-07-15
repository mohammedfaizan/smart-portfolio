# 📈 Smart Portfolio Assistant

A modern, lightweight web application that allows users to **track their investments**, **visualize portfolio distribution**, and intelligently adapt to **network conditions**.

Built with **React** and **Tailwind CSS**, the app showcases practical use of modern **Web APIs** to enhance user experience, even in low-data environments.

---

## 🚀 Live Demo

🔗 [Live Link (Netlify)](https://smart-investment-portfolio.netlify.app)

---

## ✨ Features

- ✅ Add and track investments (e.g., stocks, crypto, mutual funds)
- 📊 Visualize your portfolio as a **pie chart** using the Canvas API
- 🌐 Detect slow networks and enable **Low-Data Mode** via the Network Information API
- 🔁 Simulate background syncing of data every 15 seconds using Background Tasks (via `setInterval`)
- 🎯 Responsive and mobile-friendly interface with Tailwind CSS

---

## 🧪 Web APIs Used

| API                                     | Usage                                                                |
| --------------------------------------- | -------------------------------------------------------------------- |
| 🖼️ **Canvas API**                       | Draws the pie chart to represent investment distribution             |
| 🌐 **Network Information API**          | Detects slow networks or data saver mode and adapts UI accordingly   |
| 🔄 **Background Tasks API** (simulated) | Periodic syncing or recalculating total investment in the background |

---

## 🧱 Tech Stack

- ⚛️ React (Functional Components + Hooks)
- 🎨 Tailwind CSS
- 🌍 Native Web APIs (no chart libraries)
- 🗂️ Local state (optionally persisted with `localStorage`)

---

## 📂 Project Structure

```
src/
├── components/
│   ├── InvestmentForm.jsx
│   ├── PieChart.jsx
│   └── NetworkStatus.jsx
├── App.jsx
├── index.js
└── index.css
```

---

## 🛠️ How to Run Locally

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/smart-portfolio-assistant.git
cd smart-portfolio-assistant
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. Open `http://localhost:5173` in your browser
