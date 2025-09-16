#### Bug ID: BUG-001



###### Description:

&nbsp;A new user can be created using an existing user's email address.



###### Steps to Reproduce:

1- Fill in the sections other than the email address in the Body section.

2- Fill in the email section with an existing user's email address.

3- Send a “POST /users” request to the API.



###### Expected Behavior:

The response “email already exists” is returned.



###### Actual Behavior:

The user was successfully created.



###### Severity:

High





#### Bug ID: BUG-002



###### Description:

A new user can be created using an existing user's phone number.



###### Steps to Reproduce:

1- Fill in the sections other than the phone in the Body section.

2- Fill in the email section with an existing user's phone numbers.

3- Send a “POST /users” request to the API.



###### Expected Behavior:

The response “phone number already exists” is returned.



###### Actual Behavior:

The user was successfully created.



###### Severity:

High





#### Bug ID: BUG-003



###### Description:

When a “GET /users” request is made to the API, users after the user with ID number 11 are not listed. To list the remaining users, a “GET /users/{user\_id}” request is required.



###### Steps to Reproduce:

1- Send a “GET /users” request to the API.



###### Expected Behavior:

Listing all users in the database



###### Actual Behavior:

Users after ID number 11 are not listed.



###### Severity:

Medium



#### Bug ID: BUG-004



###### Description:

A non-administrator user can delete another user's account.



###### Steps to Reproduce:

1- Log in to a non-admin user account

2- To delete any user account, send a “DELETE /users/{user\_id}” request to the API



###### Expected Behavior:

An error message stating that authorization is required.



###### Actual Behavior:

The user has been successfully deleted.



###### Severity:

Critical



#### Bug ID: BUG-005



###### Description:

You can log in to the deleted user account. The account status continues to appear as inactive.



###### Steps to Reproduce:

1- Request deletion for any account

2- Try logging back into the deleted account



###### Expected Behavior:

Inability to log in to the account (or the account status returning to active)



###### Actual Behavior:

The account is successfully logged in and the account status remains inactive.



###### Severity:

Medium





#### Bug ID: BUG-006



###### Description:

When a user logs into their account, another user's information can be updated.



###### Steps to Reproduce:

1- Log in to the account

2- Make a “PUT /users/{user\_id}” call to the API for another account.

3- Check the API Response



###### Expected Behavior:

You should receive a “401 Unauthorized” error.



###### Actual Behavior:

The response “200 OK” indicates that the information has been updated.



###### Severity:

Critical



