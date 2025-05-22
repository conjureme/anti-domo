import {
  Events,
  Message,
  User,
  GuildMember,
  DiscordAPIError,
} from 'discord.js';

export default {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (message.author.id !== '1153984868804468756') {
      return;
    }

    try {
      console.log('domo stink detected, ban INITIATED...');

      try {
        await message.delete();
      } catch (deleteError) {
        console.error(
          'failed to delete DomoAI message - missing Manage Messages permission:',
          deleteError
        );
      }

      let triggerUser: User | GuildMember | null = null;

      if (message.mentions.users.size > 0) {
        const mentionedUser = message.mentions.users.first();
        if (mentionedUser) {
          triggerUser = mentionedUser;
        }
      }

      if (!triggerUser && message.content) {
        const userMention = message.content.match(/<@!?(\d+)>/);
        if (userMention) {
          try {
            triggerUser = await message.guild!.members.fetch(userMention[1]);
          } catch (e) {
            console.error('could not fetch mentioned user:', e);
          }
        }
      }

      if (!triggerUser && message.embeds.length > 0) {
        for (const embed of message.embeds) {
          if (embed.footer && embed.footer.text) {
            const userMatch = embed.footer.text.match(/(\d+)/);
            if (userMatch) {
              try {
                triggerUser = await message.guild!.members.fetch(userMatch[1]);
                break;
              } catch (e) {
                console.log('user id not found', e);
              }
            }
          }
        }
      }

      if (triggerUser) {
        try {
          const memberToBan =
            triggerUser instanceof User
              ? await message.guild!.members.fetch(triggerUser.id)
              : triggerUser;

          await message.guild!.members.ban(memberToBan, {
            reason: 'this person literally used domo lol learn to draw',
          });

          console.log(`banned ${memberToBan.user.tag} for using domoAI`);
        } catch (banError) {
          if (banError instanceof DiscordAPIError) {
            switch (banError.code) {
              case 50013:
                console.error(
                  `cannot ban ${
                    triggerUser instanceof User
                      ? triggerUser.tag
                      : triggerUser.user.tag
                  } - insufficient permissions or user has higher role`
                );
                break;
              case 50035:
                console.error(
                  `invalid ban request for ${
                    triggerUser instanceof User
                      ? triggerUser.tag
                      : triggerUser.user.tag
                  }`
                );
                break;
              default:
                console.error(
                  `failed to ban (discord API Error ${banError.code}):`,
                  banError.message
                );
            }
          } else {
            console.error(`failed to ban member:`, banError);
          }
        }
      } else {
        console.log(
          'domoAI message found but could not identify trigger user :('
        );
      }
    } catch (error) {
      console.error('something went horribly awry in domoAI handler:', error);
    }
  },
};
