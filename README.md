## Future updates
- Add location in order
- Add quantity in Cart product
- can correct model Cart : currently relationship is one to many can make it like many to many from user to product.
- payment integration through razorpay
- reset password and email verification
- sync timing of jwt token sent in cookie and jwt token in the userDB




### methods included to save from attacks
- brute force attack : limited the no of request
- denial of service attack : limited the no of request and added req body size
- helmet added for different security headers
- cross site scripting attack : jwt in cookie
- nosql query attack and xss injection - data sanitization