---
layout: exploration
network: true
category: designer
published: true
title: Which websites are used as sources for the designer drugs articles? 
authors:
  - Gabriele Colombo
  - Louis Dijkstra
tools:
  - '[Custom scripts](https://github.com/louisdijkstra/chemical-youth)'
  - '[Gephi](https://gephi.org/)'
  - '[Sigma.js](http://sigmajs.org/)'
datasources:
  - Wikipedia API, English language, accessed between 11-15th July 2016
custom_js: references.js
data: references.json
---
{::options auto_ids="false" /}
{::options parse_block_html="true" /}
<div class="intro">
### Introduction and “How to read”

In this visualization, the different categories of designer drugs are sorted by their color and organized in a network which includes the hosts (marked in black), to which the articles point to. It is possible to see which substances and groups of substances are likely to be discussed in certain sources such as Erowid.org or NCBI. The network is based on an algorithm that organized the most significant hosts in the center and the articles which refer to it around. It is possible to move the network my holding the left mouse key. By a left click onto one of the nodes, one can see the other nodes that are connected to it, sorted by their importance. By using the mouse wheel or the “+” and ”-“ buttons to the right, one can also zoom in and out to have a closer look.

</div>

<div class="protocol">
### How the map is built

1. We downloaded all the external links for each designer drugs. We used the [Wikipedia](https://en.wikipedia.org/w/api.php?action=help&modules=parse) API through custom scripts written in Python.
2. We extracted the hosts for each url.
3. We used Gephi to explore the network and apply filters.
4. We used Sigma.js to visualize the results

</div>

<div class="findings">
### Bias(es) and findings

Most designer drug articles refer to scientific sources represented by NCBI which could indicate that even new designer drugs are relatively well covered by scientific research. It is by far the most significant node in the network which also confirms the tendency of Wikipedia to shift towards more scientific references in general. However, with some groups of substances, the lack of formal knowledge becomes obvious and user generated sources like Erowid.org. Since some designer drugs are not covered by pharmaceutical research yet, hosts from chemistry like commonchemistry.org also play a certain role. On the left, there is also a search window to look for specific hosts or substances within the network.

</div>
