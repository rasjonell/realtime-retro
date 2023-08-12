---
date: 2020-05-29
title: Adding RSS Feed To Serum Static Site Generator
abstract: Creating an RSS Feed generator plugin for Elixir-based Serum Static Site Generator.
---

## Creating The Plugin

I decided not to talk about the importance, simplicity, and necessity of having an RSS feed for your website. So I'm just going to demonstrate how I made a plugin for [Serum](https://github.com/Dalgona/Serum), the static site generator tool(written in Elixir), that I use for this blog.

Serum has a plugin system. For example the Table Of Contents at the top of the article was generated with a plugin. They have a Plugin [Behaviour](https://elixir-lang.org/getting-started/typespecs-and-behaviours.html#behaviours) which you can use to define your own plugin module.

### Serum.Plugin

Serum exposes a number of events(full list can be found [here](https://hexdocs.pm/serum/Serum.Plugin.html#content)) which you can handle. The one I find most useful for the RSS feed generator is `build_succeeded/3`. This particular event is triggered when, as the name suggests, the build step succeeds. After a successful build we want to update our RSS feed so the subscribers can get notified about new posts!

First we need some boilerplate to correctly implement the `Serum.Plugin` behaviour.

```elixir
defmodule Blog.Rss do
  @moduledoc """
  A Serum plugin that create an RSS feed.

  ## Using the Plugin

      # serum.exs:
      %{
        server_root: "https://example.io",
        plugins: [
          Rss
        ]
      }
  """

  @behaviour Serum.Plugin

  @title "Rasjonell's Blog"
  @url "https://www.rasjonell.tech"
  @blog_desc "Random rants about technology"

  @impl true
  def name, do: "RSS Feed Generator"

  @impl true
  def version, do: "0.1.0"

  @impl true
  def elixir, do: ">= 1.7.0"

  @impl true
  def serum, do: ">= 1.2.0"

  @impl true
  def description do
    "Generates an RSS feed for /posts"
  end

  @impl true
  def implements do
    [build_succeeded: 3]
  end
end
```

_Here apart from the necessary function implementations, I've also defined some module attributes such as title and description which will be used latter for generating the RSS feed._

Now that we have our module defined we can start thinking about how we should generate the feed.

RSS, as the name suggests, is really simple.
It's an XML file so we should start with: `<?xml version="1.0" encoding="utf-8"?>`.
Then we need to wrap all of our feed in an `rss` tag like so: `<rss version="2.0"></rss>`

So what are the things that need to be wrapped.

### Channels

Remember the module attributes? We need them to define our channel.
We can define a simple function that returns all the necessary tags with up-to-date information.

```elixir
defp channel do
  """
    <title>#{@title}</title>
    <link>#{@url}</link>
    <description>#{@blog_desc}</description>
    <lastBuildDate>#{current_date()}</lastBuildDate>
    <language>en-us</language>
  """
end
```

See the call to `current_date/0` there? This was the most painful part of developing this plugin. RSS requires dates in the RFC-822 format but Elixir's date-related modules, understandably, don't come with built-in formatting options. So I had to install a dependency. Timex is the library I chose, as it also is a dependency of Serum, so I wouldn't add any more code to the final bundle.

The `current_date/0` function has this definition:
```elixir
defp current_date do
  {:ok, current_date} = Timex.now
    |> Timex.format("{RFC822}")
  
  current_date
end
```

### Items

Now that we have defined our channel description, it's time we add some items.

```elixir
defp item(title, desc, link) do
  """
  <item>
    <title>#{title}</title>
    <description><![CDATA[#{desc}]]></description>
    <pubDate>#{current_date()}</pubDate>
    <link>#{link}</link>
    <guid>#{link}</guid>
  </item>
  """
end
```

Now we can just glue all of these together to generate a feed:

```elixir
defp feed(channel, items) do
  """
  <?xml version="1.0" encoding="utf-8"?>
  <rss version="2.0">
  <channel>
    #{channel}
    #{Enum.join items, ""}
  </channel>
  </rss>
  """
end
```

This pretty much gives us all the building blocks that we need to complete this plugin by reading the posts, generating a feed, and writing it to a file accessible publicly on our website.


### Build Succeeded

To handle the `build_succeeded/3` event we need to implement that behaviour:

```elixir
@impl true
def build_succeeded(_src, dest, _args) do
  :all_posts
  |> Serum.GlobalBindings.get()
  |> build_feed(dest)
  |> create_file(dest)
  |> File.write()

  :ok
end
```

I'll let Elixirs **beautiful** pipe operator do the explaining here.

If you want to use this plugin or just check the final code checkout the [source code](https://github.com/rasjonell/rasjonell.github.io/blob/master/lib/blog/rss.ex).
