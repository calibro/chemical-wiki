---
layout: exploration
category: medical
published: true
title: Ayahuasca TOC evolution over time
authors:
  - Matteo Azzi
  - Lisa Krieg
tools:
  - '[Custom scripts](https://github.com/uf0/wiki-toc-scraper)'
  - '[Tableau](http://www.tableau.com/)'
  - '[D3.js](https://d3js.org/)'
datasources:
  - Wikipedia API, English language, accessed between 11-15th July 2016
custom_js: tocAyahuasca.js
data: ayahuasca_toc.tsv
---
{::options auto_ids="false" /}
{::options parse_block_html="true" /}
<div class="intro">
### Introduction and “How to read”

In order to explore changes in the content of the Ayahuasca article over time, especially concerning the topics of medical benefits as opposed to risks, we explored the changes in the Table of Contens as a proxy. Instead of reading the different versions of the article, we only looked at the section headings. Thus, we can see when a certain topic is introduced into the article and how it moves around inside the article.
This graph shows when a topic appears or is changed on the X-axis (timeline). The Y-axis corresponds to the location of the topic in the article: higher up means the section is located at the top of the article, closer to the x-axis means it can be found at the bottom of the article.
Due to the mass of data, we did not look at all the section headings, but only at those with connection to the topics of positive and negativ **effects**, **research**, **uses**, and **safety**. The location of one section at a certain point in time and at a certain place in the article is represented by a coloured dot on the graph. The size of the dot corresponds to the size of the section, its colour to one of the aforementioned categories.
</div>

<div class="protocol">
### How the map is built

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam maximus velit ac tortor bibendum, sit amet lobortis lectus pulvinar. Pellentesque ultricies massa sit amet ipsum pharetra bibendum.

1. step bla bla
2. step etc

</div>

<div class="findings">
### Bias(es) and findings

This analysis shows a relatively neutral representation of the substance Ayahuasca, without emphasis of either risks or benefits. Safety warnings appear only once in 2014, but were removed. A small section on therapeutic uses is introduced in 2016. This development of the Table of Contents mirrors the ongoing research on Ayahuasca, and shows that the knowledge about this substance is not stabilized, as has also been shown in the analyses of the article references.

This method is used in a rather exploratory fashion, as a proxy for the content of the changing article versions. It is based on a qualitative categorization of section headings into one of the four categories, and into sounding either benefit-focused, neutral, or risk-focused. This categorization is rather crude, and only based on the title, not on the content of the section. It is thus prone to contain errors, and has to be taken as showing a trend rather than a precise development.
</div>
