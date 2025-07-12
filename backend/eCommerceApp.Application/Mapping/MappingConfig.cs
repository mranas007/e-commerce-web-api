using AutoMapper;
using eCommerceApp.Application.DTOs.Cart;
using eCommerceApp.Application.DTOs.Category;
using eCommerceApp.Application.DTOs.Identity;
using eCommerceApp.Application.DTOs.Product;
using eCommerceApp.Domain.Entities;
using eCommerceApp.Domain.Entities.Cart;
using eCommerceApp.Domain.Entities.Identity;

namespace eCommerceApp.Application.Mapping
{
    public class MappingConfig : Profile
    {
        public MappingConfig()
        {
            // comming from & going to
            CreateMap<CreateCategory, Category>();
            CreateMap<CreateProduct, Product>();

            CreateMap<Category, GetCategory>();
            CreateMap<Product, GetProduct>();

            CreateMap<UpdateCategory, Category>();
            
            CreateMap<CreateUser, AppUser>();
            CreateMap<LoginUser, AppUser>();

            CreateMap<PaymentMethod, GetPaymentMethod>();
            CreateMap<CreateAchieve, Achieve>();

            CreateMap<CartItem, CartItemDto>();
            CreateMap<Product, ProductDto>();
        }
    }
}
