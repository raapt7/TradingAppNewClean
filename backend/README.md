# Trading App Backend

This is the backend server for the Trading App, providing authentication, user management, and (eventually) trade execution functionality.

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB or MongoDB Atlas account (for development)

### Installation

1. Clone the repository (if not already done)
2. Navigate to the backend directory:
```
cd /path/to/TradingAppNewClean/backend
```

3. Install dependencies:
```
npm install
```

4. Create a `.env` file in the root of the backend directory and add the following (customize as needed):
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1d
MONGODB_URI=mongodb://localhost:27017/trading-app
```

### Development

Start the development server:
```
npm run dev
```

### Testing

Run tests:
```
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user

### User
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `PUT /api/users/change-password` - Change password (protected)

## Future Endpoints (To Be Implemented)

### Wallet Management
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/deposit` - Deposit funds
- `POST /api/wallet/withdraw` - Withdraw funds
- `GET /api/wallet/transactions` - Get transaction history

### Trading
- `GET /api/trades` - Get user's trades
- `POST /api/trades` - Create a new trade
- `GET /api/trades/:id` - Get a specific trade
- `PUT /api/trades/:id` - Update a trade
- `DELETE /api/trades/:id` - Cancel a trade

## License

This project is proprietary and confidential. 