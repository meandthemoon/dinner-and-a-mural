# Dinner and a Mural

For those in Baltimore who love food and art.

Baltimore is filled with both of these. This simple app lets you search the city for restaurants and shows you what public artwork is nearby. Click on a restaurant in the search results and the nearby artwork will display below, listed by the piece's title, address and artist(s). Also, the map to the left will drop a pin for the restaurant and each artwork site.

Restaurant and art data are provided by OpenBaltimore.

## Installing, Testing, and Running the App

### Prerequisite Software Installs

The following must be present on the user's computer before running the setup steps below. 

- MySQL Server. See: http://dev.mysql.com/doc/refman/5.7/en/installing.html
- Node.js & npm.  See: https://nodejs.org/en/

Once Node.js is installed, you can use its package manager to install the following:

- grunt-cli. Use the command `sudo npm install -g grunt-cli`.
- mocha. Use the command `sudo npm install -g mocha` ( required only to run tests ).

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

The outome the each build step will log to the terminal as well as when it completes.

### Launching

From the root directory, run `npm run-script run` ( woof! :) ) to start the application. Visit the web app via the URL: `localhost:3030/app.html`.

To have the app run with additional instrumentation/profiling enabled, run `npm run-script run-with-instr`. This will log profiling data to a file `[project_dir]/_instrument/profile-output.dump`. While the applicaiton is running, you can view the profile data that appends to the file by running `tail -f _instrument/profile-output.dump` (non-Windows users).

### Testing

From the root directory, run `npm test` to prompt the full set of unit and integration tests. Test results will be logged to the console.

## Future Enhancements

- For better clarity, change the verbiage in the UI instructions to the following:

*"Hello,try searching below for your favorite restaurant in Baltimore and see if they have public murals or other artwork nearby.  You can search by either all or part of the restaurant name, street name, or neighborhood of interest.  In the results, just select the actual restaurant you are interested in to get you started on your dinner and mural!  Fun!"*

- Add heading (or other) for the restaurant and mural/public artwork display in the UI for better usability
- Expand the "settings" section to include more options, and to adopt client side routing
- Include a directional indicator for sorting/ordering options in the grid
- Add the ability to add/delete restaurants and murals/public artwork. This will be very useful since the dataset is not current.
- Incorporate more interactive map features - title of restaurant/artwork, pin bounce when a list item is hovered by mouse, etc
- Resolve the few geolocation rounding issues present in some restaurant data which misrepresent the true location on the map
- Add feature to allow user to specify radius for which display artwork near restaurant
- Remove grunt-cli from the build dependencies ( local grunt would be sufficient )
- Implement further unit tests for web-server components
- Implement further automated UI, and client-side unit tests
- Instrumentation / Profiling
  - Implement more accurate request time logging - to sub millisecond ( currently to ms )
  - Count string objects ( and other types ) created for each web request (outstanding)
  - Implement another data point exploration: Memory usage; # of unique modules; ... (outstanding)
