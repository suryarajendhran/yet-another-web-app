# Yet another web app

This is a React web app that implements the specs outlined in an assignment provided by vector.ai
I'm gonna walk through my thought process through the various parts and stages below. Hope you have fun reading it :)

## Part 1

This objective of this part is to build a gallery-like React app in which images (with text) can be dragged around and viewed in a modal. In addition to that, the images should have a spinner while they load. I'd say that this took me a total of an hour and a little bit more. Most of which I spent creating the layout. So here's the process along the way

### To ```npm i``` or not

Obviously the first thing that crossed my mind was to evaluate libaries that implemented the features I wanted. So I took a quick google search to find out that there were a few really good packages available for the two tasks at hand: repositioning items and image spinner.

**Libraries for the drag and drop feature:**

1. react-dnd
2. beautiful-react-dnd (Built by the amazing folks at Atlassian)
3. react-grid-layout (This was my top contender as I've used the vue equivalent before and it's quite pleasant)

But the first two options weren't well suited for a two-row system (which was a fun little gotcha). And by the time I looked at react-grid-layout I'd read about the HTML drag and drop api enough to just build it myself. Plus react-grid-layout requires a cartesian coodinate system to assign positions which seems a bit overkill for this use-case.

### Building my first masonry-ish layout and spinner

So I hooked onto the API events and was able to get the info of the card that was being dragged and the card that was being dropped onto. Then came another significant design choice: How do I mutate the order of the elements?

As of then, the cards were located inside a grid layout and I needed to figure out two things:
1. How to display the cards after the mutation
2. How to store the change of location in state

The first solution I thought of was to use the array indexes to inform the order to the UI and for mutations I can move the array items as necessary. Then during development, I chose to move just swap values of type and title and keep the actual array element the same. Essentially, creating a fallback using the position field.

Next I needed to build a spinner/loader enabled image component. Surprisingly, I've never built an image loader or spinner animation/element myself. I've always used an 3rd party image component or a organisation-specific image component so this was a fun little adventure. It took only a couple of minutes but I consider it a small fun little milestone to have built my first image loader and drop/drop layout.

The modal for the image viewer was the final part and nothing remarkable to say there except I got stuck listening for the keypress event on a stupid div lol. 

All in all was quite fun to do the frontend. Really had to force myself not to fiddle with UI too much and not build excess features.

### Here's how you can view this version

