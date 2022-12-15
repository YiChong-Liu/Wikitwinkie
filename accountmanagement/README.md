# Account Management Service

### Author

Yichong Liu ([@YiChong_Liu](https://github.com/YiChong-Liu))

### Description

The account management service allows the users to:

- create an **unique** username 
- create and change password
- delete account

### Service Interaction

The account management service will interact with the sessions management service: After the user creates an account with an unique username and logs into the application automatically,  a session with a random session id will be created and sent to the client to store the cookies.

### API Endpoints

- Create User
  - URL: /createUser
  - Method: POST
  - Request body: { "username": string, "password": string }
  - Response: 
    - 200 OK {"success": true, "username": string, "sessionId": string}
    - 200 OK {"success": false, "error": string} if the username is taken
    - 400 BAD REQUEST if incomplete data
- Edit User
  - URL: /editUser
  - Method: POST (Session cookie header required)
  - Request body: { "password": string }
  - Response: 
    - 204 NO CONTENT on success
    - 400 BAD REQUEST if incomplete data
    - 404 NOT FOUND Invalid username
    - 400 BAD REQUEST if not logged in
- Delete User
  - URL: /delete?user={username}
  - Method: POST (Session cookie header required)
  - No request body
  - Response: 
    - 204 NO CONTENT on success
    - 400 BAD REQUEST if not logged in
    - 403 FORBIDDEN if username is not their own
- Check password (called by session management service, not browser, important not to expose)
  - URL: /checkpassword
  - Method: POST
  - Request body: {"username": string, "password": string}
  - Response:
    - 200 OK {"success": boolean}

### Tutorial

This service is best run along with all the other services using `docker compose build` and then `docker compose up` at the root level of this repository.

To run the service on its own, use `link_utils.sh` in the repository root first to link in the `utils` directory, then run `npm install` in the `accountmanagement` directory, then run `npm start`. Note that the database needs to be running as well under the host name `accountmanagementdb`, or this will fail.
