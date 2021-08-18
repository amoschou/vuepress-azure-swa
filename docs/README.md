---
layout: LayoutAuth
home: true
actions:
  - text: Enter site
    link: /home/
    type: primary
  - text: Log out
    link: /auth/logout/logout.html
    type: secondary
navbar: false
editLink: false
lastUpdated: false
contributors: false
sidebar: false
authRequirements:
  any: ['admin', 'staff', 'member']
---

::: tip Logged in
<p><Auth /></p>
:::
