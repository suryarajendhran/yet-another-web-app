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
2. Switch to the frontend folder

   ```cd backend```
3. Install dependencies

   ```pipenv install```
4. You can connect the app to a database by editing one of the .env templates (postgres, sqlite) and then renaming the file to .env. If you're lazy then sqlite is the way to go. If you skip this step, the app will complain about it.
5. Serve the app locally

   ```pipenv run uvicorn main:app```

### API Endpoints

| Route      | Method | Accepts body | Returns |
| ----------- | ----------- | --------- | ------ |
| / | GET | None | Array of all items |
| / | POST | Array of items to be updated in the format {id: , position:} | Status code 200 if accepted, error if not |
