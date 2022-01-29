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

### Here's how you can view it

1. Checkout the branch [part1-frontend-freeze](https://github.com/suryarajendhran/yet-another-web-app/tree/part1-frontend-freeze)
2. Switch to the frontend folder: ```cd frontend``` 
3. Serve the app locally using the development build: ```npm start```
