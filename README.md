### Calendar APP

#### Author

Name-Surname : ABDULLAH BODUR

#### Private Key :

gAAAAABiWsW6WacGRdnpWr3zRj9-lrVpzlAuebC5Qnrl5OHKFFCpFD_tL8dbvRv4lTlWerFOUPGFy9r9c4rp0vZEnEOhjy3vbBtRvvsRhvL4FuThUNPpJu20k3MpKb-z9OOlEmxKipWH4pNSqR4QcjSysnSu_FdKrWr0zhnMg-XUP4yhtd143TPvRcs7-I2RFcxJyxkfRiAk7mEwv2YClIlVPAdIQUJRE5hE9KZzgfR65Xju5da_smA=

### How to run?

You need to configure the environment variables.
The server uses MongoDB as a database (NoSQL).

After the configuration run
`docker-compose up --build`

### Endpoint List

- SignIn - POST -(HOST:PORT/signin)
- SignIn - POST -(HOST:PORT/signup)
- getEvents - GET -(HOST:PORT/event) \*\* Authorization Required
- createEvent - POST -(HOST:PORT/event) \*\* Authorization Required
- updateEvent - PUT -(HOST:PORT/event) \*\* Authorization Required
- deleteEvent - DELETE -(HOST:PORT/event) \*\* Authorization Required

#### Authorization Required

Signup and Signin endpoints gives us an access token. To make a request to private endpoints you need to give an Authorization Header like:

`Bearer: [ACCESS_TOKEN_HERE]`

Example :

`Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MjVkZDhjNjViOTdjNjJkN2U3MjY5OGQiLCJzY29wZSI6WyJhcGkuY2FuZGxlc2JvdC5hdXRoIiwiYXBpLmNhbmRsZXNib3Qud2ViIl0sImlhdCI6MTY1MDMyMDYwNzQ3OSwiZXhwIjoxNjUyMDQ4NjA3NDc5LCJhdWQiOiJhcGkuY2FuZGxlc2JvdCIsInJvbGUiOiJhdXRoX3VzZXIiLCJkZXZpY2VfaWQiOiJERVZJQ0UgSUQifQ.YxFPceNiKkHfaxIn8SOZmdasYjGtzoe5ezLyh28p3Ys`

### Web App Pages

There are three different pages:

- Login Page HOST:PORT/ example => http://localhost:3000/
- Sign Up Page HOST:PORT/signup example => http://localhost:3000/signup
- Dashboard Page HOST:PORT/dashboard
  example => http://localhost:3000/dashboard

#### NOTE:

I have no experience with docker so if its not work, you can use manually.

- change the server/config/config.env
- add this to server/config/config.env
  `MONGODB_USER=root
  MONGODB_PASSWORD=123456
  MONGODB_DATABASE=calendar-app
  MONGODB_LOCAL_PORT=7017
  MONGODB_DOCKER_PORT=27017

NODE_LOCAL_PORT=5051
NODE_DOCKER_PORT=5500`

- create mongodb account and give the access details of account
