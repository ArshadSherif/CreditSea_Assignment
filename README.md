# Credit Report Management System

A full-stack web application for uploading, processing, and managing XML credit reports. The system parses Experian XML files, extracts credit information, and provides a clean interface for viewing report data.

## Features

- **XML Upload & Processing**: Upload Experian XML credit reports with automatic parsing
- **Duplicate Detection**: Prevents duplicate entries based on PAN numbers
- **Report Management**: View all reports and individual report details
- **Responsive UI**: Clean, modern interface built with React
- **REST API**: Well-structured backend API with proper error handling
- **Data Validation**: Comprehensive validation and error handling
- **Testing**: Unit tests for services and controllers

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **xml2js** for XML parsing
- **Multer** for file uploads
- **Jest** for testing
- **Babel** for ES6+ support

### Frontend
- **React** with functional components
- **Axios** for HTTP requests
- **CSS3** for styling
- **File drag & drop** functionality

## Project Structure

```
backend/
├── config/
│   └── dbConnection.js          # MongoDB connection configuration
├── controller/
│   └── xmlController.js         # Request handlers for XML operations
├── middleware/
│   ├── errorHandler.js          # Global error handling middleware
│   └── logger.js               # Request logging middleware
├── models/
│   └── creditReport.js         # Mongoose schema for credit reports
├── routes/
│   └── xmlRoutes.js            # API route definitions
├── services/
│   └── xmlService.js           # Business logic for XML processing
├── tests/
│   ├── xmlController.test.js   # Controller unit tests
│   └── xmlService.test.js      # Service unit tests
├── utils/
│   └── xmlParser.js            # XML parsing utilities
├── server.js                   # Application entry point
└── package.json                # Dependencies and scripts
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload XML credit report file |
| `GET` | `/api/reports` | Get all credit reports |
| `GET` | `/api/reports/:id` | Get specific credit report by ID |

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/creditreports 
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev 
   ```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## Dependencies

### Production Dependencies
- **express** (^5.1.0) - Web framework for Node.js
- **mongoose** (^8.19.1) - MongoDB object modeling
- **mongodb** (^6.20.0) - MongoDB driver
- **multer** (^2.0.2) - Middleware for handling file uploads
- **xml2js** (^0.6.2) - XML to JavaScript object converter
- **cors** (^2.8.5) - Cross-Origin Resource Sharing middleware
- **dotenv** (^17.2.3) - Environment variable loader
- **nodemon** (^3.1.10) - Development server with auto-restart

### Development Dependencies
- **jest** (^30.2.0) - JavaScript testing framework
- **babel-jest** (^30.2.0) - Babel transformer for Jest
- **@babel/core** (^7.28.4) - Babel compiler core
- **@babel/preset-env** (^7.28.3) - Babel preset for environment-specific transforms
- **supertest** (^7.1.4) - HTTP assertions for testing
- **mongodb-memory-server** (^10.2.3) - In-memory MongoDB server for testing

## Usage

### Uploading XML Reports

1. Navigate to the upload page
2. Drag and drop an XML file or click to select
3. Click "Upload" to process the file
4. The system will parse the XML and save the credit report data

### Viewing Reports

1. Go to the reports list page
2. Browse all uploaded reports
3. Click on any report to view detailed information
4. View basic details, report summary, and credit accounts

## Data Structure

The application processes XML files and extracts the following information:

### Basic Details
- Name (First + Last)
- Mobile Phone Number
- PAN (Permanent Account Number)
- Credit Score

### Report Summary
- Total Accounts
- Active/Closed Accounts
- Current Balance Amount
- Secured/Unsecured Account Amounts
- Recent Credit Enquiries

### Credit Accounts
- Bank Name
- Account Number & Type
- Current Balance
- Amount Overdue
- Address Information

## Testing

Run the test suite:

```bash
# Run all tests
npm test

```

The test suite includes:
- Unit tests for `xmlService` functions
- Integration tests for `xmlController` endpoints
- Mocked database operations
- Error handling scenarios

## Key Components

### XML Parser (`utils/xmlParser.js`)
The `parseExperianXML` function handles:
- Reading XML files from the filesystem
- Parsing XML structure with xml2js
- Extracting and formatting credit report data
- Handling nested XML structures and arrays

### Service Layer (`services/xmlService.js`)
Business logic including:
- `processXMLUpload` - Process uploaded files
- `getAllReports` - Retrieve all reports
- `getReportByIdService` - Get specific reports
- Duplicate detection based on PAN numbers

### Database Schema (`models/creditReport.js`)
MongoDB document structure with embedded schemas for:
- Basic applicant details
- Report summary statistics
- Array of credit accounts with full details

## Error Handling

The application includes comprehensive error handling:

- **File Validation**: Checks for uploaded files
- **Duplicate Prevention**: PAN-based duplicate detection
- **Database Errors**: Proper error responses for DB operations
- **Global Error Handler**: Centralized error handling middleware
- **Automatic Cleanup**: Removes uploaded files after processing

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | Required |
| `VITE_API_BASE_URL` | Deployed backend URL | Required |


## Development Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run test suite with Jest
```
