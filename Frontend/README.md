Implemented the watch view:
### Video Feed View (Watch Tab)
1. The main screen of the app displays the "Watch" tab with a video feed.
   - For swiping between the tabs, we used `react-native-swiper-flatlist` library for the smooth transition between the videos.
   - Adjusted the video container height, video height, that displays above the tab bar.
2. Each video in the feed displays its title and the username of the creator.
3. The video feed is presented in a vertical scroll view.
4. Users can swipe up on the video to view the next video in the feed.
5. The app uses the Expo AV library to play the videos with full-screen support.
6. Videos are automatically looped when they reach the end.
   
### Bottom Navigation Bar
1. The app includes a custom bottom navigation bar for easy navigation.
   - Utilized the `react-navigation/bottom-tabs` library to implement the bottom navigation bar.(replaced simple touchable `View` with `BottomTabBar` component)
   - TabNavigations are handled using VideoScreen.js file.
2. The navigation bar displays three tabs: "Watch," "Ask," and "Search."
3. Users can tap on the tabs to switch between different views.
4. The active tab is highlighted with a different color to indicate the current view.