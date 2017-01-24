---
layout: exploration
category: designer
published: true
title: Metrics of the designer drugs
authors:
  - Giorgio Uboldi
  - Gabriele Colombo
tools:
  - '[Xtools articleinfo](https://tools.wmflabs.org/xtools-articleinfo/)'
  - '[Tableau](http://www.tableau.com/)'
  - '[D3.js](https://d3js.org/)'
  - '[OpenRefine](http://openrefine.org/)'
datasources:
  - Wikipedia API, English language, accessed between 11-15th July 2016
custom_js: designerdrugsMetrics.js
data: designerdrugs_metrics.tsv
---
{::options auto_ids="false" /}
{::options parse_block_html="true" /}
<div class="intro">
### Introduction and “How to read”

This visualization shows the metrics of all the designer drugs that we found on Wikipedia. By default, they are sorted by name which can be changed by a left click onto the different categories from “Substance” to “First & Last Edit”. “Page Size (Byte)” shows how big the articles are in terms of Bytes which can give a hint about the extent to which the drug is being described and discussed. The “Total Edits” indicate how often an article has been edited so far which can be related to controversies or drugs populated by the media. The “Editors” are the number of people who have been involved in editing the article. Again, many editors can indicate a public interest. The number of “External Links” shows how many links in the article refer to sources outside of Wikipedia. “First & Last Edit” describe how long an article about a substance has been around.
All substance groups can be selected and deselected on the top left. To reset the view, one can use the button to the right.

</div>

<div class="protocol">
### How the map is built

1. We dowloaded some metrics for all the *designer drugs* that we can obtain using [xtools-articleinfo](https://tools.wmflabs.org/xtools-articleinfo/) and [KimonoLabs](https://www.kimonolabs.com/) to automate the process.
2. The results have been parsed/cleaned then using OpenRefine.
3. We used Tableau to explore the data.
4. The final visualization is implemented in d3.js.

</div>

<div class="findings">
### Bias(es) and findings

Using the different modes of sorting the articles, it becomes clear that many popular designer drugs like 2C-I, Mephedrone or JWH-018 are also significant on Wikipedia when it comes to edits and editors. However, many substances related to growth hormones are also widely discussed. The fields of recreational drug research and for instance monitoring performance enhancing drugs (PEDs) in sports could be a further way to use these digital analyses. One must be careful with the interpretation for instance of the article age because it does not necessarily reflect the age of the substance. Often substances are also added in groups which says more over a certain editing practice than the novelty of the drugs.  

</div>
