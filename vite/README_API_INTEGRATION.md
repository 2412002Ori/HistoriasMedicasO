# API Integration for Patient Management

## Overview
The patient management system has been updated to fetch data from the backend API instead of using hardcoded test data.

## Backend Requirements
- Backend server must be running on `http://localhost:3003`
- API endpoints available at `/api/pacientes`

## API Endpoints Used
- `GET /api/pacientes` - Get all patients
- `POST /api/pacientes` - Create new patient
- `GET /api/pacientes/:id` - Get patient by ID
- `PUT /api/pacientes/:id` - Update patient
- `DELETE /api/pacientes/:id` - Delete patient
- `GET /api/pacientes/cedula/:cedula` - Get patient by cedula
- `GET /api/pacientes/search/:term` - Search patients by name

## Files Modified

### 1. `src/config.js`
- Added `API_BASE_URL` configuration

### 2. `src/api/pacientes.js` (New)
- Centralized API utility functions for patient operations
- Error handling and response validation
- Reusable functions for all CRUD operations

### 3. `src/views/pacientes/pacientes_list_triaje.jsx`
- Removed hardcoded test data
- Added API integration with loading states
- Added error handling and user feedback
- Real-time search functionality
- Automatic list refresh after patient creation

### 4. `src/views/pacientes/pacientes_formulario.jsx`
- Updated to use centralized API utilities
- Added callback support for parent component refresh
- Improved error handling

## Features Added

### Loading States
- Shows loading spinner while fetching data
- Disables form submission during API calls

### Error Handling
- Displays user-friendly error messages
- Handles network errors and API errors
- Graceful fallbacks for missing data

### User Feedback
- Success notifications for successful operations
- Error notifications for failed operations
- Automatic list refresh after patient creation

### Search Functionality
- Real-time search by patient cedula
- Case-insensitive search
- Clear messaging when no results found

## Usage

### Starting the Backend
```bash
cd Oncologico-Hm-bakend
npm install
npm start
```

### Starting the Frontend
```bash
cd vite
npm install
npm run dev
```

### Using the Patient List
1. Navigate to the patient triage list
2. The list will automatically load patients from the backend
3. Use the search field to filter by cedula
4. Click the "+" button to add a new patient
5. The list will automatically refresh after adding a patient

## Data Structure
The API expects and returns patient data in the following format:

```javascript
{
  PACID: number,           // Patient ID (auto-generated)
  PACNOMBR: string,        // First name
  PACAPELL: string,        // Last name
  PACCEDUL: string,        // ID number
  PACFENAC: string,        // Birth date (YYYY-MM-DD)
  PACSEXO_: string,        // Gender (M/F)
  PACDIREC: string,        // Address
  PACTELEF: string,        // Phone
  PACEMAIL: string         // Email
}
```

## Error Handling
The system handles various error scenarios:
- Network connectivity issues
- Backend server errors
- Invalid data validation
- Duplicate patient creation attempts

All errors are displayed to the user with clear, actionable messages.

## Future Enhancements
- Add pagination for large patient lists
- Implement advanced search filters
- Add patient editing functionality
- Add patient deletion with confirmation
- Add export functionality
- Add bulk operations 