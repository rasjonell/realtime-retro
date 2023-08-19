---
date: 2023-04-10
tags: frontend,rendering,architecture
title: The Dialectics of Front End Rendering Techniques
abstract: Using dialectical approach, here we discuss the history and the future of front-end rendering techniques.
---

# Abstract

Front-end rendering techniques have come a long way, from server-side-only to client-side-only rendering, and most recently, to a hybrid approach. In this article, we will dive into the world of front-end rendering and explore how these techniques have evolved over time.

We will take a dialectical approach to examine the advantages and disadvantages of server-side(SSR) and client-side rendering (CSR) and show how a new synthesis, hybrid rendering, is emerging as the ultimate solution.

# Problem and Opportunity

The problem that different front-end rendering techniques aim to solve is the challenge of delivering a fast, interactive, and dynamic user experience on the web. As the internet has evolved, users have come to expect seamless and engaging interactions with websites, which requires complex interactions and rendering content in real-time. However, achieving this level of interactivity can be challenging, especially with the variety of devices and browsers that are used to access the web.

At the same time, the opportunity is immense, with the potential to create richer, more engaging user experiences that drive engagement and revenue. By optimizing the way we render user-facing front-ends and developing new approaches, we can build websites and web applications that are faster, more accessible, and more responsive to user needs.

# Dialectics

Dialectics or The Triad Thesis is defined as a process that makes use of contradictory statements or ideas to reach an ultimate truth.

It is a philosophical concept that states that ideas or concepts develop through a process of contradiction and reconciliation, resulting in a synthesis that is a combination of the two opposing ideas.

There are three main components in this approach:

- **Thesis**: This is the first statement that is put forward in an argument.
- **Antithesis**: This is the statement that looks to contradict the first statement made.
- **Synthesis**: This is a statement that arises from the thesis and the antithesis, and continues the discussion.

To use this approach to analyze the modern state of front-end technologies we can take Server-Side-Only rendering as our **Thesis**, Client-Side-Only rendering as **Antithesis**, and Hybrid rendering technologies as the **Synthesis**.

![Hegel](/hegel.jpeg)

# Thesis: Server-Side-Only Rendering

Before the emergence Single-Page-Applications and Client-Side-Only rendering which are widely used nowadays, Server-Side-Only rendering was(and still is) used for building user-facing front-end clients.

With this technique HTML is generated on the server and sent to the client to display.

![SSR Overview](/ssr-flow.jpg)

As shown on the diagram above, a typical flow using this technique can be described with these steps:

1. The client sends a GET HTTP request to the server for a specific page or resource.
1. The server receives the request and begins processing it.
1. The server retrieves any necessary data from a database or any other data source.
1. The server processes the data and injects it into a pre-existing HTML template for the page.
1. The server sends the fully-rendered HTML document to the client as an HTTP response.
1. The client's browser receives the HTML document and begins rendering it, including any CSS styles or JavaScript interactions included in the HTML.
1. The client's browser handles any client-side interactions or updates to the page, such as form submissions or dynamic content updates.
1. The client interacts with the page as needed, and the process can repeat for additional requests or interactions.

The advantages of using this approach are _Fast initial load time_ and _Great Search Engine Optimization_

- Since the server pre-renders the requested HTML Document our users won't have to wait for the client-side JavaScript to render it after the page has loaded. This results in a faster initial load time as they are able to see the content of the page right away without having to wait for additional rendering to take place.

- Pre-rendering HTML also improves _Search Engine Optimization(SEO)_, because search engines are able to crawl and index the HTML content more easily than JavaScript-generated content. This means that with this technique we can help improve the visibility of a website, which can then lead to more traffic and potential customers.

However, taking into account the recent development and expectations from modern web applications, we can notice a couple of disadvantages for this method.

- While pre-rendering provides a better initial load time, it also leads to _Slower Subsequent Load Times_. Because pre-rendered content is typically static, as the user interacts with the page, each request requires a roundtrip to the server for render.

- Another potential drawback for this method is _Limited Interactivity_ and capabilities when it comes to complex interactions and client-side state management. Since any dynamic content or interactions require additional requests on the server the user experience becomes less seamless.

- Last but not least, As with Server-Side-Only rendering we rely heavily on the server every time we request a page or a resource, our website may also suffer from _High Server Load_ and have issues regarding _Scalability_.

# Antithesis: Client-Side-Only Rendering

Due to the limitations of Server-Side-Only rendering, the web development community started looking for alternative techniques, which led to the emergence of Single-Page-Applications and Client-Side-Only rendering. These approaches addressed the shortcomings of SSR and provided a more dynamic and interactive user experience by generating HTML on the client-side rather than the server.

![CSR Overview](/csr-flow.jpg)

Just like we did for SSR, let's take a look at how a typical request is handled with Client-Side-Only rendering technique:

1. The user opens a web page in their browser, which triggers a GET request to the server.
1. The server sends back a basic HTML document that includes links to CSS and JavaScript files.
1. The browser downloads these files and starts rendering the HTML.
1. The JavaScript code starts executing and initiates API requests to fetch data from the server.
1. Once the data is retrieved, the JavaScript code dynamically updates the HTML in the browser to display the fetched data.
1. The user interacts with the page, triggering events and actions that are handled by the JavaScript code in the browser, without requiring a round-trip to the server.
1. As the user interacts with the page, the JavaScript code may make additional API requests to fetch more data as needed.
1. The browser handles all user interactions and rendering, without requiring any additional round-trips to the server, providing a fast and responsive user experience.

