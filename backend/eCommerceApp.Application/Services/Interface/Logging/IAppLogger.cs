namespace eCommerceApp.Application.Services.Interface.Logging
{
    public interface IAppLogger<T>
    {
        void LogInformation(string message);
        void LogWarning(string message);
        void LogError(System.Exception ex, string message);
    }
}
