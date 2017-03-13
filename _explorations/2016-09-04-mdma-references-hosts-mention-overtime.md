---
layout: exploration
category: medical
published: true
title: Which websites are used as sources for the article “MDMA”? 
authors:
  - Matteo Azzi
  - Giorgio Uboldi
  - Natalia Sanchez-Querubin
tools:
  - '[Raw](http://rawgraphs.io)'
  - Adobe Illustrator
  - '[Ai2Html](http://ai2html.org/)'
datasources:
  - Wikipedia API, English language, accessed between 11-15th July 2016
static: mdmahosts
custom_js: mdmahosts.js
data: mdmaHosts.tsv
---
{::options auto_ids="false" /}
{::options parse_block_html="true" /}
<div class="intro">
### Introduction and “How to read”

In order to examine the dynamics of knowledge sources over time, and changes in the authority of sources, we looked at the references of the MDMA article. The references are used to justify and legitimate the information presented in the main article, and are thus a good indication for the dynamics of knowledge over time.
The X-Axis represents the time, beginning at 2001 until 2016. The Y-axis sum all the different references that are mentioned in the MDMA article. Some references may disappear, appear later in time or reappear at a certain point.

</div>

<div class="protocol">
### How the map is built

1. We downloaded all the _external links_ for each first revision for each month since the page was created. We used the [Wikipedia API](https://en.wikipedia.org/w/api.php?action=help&modules=parse) through custom scripts written in _Node.js_.
2. We extracted the hosts for each url and aggregated them per year.
3. We kept the hosts that are present at least more than 2 years.
4. We used Raw to visualize the results

</div>

<div class="findings">
### Bias(es) and findings

The most significant finding is that the evolution of the website shows a clear development from informal and more experience and practice-oriented sources (e.g. pillreports.com) towards more formal and scientific sources, represented by doi.org and nih.gov (both organizing large amounts of scientific journals and articles) and maps.org which is also creator and curator of scientific articles in the field of psychoactives, while, however being privately funded and dedicated to exploring therapeutic uses of psychoactives, and thus not necessarily part of the scientific establishment. The importance of non-governmental sources for MDMA users is sometimes criticized as a potential threat to biomedical interpretation[^1] , and sometimes a useful addition to it[^2].  It is also worth noticing that Erowid.org is again one of the most consistent sources, reflecting its pivotal function between user cultures and scientific research (ibd).
Bias is introduced here through the method: we relied on hosts as a proxy for the knowledge source. In some cases, the host is an accurate enough description of the kind of knowledge provided. In others, it is a common denominator for very different types of knowledge. These specificities are rendered invisible with this approach.


</div>

<div class="references">
### References

[^1]: Falck, Russel S.; Carlson, Robert G.; Wang, Jichuan; Siegal, Harvey A. (2004): Sources of information about MDMA (3,4-methylenedioxymethamphetamine): perceived accuracy, importance, and implications for prevention among young adult users. In: Drug Alcohol Depend 74 (1), S. 45–54. DOI: 10.1016/j.drugalcdep.2003.11.009.

[^2]: Boyer, Edward W.; Lapen, Peter T.; Macalino, Grace; Hibberd, Patricia L. (2007): Dissemination of psychoactive substance information by innovative drug users. In: Cyberpsychology & behavior : the impact of the Internet, multimedia and virtual reality on behavior and society 10 (1), S. 1–6. DOI: 10.1089/cpb.2006.9999.

</div>
