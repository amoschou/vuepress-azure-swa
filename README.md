# vuepress-azure-swa

A template for a VuePress site published to Azure Static Web Apps with authentication and authorisation.

## Files

### `/docs/.vuepress/auth/rules.json`

`rules.json` is an array of objects, where each object is of the form:

```json
    {
        "role": <String>,
        "elevated": <Boolean>,
        "exceptions": <Array of Strings>,
        "redirect": <String or null>
    }
```

The role is a non-empty string of letters, numbers or underscores. If the role is elevated, then a user with that role can visit any route in the app except those routes listed in the exceptions. If the role is not elevated, then the use can visit only those routes listed in the exceptions, unless the user also has a higher ranked role. If the user attempts to visit a route that they are not priviliged for, then they will be redirected. Wildcard routes are not interpreted. Privileges are evaluated in order of their index in the array. 

Example:

```json
[
    {
        "role": "admin",
        "elevated": true,
        "exceptions": [],
        "redirect": null
    }, {
        "role": "employee",
        "elevated": true,
        "exceptions": ["/auth/login/", "/admin/"],
        "redirect": "/"
    }, {
        "role": "authenticated",
        "elevated": false,
        "exceptions": ["/auth/forbidden", "/auth/logout/"],
        "redirect": "/auth/forbidden/"
    }, {
        "role": "anonymous",
        "elevated": false,
        "exceptions": ["/auth/login/"],
        "redirect": "/auth/login/"
    }
]
```

In this example, there are three roles supported by the app: `admin`, `employee` and `anonymous`. `admin` users can visit all routes. `employee` users can visit all routes except `/auth/login/` and `/admin/`. `anonymous` users can visit only `/auth/login/`. Azure SWA allows `authenticated` roles, here, `authenticated` users will be redirected to `/auth/forbidden/` when attempting to access any other route, this is useful behaviour as Azure SWA seems to allow any user of the identity provider to log in without restriction.

