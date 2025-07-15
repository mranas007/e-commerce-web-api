using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Configuration;

namespace eCommerceApp.Infrastructure.Services.Email
{
    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _configuration;

        public EmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            // Validate input parameters
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Recipient email address is required.", nameof(email));
            if (string.IsNullOrWhiteSpace(subject))
                throw new ArgumentException("Email subject is required.", nameof(subject));
            if (string.IsNullOrWhiteSpace(htmlMessage))
                throw new ArgumentException("Email message body is required.", nameof(htmlMessage));

            // Retrieve email settings from configuration
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var portString = _configuration["EmailSettings:Port"];
            var senderEmail = _configuration["EmailSettings:SenderEmail"];
            var senderPassword = _configuration["EmailSettings:Password"];

            if (string.IsNullOrWhiteSpace(smtpServer))
                throw new InvalidOperationException("SMTP server is not configured.");
            if (string.IsNullOrWhiteSpace(portString) || !int.TryParse(portString, out int port))
                throw new InvalidOperationException("SMTP port is not configured or invalid.");
            if (string.IsNullOrWhiteSpace(senderEmail))
                throw new InvalidOperationException("Sender email is not configured.");
            if (string.IsNullOrWhiteSpace(senderPassword))
                throw new InvalidOperationException("Sender password is not configured.");

            using (var smtpClient = new SmtpClient(smtpServer)
            {
                Port = port,
                Credentials = new NetworkCredential(senderEmail, senderPassword),
                EnableSsl = true,
            })
            using (var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true,
            })
            {
                mailMessage.To.Add(email);

                try
                {
                    await smtpClient.SendMailAsync(mailMessage);
                }
                catch (SmtpException ex)
                {
                    // Log the exception or handle accordingly
                    throw new InvalidOperationException("Failed to send email.", ex);
                }
            }
        }
    }
}
