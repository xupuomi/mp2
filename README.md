# TMDB Explorer

A React TypeScript application for exploring movies and TV shows using The Movie Database (TMDB) API.

## Features

- **Gallery View**: Browse trending movies and TV shows with filters for genre and media type
- **Search View**: Search for specific movies and TV shows with sorting options
- **Detail View**: View detailed information about movies and TV shows with navigation between items
- **Responsive Design**: Works on desktop and mobile devices

## Components Structure

```
src/
├── api/
│   └── tmdb.ts        # axios instance & API calls
├── components/
│   ├── SearchBar.tsx  # reusable search bar (filter as you type)
│   ├── SortControls.tsx # dropdowns/buttons for sorting
│   ├── GalleryFilter.tsx # checkboxes or dropdown for genres/media type
│   └── CardItem.tsx   # reusable card for list/gallery items
├── pages/
│   ├── ListView.tsx   # search results with sorting
│   ├── GalleryView.tsx # trending media w/ filters
│   └── DetailView.tsx # detail page w/ prev/next
├── App.tsx            # routes
├── index.tsx
└── types/
    └── tmdb.d.ts      # TypeScript interfaces for TMDB responses
```

## Setup Instructions

### 1. Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- TMDB API key

### 2. Get TMDB API Key
1. Go to [The Movie Database](https://www.themoviedb.org/)
2. Create an account if you don't have one
3. Go to Settings > API
4. Request an API key (free for non-commercial use)

### 3. Installation
1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
4. Edit `.env` file and add your TMDB API key:
   ```
   REACT_APP_TMDB_API_KEY=your_actual_api_key_here
   ```

### 4. Run the Application
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
