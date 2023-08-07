Checklist for Backend Tasks (Node.js):
1. Set up a backend server using Node.js. ✅
2. Implement API endpoints for user authentication, data retrieval, and data manipulation.(testing done using postman) ✅
3. Connect to the Firebase project for the database. ✅
4. Implement data validation and error handling. ✅
5. Implement security measures such as authentication and authorization. ✅
6. Connected new MVC model to the backend. ✅


## Backend Data Model:
1. Video Model
This Model is used to store the video data in the database. The video data is stored in the form of a JSON object. The JSON object contains the following fields:

| Field          | Type           | Description                                               |                   |
| -------------- | -------------- | --------------------------------------------------------- | ----------------- |
| uid/id         | String/Int     | The unique ID of the video.                               | Auto-generated    |
| title          | String         | The title of the video.                                   | mandatory         |
| therapistId    | String         | The username of the therapist who the video was asked to. | optional          |
| userId         | String         | The username of the user who the video was created.       | optional          |
| UserVideo      | String         | The URL of the video.                                     | optional          |
| therapistVideo | String         | The URL of the video.                                     | optional          |
| createdAt      | Timestamp      | The timestamp when the video was created.                 | Auto-generated    |


This data model is designed in a way that both the users and the therapists can access the data.
The user can access the data of the videos that they have created and the therapist can access the data of the videos that they have been asked to review. 
The data model is designed in a way that it can be easily extended to add more fields in the future. 
It is a super collection of all the videos that are created by the users and the therapists.

2. User Model
This Model is used to store the user data in the database. The user data is stored in the form of a JSON object. The JSON object contains the following fields:

| Field       | Type   | Description                                 |
| ----------- | ------ | ------------------------------------------- |
| userID      | Int    | unique id for each user                     |
| username    | String | The username of the therapist.              |
| profilePic  | String | The URL of the therapist's profile picture. |

In this model, the userID, username are mandatory fields, But the profile picture is optional, as the user can choose to not upload a profile picture, it is optional in a thought of he can upload it later once he logs in and wants to create his user profile.
As of now the user has no authentication created not implemented, so the user profile is not connected to the video model, but once the authentication is created, the user profile will be connected to the video model, so that the user can access the videos that he has created.

3. Therapist Model
This Model is used to store the therapist data in the database. The therapist data is stored in the form of a JSON object. The JSON object contains the following fields:

| Field      | Type   | Description                                             |
| ---------- | ------ | ------------------------------------------------------- |
| userID     | Int    | unique id for each therapist                            |
| username   | String | The username of the therapist.                          |
| profilePic | String | The URL of the therapist's profile picture.             |
| keywords   | Array  | An array of keywords that the therapist specializes in. |

In this model also, the userID, username are mandatory fields, But the profile picture and keywords are optional, as the user can choose to not upload a profile picture and keywords, it is optional in a thought of he can upload it later once he logs in and wants to create his user profile.
As of now the therapist has no authentication created not implemented, so the therapist profile is not connected to the video model, but once the authentication is created, the therapist profile will be connected to the video model, so that the therapist can access the videos that he has been asked to review.



- Backend:
  - Node.js
  - Express.js
  - Firebase Admin SDK
  - body-parser
  - cors
  - dotenv
  - multer
  - nodemon
  - uuid