As we can see here, Client-Side-Only rendering tackles some of the issues of traditional SSR systems.

Because of the nature of CSR/SPAs, our websites now feature _More Complex Interactivity_, _Better Client-Side State Management_, and _Faster Subsequent Page Loads_.

- Client-side rendering provides _More Complex Interactivity_ as it allows for dynamic updates and manipulations of the DOM without requiring a full page reload. This is achieved through the use of JavaScript frameworks and libraries, which can handle events and data binding, and update the view layer in real-time. As a result, the user experience is more seamless and interactive, allowing for rich, dynamic web applications.

- This technique also gives us _Better Client-Side State Management_ as the application's state can be updated and modified on the client-side without the need for server round trips, resulting in a faster and more responsive user experience. This is can be achieved through the use of client-side data stores, and while there are many debates and confusions about the way how state management should be handled, overall they allow for efficient data storage and manipulation on the client-side.

- With CSR, _Subsequent Page Loads Are Faster_ as the client only needs to fetch data and render the necessary components, without reloading the entire page. This is because the client-side code has already been downloaded and cached, reducing server load and improving scalability.

Unfortunately this method is not perfect and we have come to realize that it comes with its own set of drawbacks.

- _Slow Initial Load Time_ is one of the main issues with this technique. The client needs to download the entire JavaScript bundle containing the application's logic, state management, templates, and styles, which can be a significant amount of data to process on the first load.

- CSR also has a problem with _SEO_. Search engines may not be able to effectively crawl and index the dynamically generated content, leading to poor search engine rankings for the website. This is because the search engine crawlers typically only see the initial HTML file, which often does not contain the dynamic content generated by the client-side JavaScript code.

# Attempts At Tackling Issues with CSR

Several attempts have been made to tackle the issues related to _SEO_, _Initial_ and _Subsequent_ page load times.

One approach is using client-side JavaScript optimization techniques such as _Code Splitting_ and _Lazy Loading_ to reduce the required bundle size for the initial page load.

_Caching_ and _Prefetching_ are commonly used methods that help client-side heavy applications to make requests to the server in advance and cache the results to tackle the issues of _Subsequent Page Loads_

## Code Splitting and Lazy Loading

Code Splitting is the process of breaking up your application's JavaScript code into smaller chunks that can be loaded on demand.
Lazy Loading is a technique for deferring the loading of non-critical resources until they are actually needed.

In a `React` SPA you can achieve those by using the `React.lazy()` method.

- First you can import your heavy component in this way:

```jsx
const Dashboard = React.lazy(() => import('~/components/Dashboard'));
```

- Next, you can use `Suspense` to render a fallback component while the lazy-loaded `Dashboard` component is being loaded:

```jsx
const App = () => (
  <Layout>
    <React.Suspense fallback={<span>Loading..</span>}>
      <Dashboard />
    </React.Suspense>
  </Layout>
);
```

Popular build toolings detect imports and separate them into smaller chunks, and using lazy-loading techniques like `React.lazy()`, and `React.Suspense` we can reduce the initial bundle size of our application and improve its load time, as your users will now download only the code that they need, when they need it.

## Caching and Pre-fetching

Caching is the process of storing data in the client's browser for later use, while prefetching is the process of proactively fetching and storing resources that a user is likely to need in the future.

![Caching and Pre-Fetching](/cache.jpg)

Let's take a look at the diagram above. We have a web application that displays a list of articles. Each article is displayed as a separate component, and each component makes a request to the server to fetch its data.

To improve subsequent page loads, we can implement caching and prefetching. Here's how it could work:

- **Caching**: Once the user has loaded the article list page, we can store the data needed to display the list of articles in the browser's cache. The next time the user visits the page, the data can be fetched from the cache instead of making a new request to the server. This can significantly improve load times.

- **Prefetching**: We can also prefetch the data for the articles that the user is most likely to visit next. For example, if the user is currently reading article #2, we can prefetch the data for article #3 and #4 in the background using service workers. This way, when the user clicks on article #3 or #4, the data will already be available and the page can load much faster.

## SSR On Initial Page Load

SSR is typically used only for the initial page load, while all other interactions are handled by the Client-Side Rendering (CSR) technique.
Many Hybrid Rendering Frameworks such as Next, Nuxt, SvelteKit, Angular Universal, and many more support this technique and it's proven to be very efficient in combining the benefits of both worlds, resulting in faster initial loading times and a better Search Engine Optimization.

# The Synthesis

Server Side Only(SSR) and Client Side Only Rendering (CSR) were once seen as diametrically opposed approaches to building web applications. SSR focused on generating HTML on the server and sending it to the client, while CSR focused on generating HTML on the client side using JavaScript.

SSR offered benefits such as faster initial page load times and better search engine optimization (SEO) but suffered from slower subsequent page loads and limited interactivity. On the other hand, CSR offered benefits such as more complex interactivity and better client-side state management, but suffered from slower initial page load times and poor SEO.

However, the two approaches were not mutually exclusive, and over time, developers began to combine their benefits by using a hybrid approach known as "Hybrid Rendering." This approach combines the strengths of both SSR and CSR resulting in fast initial page loads, better SEO, and well managed complex interactions.

Frameworks such as Next.js, Qwik, and Astro have embraced this hybrid approach, allowing developers to take advantage of the benefits of both SSR and CSR. In conclusion, the thesis of SSR and the antithesis of CSR have been reconciled into a synthesis of Hybrid Rendering, providing the best of both worlds for building modern web applications.
