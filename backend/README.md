# Hospital Management System Backend

## Overview
This project aims to develop the backend for a digitalized hospital system using RFID technology to enhance patient care and hospital operations. The backend will handle patient registration, digital case sheets, and integration with other hospital systems.

## Repository Structure
    hospital-management-be/
    ├── config/
    │ └── db.js
    ├── controllers/
    │ └── patientController.js
    ├── models/
    │ └── Patient.js
    ├── routes/
    │ └── patientRoutes.js
    ├── middleware/
    │ └── authMiddleware.js
    ├── utils/
    │ └── 
    ├── .env
    ├── server.js
    └── package.json


- **config/**: Database configuration and connection setup.
- **controllers/**: Logic for handling requests and interacting with models.
- **models/**: Database schemas and models.
- **routes/**: API endpoints and route definitions.
- **middleware/**: Middleware for authentication and other reusable logic.
- **utils/**: Utility functions, including RFID integration.
- **.env**: Environment variables configuration.
- **server.js**: Main server setup and entry point.

## Coding Best Practices

### General Guidelines
1. **Consistency**: Follow consistent coding styles and conventions.
2. **Modularity**: Write modular, reusable, and maintainable code. Avoid large, monolithic functions.
3. **Documentation**: Comment your code and write clear, concise documentation. Each function should have a brief description of its purpose and parameters.
4. **Version Control**: Use meaningful commit messages. Commit frequently to keep changes small and manageable.

### JavaScript/Node.js Practices
1. **Variables and Functions**:
   - Use `const` for constants and `let` for variables that will be reassigned.
   - Use arrow functions for anonymous functions.
2. **Promises and Async/Await**:
   - Use `async/await` for asynchronous code instead of chaining promises.
   - Handle errors using try/catch blocks in async functions.
3. **Error Handling**:
   - Always handle errors gracefully and provide meaningful error messages.
   - Use a global error handler to catch and log unhandled exceptions.
4. **Environment Variables**:
   - Store sensitive information and configuration in the `.env` file. Do not hardcode sensitive data in your codebase.
   - Use the `dotenv` package to load environment variables.

### Database Practices
1. **Schema Design**:
   - Design database schemas to ensure data integrity and efficient querying.
   - Use appropriate data types and constraints to enforce business rules.
2. **Migrations**:
   - Plan for database migrations to handle schema changes. Use tools like Sequelize for managing migrations.
3. **Indexing**:
   - Create indexes to optimize query performance, especially on frequently queried fields.

### Git Workflow
1. **Branches**:
   - Use feature branches for new features (`feature/feature-name`).
2. **Direct Changes**: Collaborators can directly make changes to the repository.
3. **Commit Messages**:
   - Use clear, descriptive commit messages. Commit frequently to keep changes small and manageable.

## Setting Up the Development Environment
1. **Clone the Repository**
   ```bash
   git clone https://github.com/TinkerersLabIITH/hospital-management-be.git
   cd hospital-management-be

2. **Install Dependencies**
    ```bash
    npm install

3. **Configure Environment Variables**
    - Create a .env file in the root directory and add the necessary environment variables:
    ```bash
    MONGO_URI=your_mongodb_connection_string
    PORT=5000
    JWT_SECRET=your_jwt_secret

4. **Run the server**
    ```bash
    npm start

## Useful Scripts
- `npm start`: Starts the server using `nodemon`.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run lint:fix`: Lints the codebase and fixes linting errors.
- `npm run format`: Formats the codebase using Prettier.
- `npm run format:check`: Checks the codebase for formatting errors.

## Contribution Guidelines
1. **Create a Branch** : Create a new branch for your feature.
    ```bash
    git checkout -b feature/feature-name

2. **Commit Changes**: Make your changes and commit them with clear, descriptive commit messages. Before committing, ensure you lint and format your code.
    ```bash
    git add .
    git commit -m "Add feature/feature-name"

3. **Push Changes**: Push your chnages to the remote repository.
    ```bash
    git push origin feature/feature-name

4. **Submit Pull Request**: Submit a pull request to the main repository with a description of your changes.

