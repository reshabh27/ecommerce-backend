## Future updates
- Add location in order
- Add quantity in Cart product
- can correct model Cart : currently relationship is one to many can make it like many to many from user to product.
- payment integration through razorpay
- reset password and email verification --- done
- delete user after particular time if not verified within time
- sync timing of jwt token sent in cookie and jwt token in the userDB
- preventing parameter pollution - https://www.youtube.com/watch?v=ECnqctPMKys&list=PL1BztTYDF-QPdTvgsjf8HOwO4ZVl_LhxS&index=122




### methods included to save from attacks
- brute force attack : limited the no of request
- denial of service attack : limited the no of request and added req body size
- helmet added for different security headers
- cross site scripting attack : jwt in cookie
- nosql query attack and xss injection - data sanitization (express-mongo-sanitize, xss-clean)


## features this api includes
- User profile
    - signup, login with jwt token having different token for different logins, logout single session and all session, forgot and reset password through reset password link in mail, deleteProfile, getMyProfile

- Products
    - getAllProducts with paging and filteration, getProductsByID, add update and delete product by admin

- Cart
    - if user is logged in then they can add products in cart and delete product from cart