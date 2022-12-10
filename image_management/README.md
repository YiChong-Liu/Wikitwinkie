## Image Management Service

### Author

Yichong Liu ([@YiChong_Liu](https://github.com/YiChong-Liu))

### Description

The Image Management Service handles uploading, getting, updating and deleting images, and managing metadata. Images can be inserted into articles.

### Service Interaction

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

- Update image metadata
  - URL: /update
  - Method: POST
  - Request body: {"name": string, "metadata": {TBD...}}
- Delete image
  - URL: /image/{name}
  - Method: DELETE
  - Session cookie header required
  - Response:
    - 200 OK on success
    - 400 BAD REQUEST if not logged in



### Tutorial