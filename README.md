# Dinner and a Mural

For those who love food and art.

Baltimore is filled with both of these. This simple app lets you search the city for restaurants and shows you what public artwork is nearby.

Restaurant and art data are provided by OpenBaltimore.

## Installing, Testing, and Running the App

### Prerequisite Software Installs

The following must be present on the users computer before running the setup steps below. 

MySQL Server

See: http://dev.mysql.com/doc/refman/5.7/en/installing.html

NodeJS & npm

See: https://nodejs.org/en/

Once NodeJS is installed, you can use its package manager to install the following:

grunt-cli  `sudo npm install -g grunt-cli`

mocha  `sudo npm install -g mocha` ( required only to run tests )

For Windows users, omit the `sudo` prefix in the commands above.

### Setup

Running the application requires some initial build steps. These include:

 1. Configuring MySQL by creating the application's database, database tables, and its user account
 2. Importing the needed datasets from the OpenBaltimore APIs and export them to into the database

*If the OpenBaltimore web services (or an internet connection) are not available to import live data, then the datasets included in the project's `datasets` directory will be used instead.*

After cloning the project, in a terminal, `cd` into the root project folder and type 

    npm install
    grunt build --mysql-admin root

If the MySQL root administrator's password is not known (or chosen not to be used), run the command using the username of an administrator account with known credentials. Enter the user's password when at the prompt's request.

The outome the each build step will log to the terminal as well as

### Launching

From the root directory, run `npm run-script run` ( woof! :) ) to start the application. Visit the web app via the URL: `localhost:3030/app.html`.

### Testing

From the root directory, run `npm test` to prompt the full set of unit and integration tests. Test results will be logged to the console.

## Future Enhancements

1. Enhance the key for the restaurant and mural/public artwork display in the UI for better usability
2. Expand the settings for client side state and routing
3. Include a directional indicator for sorting/ordering options in the grid
4. Add the ability to add/delete restaurants and murals/public artwork
5. Implement further automated UI tests
6. Log count of string objects created for a single page request or RESTful request (outstanding)
7. Implement more accurate request time logging (sub millisecond)
8. Implement another data point exploration (outstanding)
