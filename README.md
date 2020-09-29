# Configuration

# To Run on Local
`mvn clean package tomcat7:run`

# To Host on ElasticBeanStalk - Remote
(signin link https://069445345183.signin.aws.amazon.com/console )
1. Set Env: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY on EB
2. `mvn clean compile war:war`
3. Get the war file upload to EB

# Linking ElasticBeanStalk to ROUTE 53
Follow this link after u create beanstalk instance: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-beanstalk-environment.html#routing-to-beanstalk-environment-create-alias-procedure

Reference was -https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-beanstalk-environment.html#routing-to-beanstalk-environment-create-resource-record-set

# Testing
Tests use Junit 5
Here are the steps used to set up Dynamodb local
- https://www.baeldung.com/dynamodb-local-integration-tests
***Viewing generated swagger file when server is running*** : `http://localhost:8080/swagger.json`

# Configs
- API SERVER (Alias): http://api.tarrie.io/



# References for set up
- https://www.mkyong.com/webservices/jax-rs/jersey-hello-world-example/
- https://www.mkyong.com/webservices/jax-rs/json-example-with-jersey-jackson/
- https://github.com/swagger-api/swagger-core/wiki/Swagger-Core-Jersey-1.X-Project-Setup-1.5#hooking-up-swagger-core-in-your-application
- How to live stream: https://stackoverflow.com/questions/41138454/basic-concept-on-live-streaming-video
## Setting up DynamoDb
- https://aws.amazon.com/intellij/
## Setting up AppSync
AWS AppSync uses Mapping Templates for resolvers as described in Resolver Mapping Template Reference which are written in VTL. You can find a programming guide under Resolver Mapping Template Programming Guide.
- https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference.html#aws-appsync-resolver-mapping-template-reference
- https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-programming-guide.html#aws-appsync-resolver-mapping-template-reference-programming-guide

Overview on resolvers
- https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-dynamodb-resolvers.html
## Business Value

**Usage** 
- Api's goal is to drive usage, how many times the end user interacts w/ the system, plus engaging new users. 
- Relies heavily on content generated by users in order to create interest + engagement. 
    - Need to make it easy for a user to share intersting content with the network + extended network -- encourage poeple to contribute meaningful content to system
    - If you want to send an email it should be easy+simple to add the email contents to the system. Either by CC'ing your groups tarrie email or through some other way. *External Write*
    - Easy + simple for events to be listed on  existing Calender like Google Calender. *External Read*
    - In general the ways people previously should be a small jump to integration w/ Tarrie. 
    
*When designing API for usage keep in mind its important to make it easy for end users to add content to the system to make it lively and engaging.**

**Retention**
- Api's goal is to create a situation where it's likely to retain event promoters + groups/clubs by making it so the event/club management + sharing + organizing via Tarrie integrated deeply in workflow. Also improving the process of group managment + event sharing  so much it will literally be hard to leave. So, a shift in experience of creating + mananging + planning + promoting events for curators of content. 

## Metrics to watch

Usage
- Content Curation: Platform write as overall percentage of system activity. 
- Sign-in Activity
- Number of writes per application
- Number of shares/invites per a day (or a week) 

Retention
- percentage of applications still active 3, 6, 12 months into the future: So like customer stickyness. 

## Use Cases
### Note: Use cases are a super set of the minimal-viable-product features; include more features because its important to set up the API so it can handle this shit

Use case 1: Set up profile
- Login with the platform
- Create a user page, profile pic, contacts both internal and external. 
- create a cc email 

Use case 2: Create group
- Logging with the platform
- Invite users to be admin or club members. Optionally because you can have a group with the only admin being the owner
- Set group picture, and tagline. 

Use case 3: Create an event and see that its created ( User and Group)
- Login with the platform
- Create an event using user page or group page
- assing hashtags to event + server categorizes hashtag? --- this is a ML clustering problem no?
- promote the event on Tarrie platform and via email
    - emails will have a link-token asking users to sign up if not part of network. 
- See example of how it looks on mobile app and via email
- read the event stream that displays the new content in context

Use case 4: Explore events by hashtags 


Use case 5: Write to platform from outside of Tarrie
**send email, CC  tarrie email adress,  have event displayed in the event stream authomatically (User and Group)** 
- Setup email for user page
- email event with a picture + description and CC group email
- read the event stream that displays the new content in context
    - (Note this is very similar to kindle, if you send your kindle email a kindle formatted book you downloaded illegally online, it will automatically be on your kindle)

Use case 6: Read from platform outside of Tarrie
** Ical, Google Calender integration of events (not sure of the steps)**
- Choose type of calender to integrate
- walk through of setup of calender integration
- see events on native calender. 

Use case 7: Manage event
-  Promoting events: Share with specific groups on contact list? Share with subscribers + admin? Share within the public network that you are in (Northwestern)? Share with people outside the network?
- Set visbility for event that is posted. Can anyone share it and it will bounce virally around the network? can only groups that 
- Change or delete event, send notificattions about the event. 

Use case 8: Manage group and contacts
- revoke or give new titles such as admin + club memeber
- select frequency of push notifications and communications from group to members.  


Use case 9: Use case 1-4 via mobile so think about what this entials
- Initial Call to platform will include authentication about the resource being requested
- On the platform side the authication data will be processed by the `auth` class of the platform, if crednetials autheticated (who is it?) and authorized (can they do this action?) request passed through server, and response is sent back. 
**In general since mobile is lightweight and poor internet connectivity (1) compress data so the app can download it quicky (2) multiple resources can be requested at a time, so one request to server per page (3) selectivity of the shit you want since we dont want to crash app w/ too much data**

Use case 9: Anonomouys events. Create a event share the link and have the event page be a persistent HTML that people can sign up for: https://www.paperlesspost.com/go/G75WNN2cZXqWWwFwrdMX
## Resources

### Events
List Events:


#### Random Notes
User creates account it and gets a JWT

When you login using rest api, csrf and logout tokens are generated. use the logout_token generated to logout form your app. 

Store authentication + authorization on the users device. Via cookies in the login response, or a sql litedb

Authentication: verifying who the person says he/she is. This may involve checking a username/password or checking that a token is signed and not expired. Authentication does not say this person can access a particular resource.

Authorization: Involves checking resources that the user is authorized to access or modify via defined roles or claims. For example, the authenticated user is authorized for read access to a database but not allowed to modify it. The same can be applied to your API. Maybe most users can access certain resources or endpoints, but special admin users have privileged access.

Either use cookies or local store. Local store is the most consisternt w/ authorization headers.Use the session cookie to determine if a user is logged in or not. 

**Opaque Tokens**
Opaque tokens are literally what they sounds like. Instead of storing user identity and claims in the token, the opaque token is simply a primary key that references a database entry which has the data. Fast key value stores like Redis are perfect for leveraging in memory hash tables for O(1) lookup of the payload. Since the roles are read from a database directly, roles can be changed and the user will see the new roles as soon as the changes propagate through your backend.

Of course, there is the added complexity of maintaining the K/V store and the auth server. Depending on your architecture, each service has to handshake with the auth server to get the claims or roles.
