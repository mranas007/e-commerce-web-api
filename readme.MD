# eCommerce Web API & Frontend

## Overview

This is a fullstack eCommerce project with:
- **Backend:** ASP.NET Core Web API using Clean Architecture (Application, Domain, Infrastructure, Host layers)
- **Frontend:** React (Vite) with Tailwind CSS

## Project Structure

```
eCommerceWebApi/
│
├── backend/
│   ├── eCommerceApp.Application/   # Application services, DTOs, use cases
│   ├── eCommerceApp.Domain/        # Domain entities, interfaces, business logic
│   ├── eCommerceApp.Infrastructure/# Data access, external services, persistence
│   └── eCommerceApp.Host/          # API layer (endpoints, HTTP requests)
│
└── frontend/
    ├── src/                        # React source code (components, pages, utils)
    ├── public/                     # Static assets
    ├── index.html, package.json, etc.
```

## Prerequisites

- [.NET SDK 8.0 or later](https://dotnet.microsoft.com/download)
- [Node.js (v18+ recommended)](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or your chosen database)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mranas007/e-commerce-web-api.git
cd e-commerce-web-api
```

### 2. Backend Setup

```bash
cd backend
dotnet restore
```

- **Update Database (EF Core):**
  ```bash
  dotnet ef database update --project eCommerceApp.Infrastructure --startup-project eCommerceApp.Host
  ```

- **Configure AppSettings:**
  - Edit `eCommerceApp.Host/appsettings.json` with your DB connection string and other settings.

- **Run the Backend:**
  ```bash
  dotnet run --project eCommerceApp.Host
  ```
  - API will be available at `https://localhost:5001`  || `https://localhost:7130` (or as configured).

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

- **Configure Environment:**
  - Edit `.env` to set the backend API URL if needed.

- **Run the Frontend:**
  ```bash
  npm run dev
  ```
  - App will be available at `http://localhost:5173` (or as shown in terminal).

---

## Project Ready Checklist

- [ ] Backend dependencies restored (`dotnet restore`)
- [ ] Database updated (`dotnet ef database update ...`)
- [ ] `appsettings.json` configured
- [ ] Backend running (`dotnet run ...`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] `.env` configured (if needed)
- [ ] Frontend running (`npm run dev`)
- [ ] Access API docs at `/swagger` (e.g., `https://localhost:5001/swagger`)

---

## Testing

- **Backend:**  
  Run tests (if present) from the backend root:
  ```bash
  dotnet test
  ```
- **Frontend:**  
  Add and run tests using your preferred React testing library.

---

## Additional Notes

- **Dependency Injection:** Configured in `eCommerceApp.Host/Program.cs`
- **Swagger:** Enabled at `/swagger` for API docs
- **Frontend:** Uses Vite, React, Tailwind CSS
- **Backend:** Uses Clean Architecture, EF Core, JWT Auth, etc.

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes.
4. Push to the branch.
5. Open a pull request.

## License

This project is licensed under the MIT License.
