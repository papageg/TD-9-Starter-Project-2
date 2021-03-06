'use strict';

const express = require('express');
const { check, validationResult } = require('express-validator/check');

// This array is used to keep track of user records
// as they are created.
const users = [];

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
router.get('/users', (req, res) => {
  res.json(users);
});

// const nameValidationChain = check('name')
//   .exists({ checkNull: true, checkFalsy: true })
//   .withMessage('Please provide a value for "name"');

// Route that creates a new user.
router.post('/users',[
  check('name')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "name"'),
  check('email')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "email"')
    .isEmail()
    .withMessage('Please provide a valid email adress for "email"'),
  check('birthday')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide value for "birthday"')
    .isISO8601()
    .withMessage('Please provide a valid date for "birthday"'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please procide a value for "password"')
    .isLength({ min: 8, max: 20 })
    .withMessage('Please provide a value for "password" that is between 8 and 20 characters in length'),
  check('passwordConfirmation')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "passwordConfirmation"')
    .custom((value, { req })=> {
      //Only attempt to compare the 'password' and 'passwordConfirmation'
      //fields if they have values
      if(value && req.body.password && value !== req.body.password){
        throw new Error('Please provide values for "password" and "passwordConfirmation" that match');
      }
      //Return 'true' so the default "Invalid value" error message
      // doesnt get returned
      return true;
    }),
], (req, res) => {
  // Attempt to get the validation result from the Request object.
  const errors = validationResult(req);

  //If there are validation errors...
  if(!errors.isEmpty()) {
     // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);

    //Return the validation errors to the client.
    res.status(400).json({ errors: errorMessages });
  } else {
    //Get the user from the request body. 
    const user = req.body;

    //Add the user to the 'users' array.
    users.push(user);

    //Set the status to 201 Created and end the response.
    res.status(201).end();
  }

  // Get the user from the request body.
  const user = req.body;

  // Add the user to the `users` array.
  users.push(user);

  // Set the status to 201 Created and end the response.
  res.status(201).end();
});

module.exports = router;




// const errors = [];

//   //Validate that we have a 'name' value.
//   if(!user.name) {
//     errors.push('Please provide a value for "Name"');
//   }

//   //Validate that we have a 'email' value.
//   if(!user.email) {
//     errors.push('Please provide a value for "Email"');
//   }

//   // If there are any errors...
//   if (errors.length > 0) {
//   // Return the validation errors to the client.
//     res.status(400).json({ errors });
//   } else {
//   // Add the user to the `users` array.
//     users.push(user);

//   // Set the status to 201 Created and end the response.
//   res.status(201).end();
// }

//   // Add the user to the `users` array.
//   users.push(user);

//   // Set the status to 201 Created and end the response.
//   res.status(201).end();
