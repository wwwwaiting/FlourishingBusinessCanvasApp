# Flourishing Business Canvas/Team 9

> _Note:_ This document is intended to be relatively short. Be concise and precise. Assume the reader has no prior knowledge of your application and is non-technical. 

## Description 
 * Provide a high-level description of your application and it's value from an end-user's perspective

   **High-level description**

Our website provides FBC template and online access to users. Users who are enrolled in the same canvas are able to edit the canvas at the same time. Besides the regular FBC features such as adding, removing and rearranging stickies, changing the name of the FBC, the owner, and the organization it belongs to, users can also search for or comment on any specific sticky. In addition, FBCs can be exported in various formats such as JSON, PDF, PNG, etc.

After users successfully signed up their accounts, they can be logged in as **manager**, if they have received our partner's invitation email. Or a regular **user**, if they are invited by their managers. 

A **manager** has access to features such as managing (a.k.a. creating and deleting) canvases, managing (a.k.a. adding and removing) users of each canvas. All users (**manager** & regular **user**) are able to edit the canvases that they are enrolled in.

​	**Value from end-user's perspective**

The main value from an end-user's perspective is the improved workflow efficiency as well as real-time data synchronization that our website helps them to achieve. They will now invite their colleagues to use our online FBC template to work on their business ideas rather than building a traditional physical FBC in their office. Since FBCs are likely to be modified often and the fact that users might not be able to meet together at the same physical space all the time, by having a cloud version of FBC, **users will be able to view/change/discuss it even if they are at different places**. Also, the physical canvas has limitation on the amount of data (stickies) to be shared. Besides that, it is hard to rearrange or remove some of the stickies when it reaches a certain quantity. **Our website extends the amount of data stored significantly and make the edit process easier and neater**. Furthermore, it is time-consuming to search for a specific sticky on a physical FBC. The search function in our website solves this issue. Additionally, the comment system under each sticky is a place for users to **save their thoughtful discussions which might be useful later as their FBC progresses**.  

 * What is the problem you're trying to solve?

 * Is there any context required to understand **why** the application solves this problem?

The contest is that users are now using physical FBC to solve their need. The main problem about having it physical is that users can no longer access the FBC once they are out of where the FBC is placed, and it is unrealistic to have a copy and distribute it to every member of the group not only because it is costly but also the FBC is likely to be changed frequently and thus hard to keep everyone informed and updated. The users would choose our product to solve the problem because of the functionalities we provide compared to the physical model such as quick setup of the FBC, multiple access for users to view and modify the canvas online simultaneously, tracked past discussions, and ability to sort and search the model efficiently. 

## Key Features
 * Described the key features in the application that the user can access

**Sticky**

Once a sticky is created, users can drag it to their desired boxes. The sticky will automatically positioned meaning if it is dragged to the middle of two boxes, it will be moved in to the box that is the closest to it.

User can also **double click** a sticky to modify its **color**, **content**, add **comment** or **delete** it entirely.

Additionally, when user **single click** a sticky, under the header they will be an extra box displaying all the stickies under the box where the current selected sticky is in. This is useful when there are too many stickies in a box.

**Export**

On the canvas page, users can export their canvas to json, svg, png, or pdf format.

**Manage canvas**

A list of canvases that the manager has currently, as well as the users of each canvas will be shown in the pop up window. Manager can **add** users to any canvas by clicking the add button under a specific canvas and enter their emails, or **remove** users from a canvas by checking the username boxes under that canvas and clicking remove.

**Manage users (Manager only)**

Manager can **add** a new canvas by entering the title of the new canvas, or **remove** a previous canvas by checking the canvas name box and clicking on the remove button.

**Change profile**

All users can change their profile information in the library page.



 * Feel free to provide a breakdown or detail for each feature that is most appropriate for your application

## Instructions
 * Clear instructions for how to use the application from the end-user's perspective

**Log in/Sign up page***

This is the first page users will reach in our website. 

Users who receive invitation emails from our partner (admin) will register as manager by entering the email which they receive the invitation. For other regular users, they'll need to wait for approval once they finish signing up. 

After successfully signing in, users will first move to the library page.

**Library page (Admin)**

Click any FBC shown under the header will direct user to the main canvas page of a specific FBC.

On the right side of the header there are six buttons, **Users**, **Canvases**, **Notification**, **Invitation**, **Profile**, and **Log Out**.

By clicking **Users**, all users that have successfully signed up will be shown, admin can then select the user(s) that he/she wants to **remove**.

By clicking **Canvases**, all the canvases, including both admin's and the other users' will be shown, admin can then choose to **copy**, **add**, or **remove** canvases.

By clicking **Notification**, all the users who registered but have not been approved will be shown, admin can choose to approve or decline the users.

By clicking **Profile**, admin will be moved to the profile page.

**Library page (Manager)**

Click any FBC shown under the header will direct user to the main canvas page of a specific FBC.

On the right side of the header there are three buttons, **Manage users**, **Manage canvas** and **Profile**.

By clicking **Manage users**, a list of canvases that the manager has currently, as well as the users of each canvas will be shown in the pop up window. Manager can **add** users to any canvas by clicking the add button under a specific canvas and enter their emails, or **remove** users from a canvas by checking the username boxes under that canvas and clicking remove.

By clicking **Manage canvas**, manager can **add** a new canvas by entering the title of the new canvas, or **remove** a previous canvas by checking the canvas name box and clicking on the remove button.

By clicking **Profile**, manager will be moved to the profile page.

**Library page (User)**

All functionalities are the same as **Library page(Manager)** except that a regular user cannot manage other users or canvases. 

**Profile page**

Users can modify their information in this page and click **Save changes** for it to take effect. However, email cannot be changed.

When clicking **Want to change password?**, users can change password by entering their old and new passwords. Only if old password matches with previous record and new password aligns with the confirm password, the password is then successfully changed. 

**Main FBC application page**

When users are successfully logged in to our website, through the library page they will be able to move to the canvas page.

On the very left of the page, the **My Canvases** button will move users back to their library page.

Under My Canvases, we have an input box where users can enter the content, title and color they want and create a new sticky by pressing the "**New Sticky**" button.

Once a sticky is created, users can drag it to their desired boxes. The sticky will automatically positioned meaning if it is dragged to the middle of two boxes, it will be moved in to the box that is the closest to it.

User can also **double click** a sticky to modify its **color**, **content**, add **comment** or **delete** it entirely.

Additionally, when user **single click** a sticky, under the header they will be an extra box on the left side of the page displaying all the stickies under the box where the current selected sticky is in. This is useful when there are too many stickies in a box.

Furthermore, on the right side of the header, users can input the **title** of the FBC and **name** of the creator, **export** the FBC as json, svg, png or pdf. Or **search** within the canvas. 

 * How do you access it? Are accounts pre-created or does a user register? Where do you start? etc. 

Users who receive invitation emails from our partner (admin) will register as manager by entering the email which they receive the invitation. For other regular users, they'll need to wait for approval once they finish signing up. 

 * Provide clear steps for using each feature described above

