##Empty this list into the read me below

[1] search for restaurants in baltimore
   - see each restaurant, name, street, neighborhood
   - hover-highlight


[2] Display murals
<nearby>
    - in same zipcode
    - by some number of feet, yards, blocks, etc
[_]
   - clicking restaurant shows <nearby> murals below
   - 

********************* Boosha Notes* ********************************************
********************************************************************************

1. Potential implementation:
    Find a way to display distance in the mural output list.  
    Apply a sort to the mural output list by distance, and Artist Name (?)

2. Center map based on results

3. Change the instructions to make clearer the initial flexibility of searching by restuarant name, street name, or neighborhood
    3a. Second selection is on selecting a restaurant from the results

4. Have a "clear results" function that clears the results and the map

5. This looks really good :)  Nice job booshk!

********************************************************************************
********************************************************************************



# join-the-team-p4-nodejs
Joining Contrast Security | Project #4 : Language Specialist ( Agent Engineer ) | NodeJS

## SETUP

In a terminal, `cd` into the root project folder and type `npm setup $mysql-admin`, where `$mysql-admin` represents a MySQL administrator's username. A prompt will request this user's password. When finished, the script should have

 1. created the application's database and an associated user.
 2. created all of the databse objects used by the application.
 3. imported datasets from the OpenBaltimore APIs into the database. If the web services are not available to import live data, then the datasets included in the project's `datasets` directory will be used instead. Otherwise these local files will be replaced with the most recent data returned by OpenBaltimore. This provides a way for the default local datasets to update when possible.

## TEST

From the root directory, run `npm test` to prompt the full set of unit and integration tests. Test results will be logged to the console.

## RUN

From the root directory, run `npm run` to start the application. Visit the web app via the URL: `localhost:3030/app`.

## Reset DB

From the root directory, run `npm refresh-data` to run step #3 from the Setup steps.
