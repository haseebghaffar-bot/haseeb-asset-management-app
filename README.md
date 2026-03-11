# Asset Management Application

A full-stack asset management application built with **Vue 3** and **AWS Amplify Gen 2**. This application allows authenticated users to securely manage their personal or organizational assets, upload images, and manage their profiles.

## Features

- **Secure Authentication:** User sign-up, sign-in, email verification, and password resets powered by Amazon Cognito.
- **Asset Management:**
  - Create, view, update, and delete assets.
  - Upload and manage asset images (stored in Amazon S3).
  - Search, filter (by category/status), and sort assets.
  - **Data Isolation:** Assets are strictly bound to the authenticated user. You can only view and mutate your own assets.
- **Profile Management:** Update display name, company, department, and upload an avatar.
- **Modern UI:** Built with Vue 3 (Composition API), Pinia for state management, Tailwind CSS for styling, Element Plus, and Headless UI for accessible components. Dark and Light mode support.

## Architecture & Tech Stack

This project was built following a specific cloud-native architectural pattern utilizing AWS Amplify Gen 2:

### Frontend
- **Framework:** Vue 3 (Vite + Composition API)
- **State Management:** Pinia
- **Routing:** Vue Router
- **Styling:** Tailwind CSS + Element Plus + Headless UI

### Backend (AWS Amplify Gen 2)
- **Authentication:** Amazon Cognito
- **API Layer:** AWS AppSync (GraphQL)
- **Business Logic:** AWS Lambda (`asset-handler` function) handles secure coordination between AppSync and the RDS database.
- **Data Storage:**
  - **Amazon RDS (MySQL):** Asset metadata is stored in a relational database using Sequelize ORM within the Lambda function.
  - **Amazon DynamoDB:** Stores user profiles and application metadata (automatically provisioned via AppSync).
  - **Amazon S3:** Stores user uploads including asset images and profile avatars.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or newer recommended)
- npm or yarn
- An active AWS Account configured with proper IAM permissions for Amplify Gen 2.

### Database Requirements
Because asset metadata is stored in RDS, you must have an existing MySQL RDS instance running and accessible. 

## Local Development Setup

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure AWS Amplify Backend**
   To deploy the backend to an isolated sandbox environment in your AWS account, run:
   ```bash
   npx ampx sandbox
   ```
   *Note: This will generate the `amplify_outputs.json` file required by the frontend to connect to your AWS resources.*

   If you already have a deployed backend environment, you can pull its outputs using:
   ```bash
   npx ampx generate outputs --profile <YOUR_AWS_PROFILE>
   ```

3. **Configure Environment Variables**
   Currently, the Lambda function connects to a MySQL database. Set up your RDS database credentials using the `.env` file or Amplify secrets configuration to ensure the `asset-handler` Lambda functions correctly.
   
   Example `.env` (used locally by verification scripts like `verify-db.js`):
   ```env
   DB_HOST=your-rds-endpoint.amazonaws.com
   DB_USER=admin
   DB_PASSWORD=yourpassword
   DB_NAME=your_database_name
   ```

4. **Setup Lambda Dependencies**
   The AWS Lambda function has its own isolated dependencies (like `sequelize` and `mysql2`). If you are modifying the Lambda locally, ensure you install them:
   ```bash
   cd amplify/functions/asset-handler/src
   npm install
   cd ../../../..
   ```

5. **Start the Frontend Development Server**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the local URL (usually `http://localhost:5173`).

## Project Structure

- `/src/` - Vue 3 Frontend source code
  - `/components/` - Reusable Vue components (Auth, Inventory, Layout, Settings)
  - `/pages/` - Main route views
  - `/stores/` - Pinia state management (auth, assets, ui)
  - `/api/` - API client wrappers for Auth, S3 Storage, and AppSync GraphQL calls
  - `/graphql/` - GraphQL queries and mutations definitions
- `/amplify/` - AWS Amplify Gen 2 backend definitions
  - `/auth/` - Cognito configuration
  - `/data/` - AppSync GraphQL schema (`resource.ts`)
  - `/storage/` - S3 bucket configuration and access rules
  - `/functions/asset-handler/` - Custom AWS Lambda Backend
    - Note: This directory contains its own `package.json`. It houses the critical business logic that securely connects your GraphQL API calls (AppSync) directly to your MySQL database via Sequelize.

## Deployment

This application is designed to be completely serverless and deployable via **AWS Amplify Hosting**.

Connecting the repository branch to Amplify Hosting in the AWS console will trigger a CI/CD pipeline that automatically deploys the Gen 2 backend resources and builds/hosts the Vue frontend.
