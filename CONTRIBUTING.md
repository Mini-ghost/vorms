# Contributing

Hi! I'm really excited that you are interested in contributing to Vorms. Before submitting your contribution, please make sure to take a moment and read through the following guide:

## Repo Setup

The Vorms repo is a monorepo using pnpm workspaces. The package manager used to install and link dependencies must be [pnpm](https://pnpm.io/).

Here is a quick guide to doing code contributions to the library.

1. Fork and clone the repo to your local machine

    ```bash
    git clone https://github.com/YOUR_GITHUB_USERNAME/vorms.git
    ```

    ```bash
    pnpm install
    ```

2. Create a new branch from `master` with a meaningful name for a new feature or an issue you want to work on
3. If you've added a code that should be tested, ensure the test suite still passes.

    ```bash
    pnpm test
    ```

     Try to write some unit tests to cover as much of your code as possible.

4. Ensure your code lints without errors

    ```bash
    pnpm lint
    ```

5. Ensure build passes.

    **@vorms/core**

    ```bash
    pnpm build:core
    ```

    **@vorms/resolvers**

    ```bash
    pnpm build:resolvers
    ```

6. Push your branch.
7. Submit a pull request to the upstream vorms repository.
8. Choose a descriptive title and describe your changes briefly.

## Coding style

Please follow the coding style of the project. Vorms uses eslint and prettier. If possible, enable their respective plugins in your editor to get real-time feedback. The linting can be run manually with the following command: `pnpm lint` and `pnpm format`
