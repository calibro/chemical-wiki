---
layout: exploration
network: true
category: designer
published: true
title: Editors network
authors: How 
  - Louis Dijkstra
  - Giorgio Uboldi
tools:
  - '[Custom scripts](https://github.com/louisdijkstra/chemical-youth)'
  - '[Gephi](https://gephi.org/)'
  - '[Sigma.js](http://sigmajs.org/)'
datasources:
  - Wikipedia API, English language, accessed between 11-15th July 2016
custom_js: editors.js
data: editors.json
---
{::options auto_ids="false" /}
{::options parse_block_html="true" /}
<div class="intro">
### Introduction and “How to read”

In this network visualization, we wanted to explore whether the editors of designer drug articles cluster in communities, i.e. whether the same people edit similar articles.
The visualization shows a network graph, in which the editors appear as gray squares, and the articles as colorful dots. The color is derived from the category of the substance, as follows:

* Synthetic Cannabimimetics
* Psychedelics
* Stimulants
* Nootropics
* Empathogens
* Sedatives
* Androgens
* Dissociatives
* Peptides
* Piperazines
* PDES Inhibitors

Due to the algorithms of the network visualization software, article groups that are frequently edited by the same editors are drawn closely together. This leads to more or less dense clusters. The denser a cluster, the more we can talk about editor communities, as these article clusters are most frequently edited by the same group of people.
Bots (Wikipedia's automatic changes), anonymous editors, and editors who made only one edit or only minor edits have been filtered out and do not appear on this map.
</div>

<div class="protocol">
### How the map is built

1. For each designer drugs we used the [xtools-articleinfo](https://tools.wmflabs.org/xtools-articleinfo/) tool to get the users who contributed to the articles.
2. For each user we get the other designer drug articles he/she contributed the most through [xtools-topedits](https://tools.wmflabs.org/xtools/topedits/) tool.
3. We used custom scripts written in Python to generate the network
4. We used Gephi to explore the network .
5. We used Sigma.js to visualize the results

</div>

<div class="findings">
### Bias(es) and findings

The closest and clearest clustering can be seen at the blue cluster at the bottom right, for synthetic cannabimimetics. The group of people who contribute to these articles can thus be considered a relatively specialized community, as they contribute much more to these articles than to others, and the articles are mainly edited by this group of people. The bright green cluster at the top is less dense, but is also distinct. It contains articles on Psychedelics, with a few articles on Empathogens. The distinction between these two categories of substances is rather blurred. Both types of articles appear also in other areas of the network, but there is still a community of editors who focus on Psychedelics. The red androgens and the blue-green nootropics cluster at the bottom left, but they are less distinct. Articles of the other substance categories are mingled together in the center. For Cannabimimetics and Psychedelics, it would thus, on the basis of this network, make the most sense to talk about distinct expert editor communities.
Another way to use this graph is to look at the ego-networks of single editors. It thus becomes visible that there are a few editors in the center of the graph that form hubs around them. These roughly four editors have contributed to a large number of articles all over the categories, and are thus apparently responsible for much of the content of this set of articles.

One bias of this graph lies in the fact that the exact contribution remain invisible. While we can get an idea about how many contributions an editor makes, we do not know if a large part of this is maintenance. An editor who contributed several in-depth segments of text appears here as less significant than an editor who writes little, but does a lot of formatting. The colour-coding of the articles also needs to be considered carefully. We used Wikipedia's own categories for the substance articles, because manual categorization for such a large data set would have been too time consuming. Alternative categories, such as regarding the main function, use, or mode of consumption of the substance, are neglected here.

</div>
