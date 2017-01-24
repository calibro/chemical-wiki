---
layout: exploration
category: designer
published: true
title: EMCDDA watchlist and Wikipedia timeline
authors:
  - Moritz Berning
  - Giorgio Uboldi
datasources:
  - Wikipedia API, English language, accessed between 11-15th July 2016
  - '[EMCDDA](http://www.emcdda.europa.eu/publications-database?f[0]=field_series_type:551)'
tools:
  - '[Tableau](http://www.tableau.com/)'
  - '[D3.js](https://d3js.org/)'
custom_js: watchlist.js
data: watchlist.tsv
---
{::options auto_ids="false" /}
{::options parse_block_html="true" /}
<div class="intro">
### Introduction and “How to read”

How up to date is the knowledge about designer drugs on Wikipedia? In order to explore whether Wikipedia is a cutting edge source for designer drugs information, or whether it mainly features well known substances, we compared the appearance of various designer drugs on Wikipedia and with the date they were added to the EMCDDA watch lists. The EMCDDA, or European Monitoring Centre for Drugs and Drug Addiction, is an organization that monitors drugs and drug use in Europe. Designer Drugs are one of the phenomena that the EMDDA focuses on and their appearance and monitoring is one of the key tasks (EMCDDA 2016). In this interactive graph, you can see above an X-axis with a timeline on which different designer drugs appear in time, shown on the Y-axis. The red dot represents the point in time when the drug came on the EMCDDA watch list, the blue dot when it appeared on Wikipedia. The distance between the dots represents the time that has passed in between.

</div>

<div class="protocol">
### How the map is built

1. We chacked all the [designer drugs](https://en.wikipedia.org/wiki/List_of_designer_drugs) of the Wikipedia list that are also present in the EMCDDA’s watchlist.
2. We downloaded all the EMCDDA’s reports from here and we manually filled the spreadsheet with the date the substance has been added to the EMCDDA’s list.
3. We than enriched the file getting the date of the first edit on Wikipedia and the category.
4. We used Tableau to explore the data.
5. The final visualization is implemented in d3.js.

</div>

<div class="findings">
### Bias(es) and findings

The most significant finding is that Wikipedia played an important role for the knowledge about these new substances until approximately 2012, with the EMCDDA reacting often years later. Being an internet and technology born phenomenon to a large extend[^1] [^2], hundreds of designer drugs were represented on Wikipedia before the EMCDDA and the European countries have discovered them. However in recent years that relationship changed and today, many substances appear on the watch lists before there is an article on Wikipedia about them. This can be explained in several ways: either the EMCDDA started monitoring Wikipedia and also extended its online research to user-driven websites where these substances are discussed, sold and experimented with early on[^1], or Wikipedia transformed into a source for rather stabilized knowledge, with cutting edge knowledge about designer drugs being found elsewhere, e.g. in fora and blogs.

</div>

<div class="references">
### References

[^1]: Berning, M., & Hardon, A. (2016). Educated Guesses and Other Ways to Address the Pharmacological Uncertainty of Designer Drugs: An Exploratory Study of Experimentation Through an Online Drug Forum. Contemporary Drug Problems, 43(3), 277–292. http://doi.org/10.1177/0091450916662164

[^2]: Móró, Levente. "Harm reduction of novel psychoactive substance use." Change and Continuity: researching evolving drug landscapes in Europe. Lengerich: Pabst Science Publishers (2014): 36-50.
</div>
