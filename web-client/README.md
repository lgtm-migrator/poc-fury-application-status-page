# [POC] Fury Application Status Page UI

This interface is composed of two main views
- 1) the Customer interface with a simple toggle
- 2) the Internal interface with multiple services controls

This project runs as standalone using the _Internal interface_.
While exposes the _Customer interface_ as a Webpack Federated Module, for the Fury Dashboard to consume.

So when you start the project locally you'll only see the _Internal interface_
but you can notice a `remoteEntry.js` on the browser network tab, and this is the entry point for the federated module.

 ### Local development
 Once started the server as shown in [README.md](../README.md) you have to follow two different steps based on the interface you want to work on.

 - 1) To develop the _Customer interface_ you need to `make build` the project inside the vagrant machine, and at the same time, also run the [poc-fury-application-status-page](https://github.com/sighupio/poc-fury-application-status-page) project locally following it's [README.md](https://github.com/sighupio/poc-fury-application-status-page#readme).
 At the end you'll see the toggle button inside the fury dashboard project.
 (_this process is very slow so we will discuss about further enhancements_)

 - 2) To develop the _Internal interface_ just run `yarn webpack serve` and you'll access it on `http://0.0.0.0:8084/`

 Translations files are placed inside the `/public/locales/{lang_name}/translations.json`
