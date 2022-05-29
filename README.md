# **My Blog - Adonis OS Blog**

A blog post that simulate an OS and has 3 apps

| App                | Why                                                                                                                       |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------ |
| Terminal Simulator | Every Unix-based OS should have it, plus viewsers can take a glimpse of what a basic terminal (**FISH** Shell) looks like |
| Blog               | To display blogs                                                                                                          |
| PoolOfDeath20      | To direct viewers to my own web application                                                                               |

### TLDR

Of course it doesn't simulate a real OS, just that I chose to develop my own blog in a different way.

Since I believe that a blog can be used to share personal view or information on various topics in an informal way, it should be designed and tailored as such, instead of making it similar to other blog posts, in other words, every blogger should have their own unique design of their blog

Hence by doing so I allowed readers to take a glimpse of my software world (Linux and Terminal) and read blog at the same time.

Hopefully that explains why this blog takes on a OS-Like design with various astronaut as background images, for more info, checkout my first blog

<details>
<summary>Click to preview!</summary>

#### Home Page

![Home One](./docs/home/one.png 'Home One')
![Home Two](./docs/home/two.png 'Home Two')
![Home Three](./docs/home/three.png 'Home Three')

#### Terminal

![Default Terminal](./docs/terminal/default.png 'Default Terminal')
![Maximized Terminal](./docs/terminal/maximized.png 'Maximized Terminal')
![Draggable Terminal](./docs/terminal/draggable.png 'Draggable Terminal')

#### Posts

![Default Posts](./docs/posts/default.png 'Default Posts')
![Maximized Posts](./docs/posts/maximized.png 'Maximized Posts')
![Draggable Posts](./docs/posts/draggable.png 'Draggable Posts')

#### Post

![Default Post](./docs/post/default.png 'Default Post')
![Maximized Post](./docs/post/maximized.png 'Maximized Post')
![Draggable Post](./docs/post/draggable.png 'Draggable Post')

</details>

## Tech Used

| Aspect                                                                 | Name           |
| :--------------------------------------------------------------------- | :------------- |
| Development Language                                                   | TypeScipt      |
| Scripting Language                                                     | JavaScript     |
| Bundling                                                               | Esbuild        |
| Testing                                                                | Jest           |
| Styling                                                                | Emotion-css    |
| Framework                                                              | NextJS         |
| Build Automation Tool                                                  | Make           |
| Text Editor                                                            | NeoVim         |
| Dependency Management                                                  | Yarn           |
| Command Line Tool                                                      | Yargs          |
| Continuous Integration, Continuous Delivery, and Continuous Deployment | GitHub Actions |

## How to build this app?

_*Make sure you have `yarn` and `make` available in your system*_

### Environment Variables

#### Development and Testing

1. Refer to `.env.example` which is an example file for you to know what key-value pairs are needed to develop this project
2. Then, create `.env.development` and `.env.test` file that will be used for development and testing. Then copy the key-value pairs to it and then add the values
3. Also, you can create `.env.staging` and `.env.production` file for deployment if you want to

#### Make Commands

_*Below are the listed commands that you can use to build/develop/test this app*_

| Command                  | Usage                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| make dev                 | Start development                                                                                |
| make install             | Install all dependencies                                                                         |
| make test                | Run all test code                                                                                |
| make build               | Bundle and build the app                                                                         |
| make typecheck           | Run type-checking for source code                                                                |
| make lint                | Run linter for source and test code                                                              |
| make format-check        | Run prettier to check source and test code format                                                |
| make format              | Run prettier to format source and test code                                                      |
| make cli-read            | Write to a json file for all of the posts                                                        |
| make cli-insert          | Read markdown file and json file (generated template) to insert post data                        |
| make cli-insert-template | Generate template to write post data that will be used for `make cli-insert`                     |
| make cli-update          | Read markdown file and json file (generated template) to update post data                        |
| make cli-update-template | Generate template to write and update existing post data that will be used for `make cli-update` |
| make cli-publish         | Publish a given post                                                                             |
| make cli-delete          | Soft delete a given post (unpublish)                                                             |
