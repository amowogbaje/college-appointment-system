
# Appointment System API

A simple appointment scheduling system where students can book appointments with professors.

## Features

- **Student**: Register, view available time slots, book appointments.
- **Professor**: Register, cancel appointments.

## Tech Stack

- **Node.js** with **Express**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Supertest** for API testing

## Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/amowogbaje/appointment-system.git
   cd appointment-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the app:

   ```bash
   npm start
   ```

## API Endpoints

- **POST** `/api/users/register`: Register a user (student or professor)
- **POST** `/api/users/login`: Login and get a JWT token
- **GET** `/api/appointments/available/{professorId}`: View available slots
- **POST** `/api/appointments/book/{appointmentId}`: Book an appointment
- **DELETE** `/api/appointments/cancel/{appointmentId}`: Cancel an appointment (for professors)
- **GET** `/api/appointments/student`: View booked appointments (for students)

## Testing

Run tests with:

```bash
npm test
```

## License

MIT
