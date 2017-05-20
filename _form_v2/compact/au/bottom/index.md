---
---
{% assign path = page.path | split:"/" %}
{% assign template = path[0] | slice: 1, path[0].size | append: '.html'  %}
{% include {{ template }} %}