# Create Pavel's React

**Don't** install this package. Use `npm init` in parent directory.

`npm init pavels-react`

## Initialization

1. create a new repo on github
   1. initialize with node gitignore file, and readme file
2. clone github repo locally and cd into it
3. npm init pavels-react

## Updates - Version 1.0.2

Updated linting rule

### Changes

1. Linter doesn't yell over space after return anymore
2. Got rid of space at the end of App component file

## Updating npm package *just my notes*

1. Double check all changes are correct
2. Log changes in the new version in Updates file
   1. Also change updates section README
3. Push all new changes to github
4. Publish to npm
   1. cd to local npm module files directory
   2. npm version <update_type>
      1. patch, minor, major
      2. don't include the '<>'
      3. this will update the version in package.json so no need to do it manually
   3. npm publish
