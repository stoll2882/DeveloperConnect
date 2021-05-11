# DeveloperConnect
Web App / Social Media Site for Developers to connect with each other as well as showcase their skills and projects.

## Base Simplicity WebApp based upon udemy course found here:  
https://www.udemy.com/course/mern-stack-front-to-back/learn/lecture/10055492?start=0#overview

### API Integration  
* **PayPal:** for collecting donations
* **Stripe:** for collecting donations
* **Github:** for viewing and displaying github repos
* **Recaptcha:** for user authentication
* **DeadSimpleChat:** for creating and monitoring chat rooms for communication

### Self-built Systems from Scratch:  
* **2-Factor Authentication:** for verifying users 
* **Contact Form:** using NodeMailer, that emails me with a subject and message when a user wants to contact the sites developers
* **Admin:** when I am the one logged on I have admin authority, where I can delete or manage the users
* **CSV Power:** in the Admin login, I created an upload CSV option to where I can upload a CSV of new users. There is also an export to CSV option where the Admin can export all users in the database as well as their profiles to a CSV document.

## Running Developer Connect
### Try testing on the Heroku deployment site, here: https://protected-wave-40480.herokuapp.com/
#### Steps for running locally:
1. Git clone the repo into a new folder stores locally and easily accessible
2. Run an "npm install" in both the server and client directory
3. In the top level directory, run the command "npm run dev." This will launch both the server and client side of the code using concurrently.
