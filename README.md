# InvSys - AI-Powered Inventory Management System

<p align="center">
  <img src="https://placehold.co/600x300/1e1b4b/ffffff?text=InvSys+Dashboard" alt="InvSys Dashboard Screenshot">
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjawadurrehman48%2FInvSys" target="_blank">
    <img src="https://vercel.com/button" alt="Deploy with Vercel"/>
  </a>
  <br>
  <img src="https://img.shields.io/badge/Next.js-14.x-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/AI-Gemini_API-purple?style=for-the-badge&logo=google-gemini" alt="Gemini API">
</p>

## 🚀 Introduction

**InvSys** is a modern, full-stack web application designed to simplify inventory management for small to medium-sized businesses. Built with a beautiful and responsive user interface, it provides a comprehensive suite of tools to track products, manage suppliers, and gain insights into your inventory data. The application is enhanced with AI-powered features using the Gemini API to provide intelligent suggestions and automate content creation.

This project was built from the ground up, starting with a simple concept and evolving into a feature-rich platform with authentication, multi-page navigation, data visualization, and AI integration.

**[➡️ View Live Demo](https://YOUR_VERCEL_DEPLOYMENT_LINK_HERE.vercel.app/)** _(Replace with your Vercel link)_

---

## ✨ Key Features

- **Secure Authentication:**
  - User registration with password validation (minimum 6 characters).
  - User login with persistent sessions ("Remember Me" functionality).
  - Sleek, modern authentication screen with a gradient and glassmorphism theme.

- **Interactive Dashboard (Home):**
  - Personalized welcome message and current date.
  - At-a-glance summary cards for key metrics (Total Products, Low Stock, etc.).
  - **Three distinct charts** for data visualization powered by Recharts:
    - **Bar Chart:** Stock quantity by category.
    - **Pie Chart:** Product distribution across categories.
    - **Line Chart:** Tracks product additions over time.
  - **AI-Powered Restock Suggestions:** Analyzes low-stock items and provides a prioritized list of what to restock first.

- **Comprehensive Inventory Management:**
  - Full CRUD (Create, Read, Update, Delete) functionality for products.
  - Search and pagination for easy navigation.
  - **AI-Generated Product Descriptions:** Automatically create engaging descriptions for your products using the Gemini API.

- **Supplier Management:**
  - Full CRUD functionality for suppliers.
  - Dedicated page to view and manage all supplier information.

- **User Profile Settings:**
  - Update user name and email.
  - **Change password** with current password verification.
  - **Upload and display a profile picture**, which updates instantly in the navbar.

- **Modern UI/UX:**
  - **Dark/White mode** toggle with persistence in local storage.
  - Fully responsive design for desktop, tablet, and mobile.
  - Professional and intuitive layout with clear navigation.
  - Animated components and modals for a smooth user experience.

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (with App Router), [React](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI:** [Google Gemini API](https://ai.google.dev/)
- **Deployment:** [Vercel](https://vercel.com/)

---

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/jawadurrehman48/InvSys.git](https://github.com/jawadurrehman48/InvSys.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd InvSys
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your Gemini API key:
    ```
    NEXT_PUBLIC_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🚀 Deployment

This application is optimized for deployment on [Vercel](https://vercel.com/).

1.  Push your code to a GitHub repository.
2.  Import the repository into Vercel.
3.  Add the `NEXT_PUBLIC_GEMINI_API_KEY` environment variable in the Vercel project settings.
4.  Click **Deploy**. Vercel will handle the rest!

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

