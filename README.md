## Table of Contents
- [Diall-Assessment](#diall-assessment)
  - [Technologies Used](#technologies-used)
  - [Getting Started](#getting-started)
  - [Features](#features)
    - [Features can be added in future:](#features-can-be-added-in-future)
  - [Action Plan:](#action-plan)
# Diall-Assessment

Diall is a revolutionary mobile app that aims to empower individuals to take control of their mental health. The mission is to provide users with the resources, support, and community they need to understand and cope with mental health challenges, ultimately promoting healthy mental well-being. With Diall, users can find a safe space to connect with others who are facing similar struggles, access educational resources, and track their progress on their mental health journey.

## Technologies Used

The Diall app leverages the following technologies to deliver a seamless and user-friendly experience:

Frontend: The frontend of the Diall app is developed using React Native and Expo. It provides a cross-platform solution for building native mobile applications.

Backend: The backend of the Diall app is built using Node.js, Express.js, and Firebase Admin SDK. These technologies enable the handling of user data, authentication, and communication with the frontend.

## Getting Started
To run the Diall app on your local machine, follow these steps:

Clone the Diall repository from GitHub: git@github.com:Sowri19/Diall-Assessment.git.

Navigate to the frontend and backend folders separately in your terminal.

For each folder, install the required dependencies using the following command:

- npm/yarn install

Start the frontend and backend servers using the following commands:

Backend:
- nodemon app.js

Frontend:
- yarn start
- yarn android
- yarn ios
- yarn web

The frontend will generate a QR code that can be scanned using the Expo Go app on your mobile device to test the app on a physical device or use the web option for testing in a web browser.

Start exploring Diall's features!

Navigate to backend or frontend folder and check the readme file for more information.

## Features
- Personalized Home Feed: Upon logging in, users are presented with a personalized home feed that includes helpful mental health content

- Video Recording and Upload: Diall allows users to record and upload videos to share their emotions, experiences, and progress with their therapists, facilitating a more personalized therapy experience.
  
### Features can be added in future:
- Community Interaction: Diall fosters a sense of belonging and support through its community feature. Users can ask questions, share experiences, and provide support to others facing mental health challenges.

- Therapist Communication: Users can connect with certified therapists, schedule therapy sessions, and communicate with them in real-time for personalized guidance and support.

- Self-Assessment Tools: Diall offers a range of self-assessment tools that allow users to evaluate their mental health, identify areas of concern, and track their progress over time.

- Educational Resources: The app provides a comprehensive library of articles, videos, and podcasts related to various mental health topics, enabling users to expand their knowledge and coping strategies.

- Goal Setting and Trackers: Users can set mental health goals and utilize trackers to monitor their mood, sleep patterns, and other factors affecting their well-being.

 ## Action Plan:
1. Prioritizing the Features:
    - Based on the identified problems and their potential impact on the app, prioritizing the features in the following order:
        1. Content Categories(#hashtags) for Community Building(Eg: youtube content categories)
        2. Self-Assessment survey(can be editable after login)
        3. Educational Resources(more about the therapist, studies on mental health)
        4. Goal-Setting Feature (Mood {total, high point, low point} Comment about how you feel, How much you  slept, exercise, meditation)
        5. Rewards System( hook for consistent effort)
        6. Enhancing Video Playback (mute, like button, comments section)
        7. User Profile Verification (Valid Therapist/Account)
        8. Built-in Share History and Chat Functionality
        9. View Count for Videos
2. Collaboration with the Product Designer:
    - Working with the product designer to create wire frames and designs for the new features.
    - Collaborate on UI components, layout, colors consistency,  and overall user experience.
    - Ensuring that the designs align with the company's mission to empower users to take control of their mental health.
3. Mid-Level Engineer (Feature Implementation):
    - Feature 1: Content Categories for Community Building
        - Implement the feature to allow users to categorize their content based on the problem type.(just before sending the video, a user can put a hashtag before sending the video, it could add the categories)
        - Enable users to join and participate in specific community discussions.(this is just an idea)
    - Feature 2: Self-Assessment
        - Integrate self-assessment (questioner/selections) that provide users with insights into their mental health.
        - Store and track user assessment data for relevant content in the app
    - Feature 3: Educational Resources
        - Implement the display of educational resources (articles, videos, podcasts, which were published by therapist) related to specific mental health problems.
    - Feature 4: Goal-Setting Feature(habit tracking)
        - Create a goal-setting feature to allow users to set and track mental health goals.
    - Feature 6: Rewards System
        - Implement a rewards system that motivates users to complete tasks and progress towards their goals.
4. Junior Engineer (Enhancements and Bug Fixes):
    - Feature 7: Enhancing Video Playback
        - Implement mute functionality for videos and allow users to like videos.
        - Implement the comments section for users to engage with the video content.
        - Implement the flip camera, pause play after the recording ✅
    - Feature 8: User Profile Verification
        - Develop a verification process for therapists and user accounts.
        - Include a badge or mark to indicate verified accounts.
    - Feature 9: Built-in Share History and Chat Functionality
        - Integrate a chat feature for users to communicate with each other.
        - Create a share history section to track shared videos and content.
    - Feature 10: View Count for Videos
        - Implement a view count feature to show how many users watched each video.
5. Quality Assurance and Testing:
    - Conduct thorough testing on all new features and enhancements.
    - Address any bugs or issues identified during testing.
    - Ensure the app's performance and stability.
6. Regular Team Meetings and Communication:
    - Organize regular team meetings to discuss progress, challenges, and next steps.
    - Foster open communication between the team members to ensure smooth collaboration.