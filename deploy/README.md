The only dependency here is `npm` (I'm pretty sure that's it, anyway), aside from a good python environment, of course :)

`python setup.py develop`

This install 3 bash function:

* `deploy`
* `dev_deploy`
* `prd_deploy`

They do just what they sound like. `dev_deploy` is an alias for `deploy --environment development --gitref development`.
`prd_deploy` is an alias for `deploy --environment production --gitref release`
