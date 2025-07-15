using AutoMapper;
using eCommerceApp.Application.DTOs;
using eCommerceApp.Application.DTOs.Identity;
using eCommerceApp.Application.Services.Interface.Authentication;
using eCommerceApp.Application.Services.Interface.Logging;
using eCommerceApp.Application.Validations;
using eCommerceApp.Domain.Entities.Identity;
using eCommerceApp.Domain.Interface.Authentication;
using FluentValidation;

namespace eCommerceApp.Application.Services.Implimentation
{
    public class AuthenticationService
        (ITokenManagement tokenManagement,
        IUserManagement userManagement,
        IRoleManagement roleManagement,
        IAppLogger<AuthenticationService> logger,
        IMapper mapper,
        IValidator<CreateUser> createUserValidator,
        IValidator<LoginUser> loginUserValidator,
        IValidationService validationService) : IAuthenticationService
    {
        // user registration
        public async Task<ServiceResponse> CreateUser(CreateUser user, string baseUrl)
        {
            var validationResult = await validationService.ValidateAsync(user, createUserValidator);
            if (!validationResult.Success) return validationResult;

            var mappedModel = mapper.Map<AppUser>(user);
            mappedModel.UserName = user.Email;
            mappedModel.PasswordHash = user.Password;

            var result = await userManagement.CreateUserAsync(mappedModel);
            if (!result)
                return new ServiceResponse { Message = "Email address already in use." };

            var _user = await userManagement.GetUserByEmailAsync(user.Email);
            if (_user == null)
            {
                //logger.LogError("Failed to retrieve user after creation.");
                return new ServiceResponse { Message = "Error occurred in create account" };
            }

            var users = await userManagement.GetAllUsersAsync();
            bool assignedResult = await roleManagement.AdUserToRoleAsync(_user, users!.Count() > 1 ? "User" : "Admin");

            if (!assignedResult)
            {
                // remove user  
                var removeResult = await userManagement.RemovUserByEmailAsync(user.Email);
                if (removeResult <= 0)
                {
                    // error occurred while rolling back changes  
                    // then log the error  
                    logger.LogError(new System.Exception($"User with Email as {_user.Email} failed to be removed as a result of role assigning issue"),
                        "User could not be assigned Role");
                    return new ServiceResponse { Message = "Error occurred in create account" };
                }
            }

            // Generate email confirmation token and send confirmation email
            int response = await userManagement.SendUserConfirmation(_user.Email, baseUrl);
            if (response is 1)
                return new ServiceResponse { Message = "User created successfully & To check your email box and confirm your registeration ", Success = true };
            else if (response is 0)
                return new ServiceResponse { Message = "User doesn't exist", Success = false };
            else
                await userManagement.RemovUserByEmailAsync(_user.Email);
            return new ServiceResponse { Message = "Something went wrong!", Success = false };
        }

        public async Task<LoginResponse> LoginUser(LoginUser user, string baseUrl)
        {
            var validationResult = await validationService.ValidateAsync(user, loginUserValidator);
            if (!validationResult.Success)
                return new LoginResponse(Message: validationResult.Message);

            var mappedModel = mapper.Map<AppUser>(user);
            mappedModel.PasswordHash = user.Password;

            bool loginUser = await userManagement.LoginUserAsync(mappedModel);
            if (!loginUser)
                return new LoginResponse(Message: "Email not found or invalid credentials");

            // to check user email registeration is confirmed or not
            bool checkEmailConfirm = await userManagement.IsEmailConfirm(user.Email);
            if (!checkEmailConfirm)
            {
                int response = await userManagement.SendUserConfirmation(user.Email, baseUrl);
                return new LoginResponse(Success: false, Message: "Email is not confirm please check your Email for confirmation");
            }

            var _user = await userManagement.GetUserByEmailAsync(user.Email);
            var userRole = await roleManagement.GetUserRoleAsync(user.Email);
            var claims = await userManagement.GetUserClaimsAsync(user.Email);

            string jwtToken = tokenManagement.GenerateToken(claims);
            string refrehsToken = tokenManagement.GetRefreshToken();

            int saveTokenResult = 0;
            bool userTokenCheck = await tokenManagement.ValidateRefreshTokenAsync(refrehsToken);
            if (userTokenCheck)
                saveTokenResult = await tokenManagement.UpdateRefreshTokenAsync(_user!.Id, refrehsToken);
            else
                saveTokenResult = await tokenManagement.AddRefreshTokenAsync(_user!.Id, refrehsToken);

            return saveTokenResult <= 0 ? new LoginResponse(Message: "Internal error occured while authenticating")
                : new LoginResponse(Success: true, Message: "you have loged in successfuly!", Token: jwtToken, RefreshToken: refrehsToken, Role: userRole);
        }

        public async Task<LoginResponse> ReviveToken(string refreshToken)
        {
            bool validateRefreshToken = await tokenManagement.ValidateRefreshTokenAsync(refreshToken);
            if (!validateRefreshToken)
                return new LoginResponse(Message: "Invalid Token");

            var userId = await tokenManagement.GetUserIdByRefreshTokenAsync(refreshToken);
            AppUser? user = await userManagement.GetUserByIdAsync(userId);
            var claim = await userManagement.GetUserClaimsAsync(user.Email!);
            var newJwtToken = tokenManagement.GenerateToken(claim);
            var newRefreshToken = tokenManagement.GetRefreshToken();

            bool userTokenCheck = await tokenManagement.ValidateRefreshTokenAsync(newRefreshToken);
            if (!validateRefreshToken)
                return new LoginResponse(Message: "Internal error occured while authenticating");

            await tokenManagement.UpdateRefreshTokenAsync(userId, newRefreshToken);
            return new LoginResponse
                (Success: true,
                Message: "Updated Successfully",
                RefreshToken: newRefreshToken,
                Token: newJwtToken);
        }

        public async Task<bool> ConfirmUserForEmail(string userId, string token)
        {
            AppUser user = await userManagement.GetUserByIdAsync(userId);
            await userManagement.ConfirmUserForEmail(user, token);
            return await userManagement.IsEmailConfirm(user.Email!);
        }
    }
}
