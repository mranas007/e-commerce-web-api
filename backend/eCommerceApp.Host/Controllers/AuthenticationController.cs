using eCommerceApp.Application.DTOs.Identity;
using eCommerceApp.Application.Services.Interface.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace eCommerceApp.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController
        (IAuthenticationService authenticationService,
        IConfiguration configuration) : ControllerBase
    {
        [HttpPost("create")]
        public async Task<IActionResult> CreateUser(CreateUser user)
        {
            string? clientBaseUrl = configuration["Client:Origin"];
            if (clientBaseUrl == null)
                return BadRequest("Couldn't found the client path.");

            //string baseUrl = $"{Request.Scheme}://{Request.Host}";
            var result = await authenticationService.CreateUser(user, clientBaseUrl);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginUser(LoginUser user)
        {
            string? clientBaseUrl = configuration["Client:Origin"];
            if (clientBaseUrl == null)
                return BadRequest("Couldn't found the client path.");

            //string baseUrl = $"{Request.Scheme}://{Request.Host}";
            var result = await authenticationService.LoginUser(user, clientBaseUrl);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPost("refreshToken/{refreshToken}")]
        public async Task<IActionResult> ReviveToken(string refreshToken)
        {
            var result = await authenticationService.ReviveToken(refreshToken);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPost("confirmEmail")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest request)
        {
            if (string.IsNullOrEmpty(request.Id) || string.IsNullOrEmpty(request.Token))
                return BadRequest("Request isn't valid.");
            bool res = await authenticationService.ConfirmUserForEmail(request.Id, request.Token);
            if (!res)
                return BadRequest("Email confirmation failed.");
            return Ok("Email confirmed successfully.");
        }

      
    }
}
