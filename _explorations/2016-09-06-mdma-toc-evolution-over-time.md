---
layout: exploration
category: medical
published: true
title: How has the table of content of the article "MDMA" evolved?
authors:
  - Matteo Azzi
  - Lisa Krieg
tools:
  - '[Custom scripts](https://github.com/uf0/wiki-toc-scraper)'
  - '[Tableau](http://www.tableau.com/)'
  - '[D3.js](https://d3js.org/)'
datasources:
  - Wikipedia API, English language, accessed between 11-15th July 2016
custom_js: tocMDMA.js
data: MDMA_toc.tsv
---
{::options auto_ids="false" /}
{::options parse_block_html="true" /}
<div class="intro">
### Introduction and “How to read”

In order to explore changes in the content of the MDMA article over time, and especially in order to see how medical or therapeutic benefits are discussed in opposition to risks, we explored the changes in the Table of Contens as a proxy. Instead of reading the different versions of the article, we only looked at the section headings. Thus, we can see when a certain topic is introduced into the article and how it moves around inside the article.
This graph shows when a topic appears or is changed on the X-axis (timeline). The Y-axis corresponds to the location of the topic in the article: higher up means the section is located at the top of the article, closer to the x-axis means it can be found at the bottom of the article.
Due to the mass of data, we did not look at all the section headings, but only at those with connection to the topics of positive and negativ **effects**, **research**, **uses**, and **safety**. The location of one section at a certain point in time and at a certain place in the article is represented by a coloured dot on the graph. The size of the dot corresponds to the size of the section, its colour to one of the aforementioned categories.

</div>

<div class="protocol">
### How the map is built

1. We downloaded all the revisions id and through the [Wikipedia API](https://en.wikipedia.org/w/api.php?action=help&modules=parse) we queried just the TOC.
2. We extracted all the unique _Titles_ and selected just the one we were interested in.
3. From that list we look at the evolution over time of each _Title_ taking in account the position inside the TOC and the amount of text (expressed in byte).
4. We used Tableau to explore the data.
5. We used Raw to visualize the results.

</div>

<div class="findings">
### Bias(es) and findings

This analysis shows that a lot of space of the MDMA article is dedicated to the description of the effects. Safety issues and risks accompanying the use of this drug have also always been an issue throughout the existence of the article, but interestingly, these sections have moved more towards the bottom and seem to decrease in size. New paragraphs about medical uses and use in psychotherapy have been introduced in 2016, at the very top, albeit very small in size.

This method is used in a rather exploratory fashion, as a proxy for the content of the changing article versions. It is based on a qualitative categorization of section headings into one of the four categories, and into sounding either benefit-focused, neutral, or risk-focused. This categorization is rather crude, and only based on the title, not on the content of the section. It is thus prone to contain errors, and has to be taken as showing a trend rather than a precise development.
</div>
