# HiCamp (Campgrounds)

![Status](https://img.shields.io/badge/Status-Live-success)

HiCamp is a full-stack web application that allows users to view, create, edit, and review campgrounds. Users can browse a comprehensive list of campsites, read detailed reviews, and contribute their own experiences. The application features user authentication, ensuring that only registered users can add new campgrounds or write reviews, while the author of a campground or review retains full control over editing and deleting their content.

## 🚀 Live Demo
**[View the Live Application](https://campgrounds-ihao.onrender.com)**

## ✨ Features
*   **User Authentication & Authorization:** Secure sign-up, login, and logout functionalities using Passport.js. Users can only edit or delete campgrounds and reviews they created.
*   **Campground Management:** Users can view a list of all campgrounds, add new ones, update existing details, and upload images.
*   **Interactive Maps:** Integration with Mapbox API to display a cluster map on the index page and exact locations on the campground show pages.
*   **Image Uploads:** Seamless image uploading and storage via Cloudinary, supporting multiple image uploads per campground.
*   **Reviews & Ratings:** Logged-in users can leave reviews and ratings for campgrounds.

## 🛠️ Tech Stack
*   **Frontend:** HTML5, CSS3, Bootstrap 5, EJS (Embedded JavaScript) templating engine.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB, Mongoose (ODM).
*   **Authentication:** Passport.js (Local Strategy).
*   **Cloud Services:** Cloudinary (Image hosting), Mapbox (Maps).

## 💻 Local Development

To get this project up and running locally on your machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd Campgrounds
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following keys:
    ```env
    NODE_ENV=development
    PORT=3000
    MONGODB_URI=<your-mongodb-atlas-uri>
    SECRET=<your-session-secret>
    CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
    CLOUDINARY_KEY=<your-cloudinary-key>
    CLOUDINARY_SECRET=<your-cloudinary-secret>
    MAPBOX_TOKEN=<your-mapbox-token>
    ```

4.  **Run the application:**
    ```bash
    npm start
    ```
    The application will run on `http://localhost:3000`.

## 📄 License
This project is open-source and available under the ISC License.
