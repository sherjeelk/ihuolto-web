export class AppConstants {
  constructor() {
  }



  public static BASE_URL = 'https://api.i-huolto.fi';
  public static TAX = 18;

    public static API = {

    All_SERVICES: AppConstants.BASE_URL + '/services',
    All_PRODUCTS: AppConstants.BASE_URL + '/products',
    All_Brands: AppConstants.BASE_URL + '/brands',
    Order: AppConstants.BASE_URL + '/orders/place',
    UPLOAD_IMAGES: AppConstants.BASE_URL + '/upload',
    POSTCODE: AppConstants.BASE_URL + '/cities',
    COUPON: AppConstants.BASE_URL + '/coupons/apply',
      All_PRICING: AppConstants.BASE_URL + '/pricings',


    };

}