1. Checkout the branch [part1-frontend-freeze](https://github.com/suryarajendhran/yet-another-web-app/tree/part1-frontend-freeze)

   ```git checkout part1-frontend-freeze```
2. Switch to the frontend folder

   ```cd frontend```
3. Install dependencies

   ```npm install```
4. Serve the app locally using the development build:

   ```npm start```

## Part 2

### API Design

Part 2 was a lot of familiar than it's predecessor. The simplest API that can get the job done would need to do only two things:

1. Retrieve the items from a table
2. Update the positions of the items in the table

The data model and operations were simple enough to not necessitate the use of an ORM so I just needed a tool that was high level enough to manage the connections and can let me swap between different database engines (SQLite and PostgreSQL for example).

The starlette recommended databases package was just the right answer. Plus it worked with SQLAlchemy & Alembic in case I needed to do more.

Then I made the migrations & seeding part of the on_startup hook of starlette so that was out of the way. Then I simply tested the API for read and update.

### Getting docker setup

The documentation for the recommended starlette docker image was quite simple and I got it up and running in a few minutes. But I did run into a small issues with using pipenv to install a packages. After a few minutes trying to fix it I just assumed that the docker image was using a different way running the uvicorn server so changed the Dockerfile to generate a requirement.txt on the fly and use that to ```pip install```

Then there was the matter of connecting my trusty old PostgreSQL container to the API container. While I could've skipped this step during this stage I know I probably needed this for the deployment stage so I just got it out of the way. Looking back at it, I could've definitely skipped the docker part and completed all of this in 30 minutes tops. But hindsight is 20/20.

### Here's how you can view this version

1. Checkout the branch [part2-making-the-call-freeze](https://github.com/suryarajendhran/yet-another-web-app/tree/part2-making-the-call-freeze)

   ```git checkout part2-making-the-call-freeze```
2. Switch to the backend folder

   ```cd backend```
3. Install dependencies

   ```pipenv install```
4. You can connect the app to a database by editing one of the .env templates (postgres, sqlite) and then renaming the file to .env. If you're lazy then sqlite is the way to go. If you skip this step, the app will complain about it.
5. Serve the api locally

   ```pipenv run uvicorn main:app```

### API Endpoints

| Route      | Method | Accepts body | Returns |
| ----------- | ----------- | --------- | ------ |
| / | GET | None | Array of all items |
| / | POST | Array of items to be updated in the format {id: , position:} | Status code 200 if accepted, error if not |

## Part 3

In this part, the frontend is to be connected to the API to enable querying the items and conditional updates every 5 seconds. Simple enough. But holding the state reliably on the frontend and comparing it to the saved state was going to be a task. So I went with the approach that was closest fit with the frontend architecture. You can skip straight to the second approach if you want to see what I actually did rather than my process.

### Approach 1: History

This was the obvious approach. Hold the older/saved data into another state variable that we can check against and then save it the differences to the API. It was during this time, I learnt a bit more about React Hooks, for example, I learnt that the state variable is not accessible inside the method that was called during the save process. Then I had to do a bit of research and find out that I had to use useRefs here. They should add that in the React documentation. So I encountered two silly but time consuming bugs that I'd like to highlight:

1. **Unintended updates to saved state:** What I observed here is that any change to the state variable holding the current state was reflected in the state variable holding the saved state. Obviously, I did the usual thing of using Array.from() and then array destructuring before I realised that it's a bit different for an array of objects. So sorted that out.
2. **Array reordering:** My decision to base the rendering of the cards on the basis of an array and then updating position by reordering the array came to haunt me. But I was able to circumvent that by some defensive programming to ensure the array or the order is not corrupted

I was able to get the application working just fine with the history approach and you can find it in the branch [history-approach](https://github.com/suryarajendhran/yet-another-web-app/tree/history-approach) to look at it. It's a bit messy.

### Approach 2: Grid order approach

Somehow this didn't strike me during the development of the drag and drop feature but I realised that I could easily position the items using the order property in CSS Grid. By mapping the order CSS property to the position property of each array item, I got the positioning perfect. Now updating the layout can be done by simply checking the position property.

After messing around with state variables, I found it better to simply store the old info into LocalStorage and then compare with the current state. I know it be more performant if stored as a state variable but I preferred this approach for now as it would isolate the saved state. And calculating updates was a simple matter of comparing arrays.

### Here's how you can view this version

1. Checkout the branch [part3-tying-it-up-freeze](https://github.com/suryarajendhran/yet-another-web-app/tree/part3-tying-it-up-freeze)

   ```git checkout part3-tying-it-up-freeze```
2. Switch to the backend folder

   ```cd backend```
3. Install dependencies

   ```pipenv install```
4. You can connect the app to a database by editing one of the .env templates (postgres, sqlite) and then renaming the file to .env. If you're lazy then sqlite is the way to go. If you skip this step, the app will complain about it.
5. Serve the api locally

   ```pipenv run uvicorn main:app```
6. Or you can build the docker image and run it from that but I'll explain more in the next part
7. Open a new terminal and switch to the frontend folder

   ```cd ../frontend```
8. Install dependencies

   ```npm i```
9. Run the React app locally

   ```npm start```

## Part 4

This is the deployment stage and I had to get familiar with docker-compose as I'd only worked with vanilla docker before but it turned out to be a handy tool. After a little bit of testing, I was able to get the services running fine. One thing to note is that the starlette APIs weren't serving the react app but an nginx container was. I chose to do this so that I could debug easier and to keep concerns separate.

You don't need to checkout any branches to see the app at this stage, you can simply run it from the main branch. But before you do that, you just need to setup the .env file. You can go ahead and rename the .sample.env file at the root folder to have reasonable defaults:

```mv .sample.env .env```

Then you can use docker-compose to have the application served at [http://localhost:8888]

```docker-compose up```

### Known issues

1. **Duplicate table creation/seeding:** The docker image that was recommended in the assignment spins up multiple processes and therefore caused all of the process to try to create and seed the table. While this didn't corrupt the database, it did throw an error on the server processes especially the first time the service was started. I could've sorted this by moving the table creation and seeding to a separate python file as a part of pre_startup script but I circumvented this by setting ```restart: unless-stopped```. This sorted the problem but better solution would be to make it part of the pre_startup script and avoid the error.