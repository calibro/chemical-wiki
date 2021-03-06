---
layout: exploration
network: true
category: designer
published: true
title: Network of co-contributions on designer drug articles
authors:
  - Louis Dijkstra
  - Lisa Krieg
tools:
  - '[Custom scripts](https://github.com/louisdijkstra/wikiscraper)'
  - '[Gephi](https://gephi.org/)'
  - '[Sigma.js](http://sigmajs.org/)'
datasources:
  - Wikipedia API, English language, accessed between 11-15th July 2016
custom_js: cocontribution.js
data: cocontribution.json
---
{::options auto_ids="false" /}
{::options parse_block_html="true" /}
<div class="intro">
### Introduction and “How to read”

This visualization shows for which topics the community of designer drug editors are experts. It accesses the expertise of the editors contributing to the designer drug articles by looking at the _other_ articles to which they contribute. These _other_ articles are the nodes of this network, and all the _other_ articles to which an editor of the designer drug set contributed to are connected through edges. This causes clusters of expertise to emerge.

The colour coding of the nodes gives a hint as to how distinct the contribution behavior is in relation to the average Wikipedia user. Red signifies low relevance, i.e. the designer drug editors did not contribute more than the average Wikipedia user to this article, while blue shows high significance, meaning that the designer drug editors contributed more to these articles than the average Wikipedia community. The greenish, light blue, and particularly the dark blue clusters thus show where the real expertise of the designer drugs editor community lies.[^1]  
</div>

<div class="protocol">
### How the map is built

1. For each designer drugs we used the [xtools-articleinfo](https://tools.wmflabs.org/xtools-articleinfo/) tool to get the users who contributed to the articles.
2. For each user we get the other wikipedia articles he/she contributed the most through [xtools-topedits](https://tools.wmflabs.org/xtools/topedits/) tool.
3. We used [custom scripts](https://github.com/louisdijkstra/wikiscraper) written in Python and R to generate the network.
4. We used Gephi to explore the network.
5. We reduced the original number of nodes (which is over 200,000) by selecting the top 250 articles that received most contributions from the designer drug community, which yielded a set of 7745.
6. In addition, we filtered out nodes with a degree of 1; edges with a weight less than 3 were removed as well.
7. We used Sigma.js to visualize the results

</div>

<div class="findings">
### Bias(es) and findings

The clear clustering of the network shows several distinct topics to which designer drug editors contribute as well. The coloring of the clusters gives a good indication as to how characterizing this co-contribution is in comparison to the average Wikipedia user. A large red cluster on the right contains some of the most popular Wikipedia articles, such as 'Wikipedia', 'George W. Bush', and 'Adolf Hitler'. This cluster of popular articles is coloured red, and thus not particularly characterizing for the editor community at hand. There are smaller red clusters concerning Geography, History, and Sports, which are also dark red, and a few orange clusters about Astronomy, and IT, and an orange-yellow cluster about science-pseudoscience debates, with articles such as 'Alternative Medicine', 'Creationism', and 'Acupuncture'. The latter show a slight above average participation of the designer drugs community. On the left side of the network graph we find the most characterizing topics for the expertise of the designer drug editors. The yellow-green-light blue cluster at the top features diseases of the body, such as types of cancer, 'Crohn's disease', or 'Pneumonia'. It merges into a smaller yellow cluster below, containing articles on Psychiatry, Psychology, and Neurology, with articles such as 'Fibromyalgia', 'Schizophrenia', and 'Alzheimer's disease'. This merges into a bigger, blue to dark blue cluster about Pharmacology and party drugs, with articles such as 'Bupropion' or 'MDMA'. This is where, unsurprisingly, the main expertise of these editors lies. On the bottom left lies a yellow cluster containing articles on Chemistry, such as 'Ethanol' or 'Carbon dioxide'.

The main expertise of the designer drug editors can thus be said to lie in the topics of pharmacology, chemistry, party drugs, and at the intersection of medicine, psychiatry, and psychology.

In terms of bias, it is important to note that this is a network of articles, where topics emerge. The editors themselves are not explicitly represented in this graph. Some topics appear as relatively distinct in the network, while others are more closely connected. These clusters do not necessarily correspond to distinct sub-categories among the editors, and the question whether there are dividing lines among sub-groups of editors remains open.
</div>

<div class="references">
### References

[^1]: Dijkstra, L. J. and Krieg, L. J. 2016. From MDMA to Lady Gaga: Expertise and Contribution Behavior of Editing Communities on Wikipedia. Procedia Computer Science 101: 96–106.
</div>
