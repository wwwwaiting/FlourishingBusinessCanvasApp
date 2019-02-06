# Flourishing Business Canvas (FBC)

Note: This document is meant to evolve throughout the planning phase of your project.   

That is, it makes sense for you commit regularly to this file while working on the project (especially edits/additions/deletions to the Highlights section).
 Most importantly, it is a reflection of all the planning you work you've done in the first iteration.


## Q1: What are you planning to build?

Flourishing Business Canvas (FBC) is a physical canvas that business architects use to create/change organization business ideas to be more sustainable (achieve financial, social, and environmental benefits). We are planning to build a website that can be used to create FBC virtually online where users can invite their colleagues to discuss and modify their business models.

There are three major problems that we are trying to solve.

1. Many of the users are **not able to meet in the same physical place at the same time**, and it is costly and time consuming to provide the FBC to every member since it is likely to be modified often. By making the cloud version of FBC, users will be able to view/change/discuss it even if they are at different places.
  
2. The physical canvas has **limitation on the amount of data (stickies)** **to be shared**. Besides that, it is hard to rearrange or remove some of the stickies when it reaches a certain quantity. The cloud will extend the amount of data stored significantly and make the process easier and neater. 
  
3. It is **time consuming to search for a specific sticky on a physical FBC**. We will have search function built on our website to help.

### What our website does

Our website will create a basic strong sustainability business model which incorporates triple bottom line (environment, society, and economy). **A diagram is shown below.** Users can add their stickies based on their need to the FBC. If the amount of stickies exceed the space in the view, information will be folded and shown upon user request (by double clicking on the part of canvas).

Initially, users will receive an invitation from the admin in order to be granted the authority of creating a FBC. Once they do, they become the admin of the canvases they create and can send invitations to their colleagues to take a part in the canvas. 

Additionally, users are able to comment on and search for stickies. 

![img](https://lh5.googleusercontent.com/2S05Ef_xy5kaYyxXcKsgRmWDa_mGAwqc7maH9C5nNRtfv6vw8qQrc8IAWyGj9BlMRtwdLIBw5IxmbzK0Z9f4QuqJsLXX9sjGVkbXWVHi9cqNcknJYpg33MtMbOitZUqFR9lsv6qe)

Description: The yellow part are the stickies which can be added to the canvas at users’ wish, while the three themes (environment, society, and economy) are predefined as a fixed template in the initial setup since it is what the strong sustainability business model is all about.


## Q2: Who are your target users?

Our target users are **the members of the Strong Sustainable Business Model Group** which consists of 1500 academics, consultants, and business architects who are in need of using FBC to build newly sustainable business models which can go beyond the profit business models that are currently in use.

As a business architect, who has been working on developing more sustainable business models for over 10 years, I would love to have a new platform where I can share my business model with the entire group so that all members are free to express their opinions and improve the business model in a more effective way without potential spatial restrictions. 


## Q3: Why would your users choose your product? What are they using today to solve their problem/need?

Our website provides FBC template and online access to the users. **Users will save much effort without the need of building the basic layers of FBC physically. Rearranging and searching for particular stickies adds more functionalities. Having online access allows users to view and discuss the model with their colleagues from a distance.** 

Users are now using physical FBC to solve their need. The main problem about having it physical is that users can no longer access the FBC once they are out of where the FBC is placed, and it is unrealistic to have a copy and distribute it to every member of the group not only because it is costly but also the FBC is likely to be changed frequently and thus hard to keep everyone informed and updated. The users would choose our product because of the functionalities we provide compared to the physical model such as quick setup of the FBC, multiple access for users to view and modify the canvas online simultaneously, tracked past discussions, and ability to sort and search the model efficiently. 

## Q4: How will you build it?

### Front end:

- **HTML**:  for the whole front end layout to display the product
- **CSS**:  for the style of the HTML document
- **Javascript/Ajax**: The main programming language for the interaction between front and back end, there are many libraries to be used, the most likely one will be JQuery.

### Back end: 

- **MongoDB**: the major database for storing information like user credentials and canvas details
- **NodeJS**: server-side framework

### Deployment: 

- Using **Heroku** as the virtual server to present the web application.

### High Level component: 

- **MVC**: The high level patterns will be used is Model-View-Controller. 

![pastedGraphic_1.png](https://lh5.googleusercontent.com/e3uz0DJWWYf28rsgOp2lV_r8FmmuTA3Rnott6OF6dnABPHn3IdlzFvPqbunD-5IYd0qVlAdcuvjSXsRsTBqHHlHqJ5R56fxThwdvkKDvSLqLkbbepg16yHSEg9Mo3ZD9xOxbGrRf)

Each time the user opens a canvas, the app will pull stored canvas data if existed from the database, and display the corresponding information to the user.

The user will make changes to the canvas by adding stickies to different sections, and the controller will communicate between the user view and the database to update any changes, then the Model a.k.a the database will store required information, and finally those changes will be displayed back to all users who share the accessibility to the same canvas. 

### Third party: 

- Potentially using Bootstrap Template for some small display features like search bar and comment box.

### Testing:

- The very first step will be **functionality testing**.  The purpose is to make sure the pages are working properly as designed.
- Then the **usability testing** will be performed by group members to check if our web is user-friendly, especially to ensure the search bar and all buttons are visually accessible.
- Next will be the **interface testing** for the interactions between front-end and back-end so that correct results are returned by the requests.
  - To test the correct user credentials 
  - To test the Canvas details after multiple editions
- The final step will be **security testing**. 
  - Since our web application is based on email invitation, we need to ensure that unauthorized individuals will not have the ability to access the website.
  - For different roles, we also need to test their limited accessibility to search for keywords (within single canvas or across multiple canvases).


## Highlights

**Decision 1: General search v.s. Tag search**

Originally, we decided to implement basic search function on the stickies. As in, once we searched for a particular phrase, all the stickies containing that phrase would show up in the search list.

However, we realized that even though we searched for a particular phrase, the stickies might not have the content we were looking for because it may simply contain that phrase by coincidence without being closely tied to the content. We then decided to add a tag search based on hashtags each sticky may include. As a side note, we would give admin of the website the authority to search for stickies of all users’ canvases.

We believe implementing both general search and tag search optimizes user experience. When users need to find particular topics of stickies, tag search solves the problem. While users want to search by specific phrases in a broad sense or to edit previous untagged stickies, general search is there to help.



**Decision 2: Comment system v.s. Chat system**

We were arguing about whether to use a chat system between users, or have a comment system under each sticky.

For chat system, we were thinking that it would be useful if we can have users being able to communicate with each other through our website. We then quickly discovered that it is inefficient to build such a system. To begin with, suppose we do have a chat system working, when users communicate, they still need to tell which sticky they are talking about to their colleagues, or to describe which part of the canvas they want to insert another sticky, etc, which is absurd. 

For comment system, in contrast, users can make necessary comments under the stickies and we will pop out a notification to others so that it will draw their attention to the subject. This option makes the most sense because it prevents users from struggling to understand which specific part of the canvas their colleagues are talking about and can quickly engage to the argument through this one-to-multiple communication.



**Decision 3: Resizing v.s. Pop out window**

We were deciding if we should automatically adjust the size of the canvas when there are too many stickies or some stickies containing too much content, versus, display summarized and shortened version of the stickies on the canvas and only when you double click on that part of the canvas, expand all the hidden detailed information in a pop up window.

After debating, we reached a consensus that it is better to implement the pop out window rather than resizing since resizing changes layout specifications which may potentially cause different canvases appear disorganized.
