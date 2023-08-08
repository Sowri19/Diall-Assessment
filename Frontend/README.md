# Project Name

Diall Assessment

## Table of Contents
- [Project Name](#project-name)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Technologies Used](#technologies-used)
- [Implementation](#implementation)
  - [Watch Page](#watch-page)
    - [Video Feed Retrieval](#video-feed-retrieval)
    - [SwiperFlatList Implementation](#swiperflatlist-implementation)
    - [Video Playback](#video-playback)
    - [Play/Pause Functionality](#playpause-functionality)
    - [Share Functionality](#share-functionality)
    - [Interaction Icons](#interaction-icons)
    - [Video Metadata Display](#video-metadata-display)
    - [Pagination Management](#pagination-management)
    - [Video Swiping and Looping](#video-swiping-and-looping)
  - [Ask Page](#ask-page)
    - [Video Recording](#video-recording)
    - [Playback and Pause](#playback-and-pause)
    - [Video Title Overlay](#video-title-overlay)
    - [Video Upload](#video-upload)
    - [Random Popup Messages](#random-popup-messages)
    - [Permission Handling](#permission-handling)
    - [Used Libraries](#used-libraries)
    - [Navigation](#navigation)
    - [Styling](#styling)
    - [Backend Integration Improvement](#backend-integration-improvement)
  - [Tab Navigation](#tab-navigation)
    - [Tab Navigation Setup](#tab-navigation-setup)
    - [Tab Configuration](#tab-configuration)
    - [Tab Styling](#tab-styling)
    - [Watch Tab](#watch-tab)
    - [Ask Tab](#ask-tab)
    - [Search Tab](#search-tab)
    - [Header and Label Visibility](#header-and-label-visibility)
    - [Navigation Flow](#navigation-flow)
  - [Search Page](#search-page)
    - [Search Bar](#search-bar)
    - [Fetching and Displaying Search Results](#fetching-and-displaying-search-results)
    - [Therapist Information Display](#therapist-information-display)
    - [Ask Button](#ask-button)
    - [Search Functionality](#search-functionality)
    - [Styling](#styling-1)
    - [Navigation](#navigation-1)

## Getting Started
   Read the main README.md file for the instructions on how to run the project.
## Technologies Used
- Frontend:
  - React Native
  - Expo
  - @expo/vector-icons
  - @expo/webpack-config
  - @react-native-community/masked-view
  - @react-native-community/slider
  - @react-navigation/bottom-tabs
  - @react-navigation/native
  - @react-navigation/stack
  - axios
  - expo
  - expo-asset
  - expo-av
  - expo-camera
  - expo-constants
  - expo-linear-gradient
  - expo-sharing
  - expo-status-bar
  - expo-video-player
  - link
  - prop-types
  - react
  - react-dom
  - react-native
  - react-native-camera
  - react-native-gesture-handler
  - react-native-reanimated
  - react-native-safe-area-context
  - react-native-screens
  - react-native-snap-carousel
  - react-native-svg
  - react-native-swiper-flatlist
  - react-native-vector-icons
  - react-native-video
  - react-native-web
  - react-navigation

# Implementation

## Watch Page
### Video Feed Retrieval
- The component fetches the video feed from a server using an HTTP GET request.
- The videos are sorted based on the timestamp in descending order (newest first).

### SwiperFlatList Implementation
- The video feed is displayed using the `SwiperFlatList` component.
- This component allows users to swipe vertically through the video feed.
- The `SwiperFlatList` is set to be vertical and hides the pagination dots.

### Video Playback
- Each video item in the feed is represented by the `VideoItem` component.
- The `VideoItem` component includes a video player from Expo AV.
- Videos are set to loop continuously using the `isLooping` prop.

### Play/Pause Functionality
- The video play/pause state is managed within the `VideoItem` component.
- Tapping a video will toggle its play/pause state.

### Share Functionality
- Users can share a video by pressing the "paper-plane-outline" icon.
- The `handleSharePress` function is triggered, initiating the Share API.

### Interaction Icons
- Various interaction icons are displayed over each video.
- These icons include options for bookmarking, commenting, and liking a video.

### Video Metadata Display
- The title and user ID of each video are displayed at the bottom of the video container.
- This information is displayed in a semi-transparent container for readability.

### Pagination Management
- The `currentIndex` and `focusedIndex` state variables are managed with `useRef` and `useState`.
- `currentIndex` is used to keep track of the index of the video currently in view.
- `focusedIndex` is used to update the video item being focused after a swipe.

### Video Swiping and Looping
- The video swiping is handled using `onChangeIndex` and `onMomentumScrollEnd` events.
- When the last video is swiped, the carousel loops back to the first video.   
## Ask Page
### Video Recording
- The app allows users to record videos using the device's camera.
- The recording is limited to a maximum duration of 15 seconds.
- The user can start and stop the video recording using on-screen buttons.
- The recording progress is displayed with a countdown timer.

### Playback and Pause
- After recording a video, the user can preview it by playing it back.
- Playback functionality includes a play button and a pause button.

### Video Title Overlay
- When a user records a video, an overlay is displayed where they can enter a title for the video.
- The title input has a character limit of 40 characters.
- The title is mandatory before the user can proceed to upload the video.

### Video Upload
- After recording a video and providing a title, the user can upload the video to the server.
- The app sends a POST request to the server endpoint with the video and title data.
- Optional fields for therapist ID and user ID can be included in the upload.
- Upon successful upload, the user is navigated to the "Watch" page.

### Random Popup Messages
- The app displays random popup messages to the user.
- These messages are shown in a popup overlay with a close button.

### Permission Handling
- The app checks for camera and audio permissions on startup.
- If the permissions are not granted, appropriate messages are displayed.

### Used Libraries
- The app uses various libraries such as Expo Camera, Expo AV, and Expo Vector Icons.
- Additional libraries for navigation and bottom tabs are used.

### Navigation
- The app uses the `useNavigation` hook for navigation between screens.
- After successful video upload, the user is directed to the "Watch" page.

### Styling
- The app uses custom styles to layout and design the camera and video player views.
- Buttons and overlays are styled to provide a visually appealing user interface.

### Backend Integration Improvement
- The code includes a commented-out section for video upload to the backend.
- The video upload can be customized by adding therapist and user data.

## Tab Navigation
### Tab Navigation Setup
- The `TabNavigation` component sets up the bottom tab navigation using `createBottomTabNavigator`.

### Tab Configuration
- Three tabs are configured: "Watch," "Ask," and "Search."
- Each tab is associated with a corresponding component: `WatchPage`, `AskPage`, and `SearchPage`.

### Tab Styling
- The tab bar is styled using `tabBarStyle` to set its background color to black.
- The labels of the tabs are hidden using `tabBarShowLabel` to make the icons more prominent.
- The active tab icon color is set to white using `tabBarActiveTintColor`.
- The inactive tab icon color is set to semi-transparent white using `tabBarInactiveTintColor`.

### Watch Tab
- The "Watch" tab is associated with the `WatchPage` component.
- The tab icon is a custom icon named `WatchIcon`, which is passed the appropriate color and size props.

### Ask Tab
- The "Ask" tab is associated with the `AskPage` component.
- The tab icon is a custom icon named `AskIcon`, which is passed the appropriate color and size props.

### Search Tab
- The "Search" tab is associated with the `SearchPage` component.
- The tab icon is a custom icon named `SearchIcon`, which is passed the appropriate color and size props.

### Header and Label Visibility
- The header is hidden for each screen using `headerShown: false`.
- The labels for the tabs are hidden using `tabBarShowLabel: false`.

### Navigation Flow
- Users can switch between tabs to access different sections of the app, such as watching videos, asking questions, and searching content.


## Search Page

### Search Bar

- The search bar allows users to enter search terms to find therapists.
- Placeholder text guides users on what to search for.
- Users can clear the search term using the "x" button.

### Fetching and Displaying Search Results

- The app fetches therapist data from the server using the Axios library and the provided API endpoint.
- Therapists whose names start with the search term are filtered and displayed as search results.
- The search results are shown in a stacked horizontal layout.
- Each search result displays the therapist's profile image, username, and keywords.

### Therapist Information Display

- A round profile image is displayed beside the therapist's name and keywords.
- The therapist's name is displayed in a larger, bold font to emphasize it.
- Keywords associated with the therapist are displayed below their name.

### Ask Button

- Each therapist search result has an "Ask" button.
- When the "Ask" button is pressed, the user is navigated to the "Ask" page.

### Search Functionality

- The therapist search is case-insensitive, allowing users to search for therapists regardless of the case used.
- As the user types in the search bar, the app dynamically updates the search results.

### Styling

- Custom styles are used to layout and design the search bar and search results.
- The search bar has a light grey background and is placed at the top of the page.
- The search results are displayed below the search bar with appropriate spacing and borders.
- The "Ask" button is styled with a green background and white bold text.

### Navigation

- The app uses the `useNavigation` hook from the `@react-navigation/native` library to navigate to the "Ask" page when the "Ask" button is pressed.
