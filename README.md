# vuepress-azure-swa

A template for a VuePress site published to Azure Static Web Apps with authentication and authorisation.

## Set up

Follow the process outlined at:
  * [Getting started](https://v2.vuepress.vuejs.org/guide/getting-started.html)
  * [Tutorial: Publish a VuePress site to Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/publish-vuepress)

You may also need to set `app_build_command: "npm run docs:build"` in the `Repository/Build Configurations` section of the `YAML` workflow file. This template has:

```yaml
          ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
          # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
          app_location: "/" # App source code path
          api_location: "" # Api source code path - optional
          output_location: "/docs/.vuepress/dist" # Built app content directory - optional
          app_build_command: "npm run docs:build"
          ###### End of Repository/Build Configurations ######
```

## App structure

### Roles

This example has five roles. Two roles (`anonymous` and `authenticated`) are required by Azure. The other three roles (`member`, `staff` and `admin`) are to do with the app.
* `anonymous`: Required by Azure. Any user automatically has an `anonymous` role.
* `authenticated`: Required by Azure. Any logged in user automatically has an `authenticated` role.
* `member`: A standard role.
* `staff`: An elevated role.
* `admin`: A highly elevated role.

### Routes

This app has the following routes and permissions:

| Routes | Information |
| ------ | ----------- |
| `/` | Only for `admin`, `staff` or `member` users. Other `authenticated` or `anonymous` users can not visit this route. |
| `/home/` | Only for `admin`, `staff` or `member` users. Other `authenticated` or `anonymous` users can not visit this route. |
| `/admin/` | Only for `admin` users. Other `authenticated` or `anonymous` users can not visit this route. |
| `/staff/` | Only for `admin` or `staff` users. Other `authenticated` or `anonymous` users including `member` users can not visit this route. |
| `/member/` | Only for `admin` or `member` users. Other `authenticated` or `anonymous` users including `staff` users can not visit this route. |
| `/auth/login/` | Users who have `anonymous` and not `authenticated` roles can visit this route. It has links to the login pages for different authorisation providers. |
| `/auth/login/aad.html` | Users who have `anonymous` and not `authenticated` can visit this route. It redirects to `/.auth/login/aad` for Azure authentication using Azure AD. |
| `/auth/login/twitter.html` | Users who have `anonymous` and not `authenticated` can visit this route. It redirects to `/.auth/login/aad` for Azure authentication using Twitter. |
| `/auth/login/github.html` | Users who have `anonymous` and not `authenticated` can visit this route. It redirects to `/.auth/login/github` for Azure authentication using GitHub. |
| `/auth/logout/` | Users who are `authenticated` but do not have any of `admin`, `staff` or `member` roles can not visit the site content and will be invited to log out by being redirected to this page. |
| `/auth/logout/logout.html` | Any `authenticated` user can visit this page, it will redirect them to `/.auth/logout` and log them out. |

### Components

The `<Auth>` component displays the name and identity provider for the logged in user.

## Files

### `/docs/.vuepress/auth/rules.json`

`rules.json` lists the route based authentication that Vue Router follows. This `json` file is referenced by the navigation guard in `clientAppEnhance.ts`. This is necessary, as navigation is handled by Vue Router, a `staticwebapp.config.json` file is insufficient to protect app content via routes based authentication and authorisation.

`rules.json` is an array of objects, where each object is of the form:

```json
{
    "role": String,
    "elevated": Boolean,
    "exceptions": Array,
    "redirect": String
}
```

The role is a non-empty string of letters, numbers or underscores. If the role is elevated, then a user with that role can visit any route in the app except those routes listed in the exceptions. If the role is not elevated, then the use can visit only those routes listed in the exceptions, unless the user also has a higher ranked role. If the user attempts to visit a route that they are not priviliged for, then they will be redirected. Wildcard routes are not yet interpreted. Privileges are evaluated in order of their index in the array and should therefore be listed from most privileged to least privileged. Generally speaking, the elevated roles will be listed first, and the other roles subsequently. `authenticated` and `anonymous` would always be listed finally.

#### Example

```json
[
    {
        "role": "admin",
        "elevated": true,
        "exceptions": [],
        "redirect": null
    }, {
        "role": "staff",
        "elevated": true,
        "exceptions": [
            "/admin/",
            "/member/",
            "/auth/logout/",
            "/auth/login/",
            "/auth/login/aad.html",
            "/auth/login/twitter.html",
            "/auth/login/github.html"
        ],
        "redirect": "/home/"
    }, {
        "role": "member",
        "elevated": false,
        "exceptions": [
            "/home/",
            "/member/",
            "/auth/logout/logout.html"
        ],
        "redirect": "/home/"
    }, {
        "role": "authenticated",
        "elevated": false,
        "exceptions": [
            "/auth/logout/",
            "/auth/logout/logout.html"
        ],
        "redirect": "/auth/logout/"
    }, {
        "role": "anonymous",
        "elevated": false,
        "exceptions": [
            "/auth/login/",
            "/auth/login/aad.html",
            "/auth/login/twitter.html",
            "/auth/login/github.html"
        ],
        "redirect": "/auth/login/"
    }
]
```

In this example, there are five roles supported by the app: `admin`, `staff`, `member`, `authenticated` and `anonymous`. `authenticated` and `anonymous` are mandatory roles as required by Azure SWA authentication. The other three are related to the function of the app. Role management for users is outlined at [Authentication and authorization for Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/authentication-authorization).

The most priviliged role is `admin` and `admin` users can visit all routes. `staff` users can visit all routes except `/admin/`, `/member/`, `/auth/logout/`, `/auth/login/` and its subroutes `/auth/login/*` (they are already logged in). `member` users can only visit `/home/`, `/member/` and `/auth/logout/logout.html` (lets them log out). `anonymous` users can visit only `/auth/login/`. If users are logged in but are not at least members, then they are just `authenticated` and `authenticated` users will be redirected to `/auth/login/` when attempting to access any other route (this is useful behaviour as Azure SWA seems to allow any user of the identity provider to log in without restriction).

### `/staticwebapp.config.json`

For additional protection, `staticwebapp.config.json` can be configured according to [Securing routes with roles](https://docs.microsoft.com/en-us/azure/static-web-apps/configuration#securing-routes-with-roles).

### `clientWebEnhance.ts`

The navigation guard is defined in this file. It gets the roles of the logged in user from `/.auth/me` and compares them with `rules.json` and the intended destination.

```ts
router.beforeEach(async (to, from) => {
    const userRoles = await getUserRoles();

    return navigationGuard(userRoles, to.path);
});
```

### `LayoutAuth.vue`

This file is a custom layout. Select this layout from the frontmatter of a page to do auth checks before the page is rendered. The content of the page will not be rendered unless the user has appropriate authorisation. In the frontmatter, write something like:

```yaml
layout: LayoutAuth
authRequirements:
  any: ['admin', 'staff']
  none: ['member']
```

This example shows that the page will be rendered by the layout theme for `admin` and `staff` users but not `member` users.


