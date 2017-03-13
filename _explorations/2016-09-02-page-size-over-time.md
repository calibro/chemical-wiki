---
layout: exploration
category: medical
published: true
title: How the page size evolved over time?
tools:
  - '[Xtools articleinfo](https://tools.wmflabs.org/xtools-articleinfo/)'
  - '[Tableau](http://www.tableau.com/)'
  - '[D3.js](https://d3js.org/)'
datasources:
  - Wikipedia API, English language, accessed between 11-15th July 2016
authors:
  - Giorgio Uboldi
  - Louis Dijkstra
custom_js: size.js
data: medical_size.tsv
---
{::options auto_ids="false" /}
{::options parse_block_html="true" /}
<div class="intro">
### Introduction and “How to read”

In order to get a better insight into the dynamics of the development of the articles on the substances in focus, we build this map. It shows the development of the size of the article page. The longer an article, but also the more pictures and tables it features, the larger its size. Every data point on the graph corresponds with the size of the article at one moment. With growing public interest and knowledge about a substance, and an increasing relevance of Wikipedia, substance articles also grow. Outliers, i.e. data points that are much higher or lower than the data points around them, are most probably a sign for vandalism (e.g. adding large amounts of data, such as nonsensical text, or removing the page altogether). An unstable page size can be an indication of disagreements about the content among the editors, it can be caused by vandalism, or by splitting one article into several sub-articles.
The normalized view of the map removes relative differences between small and large pages, and only shows the relative changes in the size of the page. The absolute view also gives an indication which pages are bigger and smaller in absolute numbers, but the changes can be less clear. We also added an option to remove vandalism. Singular acts of vandalism on pages can increase the page size to a very large number or to zero. Such extreme values can be removed from the map for better readability.

</div>

<div class="protocol">
### How the map is built

1. We selected 9 wikipedia article URLs and for each of them we used [wikipedia2geo](https://tools.digitalmethods.net/beta/wikipedia2geo/) to get all the edits.
Attached to each edit we have the size of the page.
2. We merged the files and we used Tableau to explore the data.
3. Sometimes the size of the page increases or decreases unexpectedly. That's due probably to *vandalism*. We quickly calculated and isolated the outliers (1.5 IQR) and added a checkbox to remove them from the visualization.
3. The final visualization is implemented in d3.js and rendered in _canvas_ due to the large amount of element to visualize (>50k).

</div>

<div class="findings">
### Bias(es) and findings

This maps shows a few interesting issues. Firstly, vandalism appears as a significant issue, particularly on the pages about MDMA, Psilocybin mushroom, LSD, and Cannabis (both). Ketamin, Psilocybin, DMT, and Ayahuasca show, in comparison to this, only little signs of vandalism. More qualitative research, by going deeper into the details of the particular editing histories, is necessary in order to explain this. Some pages show a very steady and calm growth, such as Psilocybin and DMT, while other pages appear to have more turbulent periods. These periods, such as 2005 - 2008 for the Cannabis pages, or 2005 - 2009 for the Psilocybin mushroom page, can be interesting points to intersect with more qualitative research. Similarly, moments of sudded growth or site reduction can be interesting points to look into in more depth.

Biases of this map lie in the issue of vandalism, and in the distant view of the map and the single focus on size. While we attempted to make vandalism visible and remove it from the map for better readability, it remains problematic. It is not always possible to identify vandalism, and distinguish it e.g. from disagreements between editors, or editing accidents. The reason for vandalism is also not visible on this map. The single focus on size gives a good overview, but it also means that pictures, with their larger sizes than text, get more weight in the graph than text. The qualitative content of the change is invisible. Removing or adding a few pictures appears on this map as a significant change, while changes in the text of the article can be almost invisible.
</div>
