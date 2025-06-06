# anti-domo

this bot automatically bans anyone that uses domoAI in your server.

- [discord install link](https://discord.com/oauth2/authorize?client_id=1374962695698386985)

## PLEASE NOTE:

- 'use external apps' permission must be toggled on. this is the only way the bot will function and the only way for you to tell if someone is using domoAI. if this is off, messages will be private between the user and app.
- the bot must have a hoisted role- that is, one above other member roles.
- discord please fix this... allow server owners to completely disable external apps 🥺
- **update 5/25/2025**: currently waiting for discord to verify the bot. it cannot be added to anymore servers until then

## what it does

- checks all messages for domoAI output
- instantly deletes domo output
- automatically bans the user who used the command

## why this exists

domoAI is an external app that is enabled by default, albeit not pre-authorized, and lets anyone transform/"restyle" images using AI - including art posted by people who don't consent to their work being used for it. this bot aims to help protect artists but is unfortunately a negligble defense. if you're an artist posting online, you should always watermark your work !!

## setup

feel free to host the bot yourself or build upon it

1. clone repo

```bash
git clone https://github.com/conjureme/anti-domo.git
cd anti-domo
```

2. install dependencies

```bash
npm install
```

3. create discord application

- go to discord dev portal
- create new application
- create bot user
- copy bot token and client id

4. setup environment variables

- create .env.local file and add below
- bot_token=your_token
- guild_id=your_guildid
- client_id=your_clientid

5. invite bot to server

- needs read messages, manage messages, and ban member perms
- required intents: guilds, guild messages, message content, guild moderation

6. deploy commands & run bot

```bash
npx tsx bot/deploy-commands.ts
npm run dev
```

## how it works

the bot listens for messages from domoAI (user ID: 1153984868804468756) and:

- deletes the AI-generated images
- tries to find the goober who triggered the AI through:

  1. user mentions in the message
  2. embed footer data
  3. message content patterns

silently bans user with given reason.

## contributing

this bot is very basic but please

- report bugs
- suggest improvements
- fork for your own usage

## license

[MIT](LICENSE)
