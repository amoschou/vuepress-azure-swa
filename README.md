# vuepress-azure-swa

A template for a VuePress site published to Azure Static Web Apps with authentication and authorisation.

## Set up

Follow the process outlined at:
  * [Getting started](https://v2.vuepress.vuejs.org/guide/getting-started.html)
  * [Tutorial: Publish a VuePress site to Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/publish-vuepress)

You may also need to set `app_build_command: "npm run docs:build"` in the `Repository/Build Configurations` section of the `yaml` workflow file.

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
            "/auth/login/",
            "/auth/login/aad/",
            "/auth/login/twitter/",
            "/auth/login/github/"
        ],
        "redirect": "/"
    }, {
        "role": "member",
        "elevated": false,
        "exceptions": ["/home/", "/auth/logout/"],
        "redirect": "/home/"
    }, {
        "role": "authenticated",
        "elevated": false,
        "exceptions": ["/auth/forbidden", "/auth/logout/"],
        "redirect": "/auth/forbidden/"
    }, {
        "role": "anonymous",
        "elevated": false,
        "exceptions": [
            "/auth/login/",
            "/auth/login/aad/",
            "/auth/login/twitter/",
            "/auth/login/github/"
        ],
        "redirect": "/auth/login/"
    }
]
```

In this example, there are five roles supported by the app: `admin`, `staff`, `member`, `authenticated` and `anonymous`. `authenticated` and `anonymous` are mandatory roles as required by Azure SWA authentication. The other three are related to the function of the app.

The most priviliged role is `admin` and `admin` users can visit all routes. `staff` users can visit all routes except `/admin/`, `/auth/login/` and its subroutes `/auth/login/*` (they are already logged in). `member` users can only visit `/home/` and `/auth/logout/` (lets them log out). `anonymous` users can visit only `/auth/login/`. If users are logged in but are not at least members, then they are just `authenticated` and `authenticated` users will be redirected to `/auth/forbidden/` when attempting to access any other route (this is useful behaviour as Azure SWA seems to allow any user of the identity provider to log in without restriction).

### `/staticwebapp.config.json`

For additional protection, `staticwebapp.config.json` can be configured according to [Securing routes with roles](https://docs.microsoft.com/en-us/azure/static-web-apps/configuration#securing-routes-with-roles).



