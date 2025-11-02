<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## NPM scripts

This project includes several npm scripts you can run from the project root.

- npm run build
  - Builds the NestJS project (produces dist/).
  - Example:
```bash
npm run build
```

- npm run build:schema
  - Concatenates Prisma schema parts into prisma/schema.prisma (runs scripts/concat-prisma.js).
  - Run this before Prisma CLI commands if you edit files under prisma/parts.
  - Example:
```bash
npm run build:schema
```

- npm run prisma:generate
  - Regenerates Prisma client (runs build:schema first).
  - Example:
```bash
npm run prisma:generate
```

- npm run prisma:migrate
  - Runs Prisma migrate dev after building the schema.
  - Example:
```bash
npm run prisma:migrate
```

- npx run prisma migrate dev
  - Shortcut for prisma migrate dev with a migration name.
  - Example:
```bash
npx run prisma migrate dev
```

- npm run prisma:studio
  - Opens Prisma Studio.
  - Example:
```bash
npm run prisma:studio
```

- npm run start
  - Starts the app (production mode using Nest).
  - Example:
```bash
npm run start
```

- npm run start:dev
  - Starts the app in watch/development mode.
  - Example:
```bash
npm run start:dev
```

- npm run start:debug
  - Starts the app with the Node debugger attached.
  - Example:
```bash
npm run start:debug
```

- npm run start:prod
  - Runs the built production bundle from dist/.
  - Example:
```bash
npm run start:prod
```

- npm run format
  - Runs Prettier to format source files.
  - Example:
```bash
npm run format
```

- npm run lint
  - Runs ESLint with auto-fix where possible.
  - Example:
```bash
npm run lint
```

- npm run test / test:watch / test:cov / test:e2e
  - Run unit, watch, coverage and e2e tests respectively.
  - Examples:
```bash
npm run test
```
```bash
npm run test:watch
```
```bash
npm run test:cov
```
```bash
npm run test:e2e
```

- npm run test:debug
  - Runs Jest under the debugger (useful for inspecting tests).
  - Example:
```bash
npm run test:debug
```

Notes
- If you already edit prisma/parts/*.prisma, run npm run build:schema before any Prisma CLI command (or use the combined scripts like npm run prisma:generate).
- You can merge or extend these scripts in package.json to suit CI or local workflows.
