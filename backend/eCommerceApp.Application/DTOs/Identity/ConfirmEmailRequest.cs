using System;

namespace eCommerceApp.Application.DTOs.Identity
{

    public class ConfirmEmailRequest
    {
        public required string Id { get; set; }
        public required string Token { get; set; }
    }
}
