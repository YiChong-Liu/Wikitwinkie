## Image Management Service

### Author

Yichong Liu ([@YiChong_Liu](https://github.com/YiChong-Liu))

### Description

The Image Management Service handles uploading, getting, updating and deleting images.

### Service Interaction

The service interacts with the client directly to upload and get images.

### API Endpoints

- Get image
  - URL: /image/{name}
  - Method: GET
  - Response: 
    - 200 OK with image 
    - 404 NOT FOUND with a placeholder image if not found 
- Upload image
  - URL: /image/{name}
  - Method: PUT
  - Session cookie header required
  - Request Body: Multipart
    - Binary image data
    - Metadata JSON (TBD)
  - Response: 
    - 201 CREATED on success
    - 400 BAD REQUEST if not logged in
    - 400 BAD REQUEST if incomplete data
- Delete image
  - URL: /image/{name}
  - Method: DELETE
  - Session cookie header required
  - Response:
    - 200 OK on success
    - 400 BAD REQUEST if not logged in



### Tutorial

This service is best run along with all the other services using `docker compose build` and then `docker compose up` at the root level of this repository.

To run the service on its own, use `link_utils.sh` in the repository root first to link in the `utils` directory, then run `npm install` in the `image_management` directory, then run `npm start`. Note that the database needs to be running as well under the host name `image_managementsdb`, or this will fail.