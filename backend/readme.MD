# Project Setup and Documentation

## Overview

This ASP.NET Core Web API project is structured using the Clean Architecture pattern, which separates concerns into distinct layers for maintainability, scalability, and testability.

## Project Structure

- **Application**: Contains application services, use cases, and DTOs.
- **Domain**: Contains domain entities, interfaces, and business logic.
- **Host**: The API layer that exposes endpoints and handles HTTP requests.
- **Infrastructure**: Contains implementations for data access, external services, and persistence.

## Prerequisites

- [.NET SDK 8.0 or later](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or your chosen database)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)

## Getting Started

1. **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2. **Restore Dependencies**
    ```bash
    dotnet restore
    ```

3. **Update Database (if using EF Core)**
    ```bash
    dotnet ef database update --project Infrastructure --startup-project Host
    ```

4. **Configure AppSettings**
    - Update `appsettings.json` in the `Host` project with your connection strings and other configuration values.

5. **Run the Application**
    ```bash
    dotnet run --project Host
    ```

6. **Access the API**
    - The API will be available at `https://localhost:5001` (or the port specified in launch settings).

## Testing

- Unit and integration tests are located in the `Tests` folder.
- Run tests using:
  ```bash
  dotnet test
  ```

## Additional Notes

- **Dependency Injection** is configured in `WebApi/Program.cs`.
- **Swagger** is enabled for API documentation at `/swagger`.
- **CQRS and MediatR** patterns are used for request/response handling (if applicable).
- **Validation** is handled using FluentValidation (if included).

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes.
4. Push to the branch.
5. Open a pull request.

## License

This project is licensed under the MIT License.
