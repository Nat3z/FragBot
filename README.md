# FragBot
A Hypixel Skyblock Frag Bot built in TypeScript using mineflayer.

# What is the purpose of this program?
This program is used for the purposes of creating a queue-based Minecraft Bot that allows Hypixel Players to invite the bot and have that bot accept the invite and join the party.

# What should I know before deployment?
When compiling the source code of the bot, you will most likely encounter an error regarding TypeScript and invalid type definitions.

To fix the mineflayer import error, you need to go to the file and add `/* @ts-ignore */` on top of the import on the mineflayer index.d.ts file.

For that file, it should look like this:
```ts
/* @ts-ignore */
import { Recipe } from 'prismarine-recipe'
```

For the prismarine-chat error, you will have to add the `: any` type to the param.

It should look like this:
```ts
declare const loader: (registryOrVersion: any) => typeof ChatMessage
```

*p.s. there is definitely a more elegant way of doing this. I don't know the mineflayer codebase enough to provide those types, and someone should definitely fix the TypeScript definitions in a future release.*


# Minimum/Recommended Computer Specs

|          | Minimum | Recommended |
|----------|---------|-------------|
| Memory:  | 1024 MB | 4096 MB     |
| CPU:     | 2 Cores | 2-4 Cores   |
| Storage: | >2-5 GB | >2-5 GB     |


## Where should I deploy?
Currently, I am using a Google Cloud platform Compute Engine on the free tier to deploy the bot. This works fine with one Minecraft Account, however keep in mind that if you have multiple accounts running at the same time, you may need to beef up the specs.

| Platforms     | Pros                                                            | Cons                                                                                                                           | Recommended |
|---------------|-----------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|:-----------:|
| Google Cloud  | Has a generous free tier.                                       | Can get costly when scaling.                                                                                                   | ✅           |
| AWS           | Very cost-effective when scaling.                               | Deployment is confusing for new users.                                                                                         | ✅           |
| Digital Ocean | Has cheap VMs that should be more than enough for >1 MC Account | Does not have an "always free" tier.                                                                                           | ✅           |
| Linode        | Has a generous free trial with credits.                         | Does not have an "always free" tier and can get very costly when scaling.                                                      | ✅           |
| Repl.it       | Has a free VM for deployment.                                   | Repositories are public, provided VMs are insufficient to deploy bots, and you are required to create a web server.            | ❌           |
| Vercel        | Has a free tier for deploying apps.                             | Platform is serverless, meaning that long-term connections (e.g. connecting to Discord & Minecraft) are impossible.            | ❌           |
| Heroku        | VMs are powerful and sufficient for deploying the bots.         | Platform is web-focused, meaning that you need to have a web server deployed and have enough Dyno Hours to pay for the uptime. | ➖           |