# `affirm`

Your first port of call should be the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

> [!IMPORTANT]
> Opinions ahead! The following are recommendations. Feel free to ignore them if you have better ideas.

All Nuxt modules except [NuxtUI](https://ui.nuxt.com) are installed and enabled. Notably, this includes [Nuxt Content](https://content.nuxtjs.org/), which will make our lives easier for copywriting by letting them write Markdown instead of HTML/Vue.

But what are we going to use if not [NuxtUI](https://ui.nuxt.com)? Simple. [Tailwind](https://tailwindcss.com/) with [DaisyUI](https://daisyui.com/). This gives us a lot of flexibility while still providing a component library to speed up development.

The benefit of [DaisyUI](https://daisyui.com/) is that they don't dick about by having a "pro" version. The open-source version of DaisyUI is it.

I'm not a frontend developer but I'd encourage use of the [Catppuccin](https://github.com/catppuccin) palette. There are dedicated packages for [the palette](https://github.com/catppuccin/palette), [DaisyUI](https://github.com/catppuccin/daisyui), and [Tailwind](https://github.com/catppuccin/tailwindcss).

Recommended VS Code extensions are configured for this workspace. Check the extensions view's _Recommended_ section. Feel free to add any you find useful.

> [!IMPORTANT]
> Opinions end here. It's objectivity from here on. Mostly.

## Branch protections

The `main` branch is the production deployment. It's protected; changes to it can only come from a pull request, and that means a separate branch.

Do your work in a branch named `username/purpose`; eg `daveio/fix-header`.

When it's ready to merge, submit a pull request. Two approvals are required on each PR. I (@daveio) will try to review all PRs and you can function as the other approver if you like. If I'm unavailable to review a PR, ask another team member to review it for you. Anyone can.

The purpose of this isn't to be a pain in the arse, it's to minimise the possibility of broken code reaching production. Your pushes to branches generate a `workers.dev` URL, so you can validate things before submitting a PR and save everyone a bunch of time.

> [!TIP]
> Please **sign your commits**. It's a major security win and it's not enormous hassle. You don't need a GnuPG key any more; Git supports signing with SSH keys now, and you probably use one of those to push anyway. See [the documentation](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits) for more information.

## Setup

Install [`bun`](https://bun.sh) if you haven't already. I suggest using [`mise`](https://github.com/jdx/mise), which you can also use to manage Node versions and a bunch of other stuff too.

There is a `mise.toml` file included in this repo. It will install everything you need.

The only exception is `trunk` which is a _massive_ pain in the arse to manage using `mise`. It'll be installed as a dev dependency and can be invoked through `bun run trunk`, or read the [installation documentation](https://docs.trunk.io/code-quality/overview/initialize-trunk) to install it globally if you prefer.

> [!NOTE]
> It will also install a few extras; the CLIs for the major coding agents, and `rust` in case we decide to use `wasm` in the future. Feel free to edit it if you need to, just be aware you'll be changing it for everyone else too.
>
> There are also `.tool-versions` and `.node-version` files, but they're more for Workers Builds. `mise` should be treated as the source of truth.

If you are using `mise`, simply run:

```bash
# trust the mise.toml file
mise trust

# set up the environment
mise install
```

When everything is set up, install dependencies:

```bash
# we are using bun for package management
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
bun dev
```

## Production

Build the application for production:

```bash
# `bun run` required because `bun build` clashes with internal bun command
bun run build
```

Locally preview production build:

```bash
bun preview
```

If you have further questions, check out the documentation for agents in [`.github/copilot-instructions.md`](.github/copilot-instructions.md). There are multiple symlinks to this file for various agents.
