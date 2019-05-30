#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv;
const folderName = args[args.length - 1];
const folder = folderName;

fs.mkdirSync(folder);

setupPackageJson(folder);
installDependencies(folder);
setupWebpack(folder);
setupBabel(folder);
setupEslint(folder);
setupSrc(folder);
setupFileMock(folder);
setupGitignore(folder);
setupTravis(folder);
initGit(folder);

function setupPackageJson(folder) {
  console.log(chalk.green('Setting up package.json'));

  const packageJson = {
    name: folder,
    version: '1.0.0',
    description: '',
    main: 'src/index.js',
    jest: {
      setupFilesAfterEnv: [
        '<rootDir>src/setupTests.js'
      ],
      snapshotSerializers: [
        'enzyme-to-json/serializer'
      ],
      moduleNameMapper: {
        '\\.(css)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
      }
    },
    scripts: {
      test: 'jest --verbose',
      'test:watch': 'npm run test -- --watch',
      start: 'webpack-dev-server --hot --mode development --devtool eval-source-map',
      build: 'webpack -p --devtool source-map'
    },
    keywords: [],
    author: '',
    license: 'ISC',
    dependencies: {},
    devDependencies: {}
  };

  fs.writeFileSync(
    path.join(folder, 'package.json'),
    JSON.stringify(packageJson, null, 2));
}

function installDependencies(folder) {
  const devDependencies = [
    '@babel/core',
    '@babel/plugin-proposal-class-properties',
    '@babel/preset-env',
    '@babel/preset-react',
    'autoprefixer',
    'babel-eslint',
    'babel-loader',
    'clean-webpack-plugin',
    'css-loader',
    'enzyme',
    'enzyme-adapter-react-16',
    'enzyme-to-json',
    'eslint',
    'eslint-plugin-babel',
    'eslint-plugin-react',
    'file-loader',
    'html-webpack-plugin',
    'identity-obj-proxy',
    'jest',
    'postcss-loader',
    'postcss-nested',
    'prop-types',
    'style-loader',
    'url-loader',
    'webpack',
    'webpack-cli',
    'webpack-dev-server'
  ];

  const dependencies = [
    'react',
    'react-dom'
  ];

  console.log(chalk.green('Installing devDependencies'));
  execSync(`npm i -D ${devDependencies.join(' ')}`, {
    cwd: folder,
    stdio: 'inherit'
  });

  console.log(chalk.green('Installing dependencies'));
  execSync(`npm i ${dependencies.join(' ')}`, {
    cwd: folder,
    stdio: 'inherit'
  });
}

function setupWebpack(folder) {
  console.log(chalk.green('Setting up webpack.config.js'));
  const webpackConfig = `
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// eslint-disable-next-line
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.[hash].js'
  },
  devServer: {
    port: 7890,
    historyApiFallback: true
  },
  plugins: [
    new HtmlPlugin({ template: './src/index.html' }),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                require('autoprefixer')(),
                require('postcss-nested')()
              ]
            }
          }
        ]
      },
      {
        test: /\\.(jpeg|jpg|png|svg)$/,
        use: {
          loader: 'url-loader',
          options: { limit: 1000 },
        },
      }
    ]
  }
};
`.trimStart();

  fs.writeFileSync(
    path.join(folder, 'webpack.config.js'),
    webpackConfig);
}

function setupBabel(folder) {
  console.log(chalk.green('Setting up .babelrc'));

  const babel = {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ]
  };
  fs.writeFileSync(
    path.join(folder, '.babelrc'),
    JSON.stringify(babel, null, 2));
}

function setupEslint(folder) {
  console.log(chalk.green('Setting up .eslintrc'));

  const eslint = {
    'parserOptions': {
      'ecmaVersion': 9,
      'sourceType': 'module'
    },
    'parser': 'babel-eslint',
    'env': {
      'es6': true,
      'browser': true,
      'jest': true
    },
    'plugins': [
      'babel',
      'react'
    ],
    'extends': [
      'eslint:recommended',
      'plugin:react/recommended'
    ],
    'rules': {
      'no-console': 'warn',
      'indent': [
        'error',
        2,
        {
          'SwitchCase': 1
        }
      ],
      'quotes': [
        'error',
        'single'
      ],
      'semi': [
        'error',
        'always'
      ],
      'space-in-parens': [
        'error'
      ],
      'space-infix-ops': 'error',
      'object-curly-spacing': [
        'error',
        'always'
      ],
      'comma-spacing': 'error',
      'space-before-function-paren': [
        'error',
        'never'
      ],
      'eol-last': [
        'error',
        'always'
      ],
      'keyword-spacing': [
        'error',
        {
          'before': true,
          'after': true,
          'overrides': {
            'do': {
              'after': false
            },
            'for': {
              'after': false
            },
            'if': {
              'after': false
            },
            'switch': {
              'after': false
            },
            'while': {
              'after': false
            },
            'catch': {
              'after': false
            }
          }
        }
      ],
      'array-bracket-spacing': 'error',
      'babel/no-invalid-this': 1,
      'babel/semi': 0
    }
  };

  fs.writeFileSync(
    path.join(folder, '.eslintrc'),
    JSON.stringify(eslint, null, 2));
}

function setupSrc(folder) {
  console.log(chalk.green('Setting up src'));

  fs.mkdirSync(path.join(folder, 'src'));

  setupIndexJs(folder);
  setupIndexHtml(folder);
  setupTests(folder);
}

function setupIndexJs(folder) {
  console.log(chalk.green('Setting up index.js'));

  const indexJs = `
import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

render(
  <App />,
  document.getElementById('root')
);
`.trimStart();

  fs.writeFileSync(
    path.join(folder, 'src/index.js'),
    indexJs);
}

function setupIndexHtml(folder) {
  console.log(chalk.green('Setting up index.html'));

  const indexHtml = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${folder}</title>
</head>

<body>
  <div id="root"></div>
</body>

</html>
`.trimStart();

  fs.writeFileSync(
    path.join(folder, 'src/index.html'),
    indexHtml);
}

function setupTests(folder) {
  console.log(chalk.green('Setting up enzyme tests'));

  const file = `
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
`.trimStart();

  fs.writeFileSync(
    path.join(folder, 'src/setupTests.js'),
    file);
}

function setupFileMock(folder) {
  console.log(chalk.green('Setting up file mocks'));

  const file = `
// eslint-disable-next-line
module.exports = '/path/image';
`.trimStart();

  fs.mkdirSync(path.join(folder, '__mocks__'));
  fs.writeFileSync(
    path.join(folder, '__mocks__/fileMock.js'),
    file);
}

function setupGitignore(folder) {
  console.log(chalk.green('Setting up .gitignore'));

  const file = `
node_modules
.env
dist
`.trimStart();
  fs.writeFileSync(
    path.join(folder, '.gitignore'),
    file
  );
}

function setupTravis(folder) {
  console.log(chalk.green('Setting up .travis.yml'));

  const file = `
language: node_js
node_js: node
`.trimStart();

  fs.writeFileSync(
    path.join(folder, '.travis.yml'),
    file
  );
}

function initGit(folder) {
  console.log(chalk.green('Initializing git'));

  execSync('git init', {
    cwd: folder,
    stdio: 'inherit'
  });

}
