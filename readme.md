# Webhook Management System

This project is a full-stack application for managing webhooks, including user authentication, webhook subscription, and event handling. The backend is built using Express.js, and the frontend is developed with React.js.

## Installation

### React Js

1. Install
2. Create .env
3. Paste content of env file share in .env
4. npm install --force
5. npm start

## Architecture

- React.js: Selected for building a responsive and interactive user interface.
- Axios: Used for making HTTP requests to the backend API.

## Design

#### User Authentication

- Implemented using JWT to securely authenticate users and manage sessions. This ensures that only authenticated users can subscribe to and manage

#### Webhook Subscription and Event Handling

- Users can subscribe to webhooks by providing a source URL and a callback URL. Events received from the source URL are filtered, processed, and forwarded to the callback URL.

#### Dashboard

- A user-friendly dashboard is provided to view and manage subscribed webhooks and events. This improves the user experience and simplifies webhook management.
