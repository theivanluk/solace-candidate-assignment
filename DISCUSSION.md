Unfortunately I sepnt too much time trying to set up the database locally with Docker. In the end, Drizzle couldn't connect to postgres on Docker on my machine so I just connected to my local postgres.

## Changes:
Changed the search to be a controlled component that initially searches all fields. This is consistent with React documentation and uses the virtual dom rather than using querySelector.

Changed data fetching to useSwr - This is intended to expose the data, error, and loading states for improved UI/UX.

Removed unnecessary html elements like -br-.

Added a select field option to allow users to search more concisely.

Added styling to page to make it more consistent with currenct solace color scheme.

Made table headers sticky so users can see field names when scrolling down.

## Future changes:

Create filter modal so users can further specify their search. This would be a mobile first approach as is desktop, I believe a search widget would be more ideal for user experience.

Make the search widget sticky to the top of the screen so users don't have to scroll up to edit search

Paginate search to a default limit of 50 results with options to expand results per page to 100 and 200

Change api to take query params for page and pageCount.

Edit api so the search criteria is done on the backend/database. This will improve front end load times since less initial data is needed.

Add prefetch for the next 2 pages of search results.

## Notes:

I initially thought about making the page SSR, but decided against it since this advocates search page seems to be a user specific page after login and doesn't require SEO optimization. CSR pages will put less put less load on the server and provide better response times.

To make the page SSR, I would make a fetch call with the initial data on the async'd page, then pass the data down to the search component so initial data would be rendered server side.