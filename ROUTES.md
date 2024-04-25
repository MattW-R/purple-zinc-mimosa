## Route Overview

### Get Companies

- **Route:** `GET /companies`
- **Description:** Retrieves companies based on specified query parameters.
- **Authentication:** Does not require authentication.

#### Query Parameters

- `limit` (number): The maximum number of companies to retrieve (default: 100, max: 1000, min: 0).
- `offset` (number): The number of companies to skip (default: 0, min: 0).
- `companyName` (string, optional): The name of the company to filter by.
- `activeStatus` (boolean, optional): The active status of the company (true or false).
- `employeeName` (string, optional): The name of an employee of the company to filter by.

#### Response

- **Success Response:**
    - **Status Code:** 200
    - **Content:** JSON object with success status, message, retrieved companies, and pagination information.

- **Error Responses:**
    - **Status Code:** 400
        - **Content:** JSON object with error message for invalid query parameters.
    - **Status Code:** 404
        - **Content:** JSON object with error message for not finding any companies.
    - **Status Code:** 500
        - **Content:** JSON object with error message for internal server error.

### Get Company

- **Route:** `GET /company/:ids`
- **Description:** Retrieves company information by IDs provided in the path parameters.
- **Authentication:** Does not require authentication.

#### Path Parameters

- `ids` (string): Comma-separated list of company IDs to retrieve information for.

#### Response

- **Success Response:**
    - **Status Code:** 200
    - **Content:** JSON object with success status, message, and retrieved company information.

- **Error Responses:**
    - **Status Code:** 400
        - **Content:** JSON object with error message for invalid path parameters.
    - **Status Code:** 404
        - **Content:** JSON object with error message for not finding the company.
    - **Status Code:** 500
        - **Content:** JSON object with error message for internal server error.
