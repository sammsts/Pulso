# TimePunch Frontend

This is the frontend application for the **TimePunch** system — a real-time employee punch clock system that allows users to register, view, edit, and delete time punches either automatically (using geolocation) or manually.

## 🌐 Technologies

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [React Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenCage Geocoder API](https://opencagedata.com/)
- [TypeScript](https://www.typescriptlang.org/)

## 🚀 Features

- Automatic punch with geolocation and reverse geocoding
- Manual punch entry with time and type (in/out)
- Edit existing punches
- Delete punches
- View punches of the current day
- UI feedback with loading and error states
- Token-based authentication via cookies

---

## 🧠 Architecture Notes

- Uses **React Query** for efficient data fetching and caching.
- Punch registration API calls:
  - `POST /punches` – Register a new punch
  - `PUT /punches/{id}` – Update an existing punch
  - `DELETE /punches/{id}` – Delete a punch
- Geolocation is retrieved via the **browser's Geolocation API** and reverse geocoded using the **OpenCage API**.
- Authentication token (`accessToken`) is stored and accessed via **cookies**, using the [`js-cookie`](https://www.npmjs.com/package/js-cookie) library.


