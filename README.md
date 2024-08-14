# CarersHQ Chat and Appointment Management Application

This project is a web-based application designed to facilitate the management of chat conversations and appointments between users. It integrates various features such as messaging, appointment scheduling, and responsive design with the backend API endpoints provided by CarersHQ, making it a comprehensive tool for user interaction and management.

## Features

- **Chat Functionality**: Users can send and receive messages in real-time.
- **Appointment Scheduling**: Users can schedule appointments with others.
- **Appointment Management**: Users can accept or delete appointments, and view the status of each.
- **Responsive Design**: The application is optimized for various screen sizes.
- **Filter and View Appointments**: Appointments are categorized as Pending, Confirmed, and Deleted, with a specialized view for non-deleted appointments in the "All" tab.

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit
- **API**: Axios for handling HTTP requests
- **UI Components**: Custom Modal dialogs, styled with Tailwind CSS

## Installation

Follow these steps to set up the application locally:

1. **Clone the repository**:
   ```sh
   git clone https://github.com/deliteser112/carershq-chatapp-react-ts.git
   ```
2. **Navigate to the project directory**:
   ```sh
   cd carershq-chatapp-react-ts
   ```
3. **Install dependencies**:
   ```sh
   npm install
   ```
4. **Start the development server**:
   ```sh
   npm start
   ```

The application should now be running on [http://localhost:3000](http://localhost:3000).

## Usage

### Chat Section

- **Selecting a User**: Click on a user in the user list to view and send messages.
- **Sending a Message**: Type your message in the input box and click send.

### Appointments Section

- **Viewing Appointments**: Navigate to the "Appointments" tab to see appointments grouped by month and sorted by date.
- **Scheduling an Appointment**: Click "Schedule Appointment" to open the modal, select a user, date, and time, then confirm.
- **Accepting an Appointment**: Click "Accept" on pending appointments and confirm in the dialog.
- **Deleting an Appointment**: Click "Delete", then provide a reason in the prompt.

### Modal Dialogs

- **Confirmation Dialog**: Used for accepting or deleting appointments.
- **Prompt Input**: Collects a reason when deleting an appointment.

## API Endpoints

### Appointments:

- `POST /api/appointment/create`: Create a new appointment.
- `PUT /api/appointment/accept?appointmentId={id}`: Accept an appointment.
- `DELETE /api/appointment/delete`: Delete an appointment, requires ID and reason.

### Chats:

- `GET /api/chat/get-chats?userId={id}`: Fetch chat conversations for a user.
- `POST /api/chat/send-message`: Send a message in a chat.
- `GET /api/chat/receive-messages?chatId={id}&sinceId={id}`: Receive new messages.
- `GET /api/chat/historical-messages?chatId={id}&pageSize={size}&pageNumber={number}`: Get historical chat messages.

### Users:

- `GET /api/users/get-all`: Retrieve all users.

## Folder Structure

- `src/components/`: Contains all React components.
  - `appointments/`: Components for appointment management.
  - `chat/`: Components for chat functionality.
  - `common/`: Shared components like modals.
- `src/features/`: Redux slices for state management.
  - `appointments/`: Appointment slice.
  - `chat/`: Chat slice.
- `src/services/`: API service functions.
- `src/styles/`: Custom styles, primarily using Tailwind.
