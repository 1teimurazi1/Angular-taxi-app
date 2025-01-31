[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/uLkzCda0)
# Taxi app

You are building a taxi application. The app has three types of users:  
1. Admins - managing the application  
2. Drivers  
3. Passengers  


The application should work in all major web browsers (chrome, safari, firefox, edge).  
Initially, there is a single admin user with a predefined username and password.

Admin users can manage drivers using the driver management page. This page displays all currently registered drivers. Admin can search drivers by name, last name, personal number, car model, car plate number, and status. Admin users can temporarily suspend the driver and later reactivate him if required. Suspended drivers can not take orders. All newly registered drivers require initial approval by the admin. Admin can approve drivers using buttons that appear only in the rows corresponding to newly registered drivers.

A driver can register on the platform to get orders. The driver registration form contains the following fields: name, last name, personal number, mobile number, email, car model (typeahead dropdown), and car plate number. Using the profile edit page, the driver can edit information in all of these fields(except personal number).

After registration, the driver can start fulfilling orders from passengers. The driver should go to the ride requests page to accept a new order.
The ride requests page displays nearby(in a 2 km radius) ride requests that have not yet been assigned to another driver. The distance can be calculated either as a straight line distance between the GPS coordinates of the passenger requesting the ride and the driver or as a driving distance between them, using google maps API (or any other API).
Each ride request displays the destination address, approximate distance, and fare (the application calculates the distance from starting location to the destination as a straight line or as a driving distance). The driver can accept any available ride request by clicking the accept button on the desired row. Once the driver accepts the order, the passenger receives updated order information. The driver can only accept new orders once he finishes the current one. He can mark the order as completed using the "my orders" page.
The "my orders" page contains the list of current and past orders. The current order is always on top of the list. By clicking the link user is navigated to the order details page. The details page displays detailed information about the order, including passenger contact info (phone and name). Also, a map showing the route and a "complete order" button appear on the form while the ride is not over. 
The driver can search orders by date (range) and fare(range).

Passengers can register on the platform to request rides. During registration, the passenger must fill in the following fields: name, last name, phone number, and email.
When signed in, the website header contains the link "new ride."
The new ride request page contains fields for starting location and destination (using map or typing address, use google maps API or any other API). Start and end locations should resolve to GPS coordinates as they are required for ride distance and fare calculations.
Once the user specifies the start and end locations, the application calculates the ride fare(based on distance and current rate) and displays it along with the "confirm" button. If the user confirms the ride request, it appears on the ride requests page for nearby drivers(in a 2km radius from the start location). Also, it appears on the passenger's "my orders" page.
The passenger's "my orders" page contains the list of current and past orders. The current order is always on top of the list. By clicking the link user is navigated to the order details page. The details page displays detailed information about the order, including the driver's contact info (phone and name) and a map showing the route. 
The passenger can search orders by date (range) and fare(range).


General notes:  
The landing page contains registration and sign-in page links for all types of users.  
The application should contain a header, footer, and navigation menu.  
The website header should display a name with greeting text and a signout button for an authenticated user.  
After signing in, the user is navigated to the home page, which has a dashboard with useful links and information.  
All lists containing potentially  more than ten items should use paging.  
All forms, except popups, should be linkable (bookmarkable).  
All descriptions may include formatted text and require a WYSIWYG editor.  
