import { GuideModel } from '../models/Guide/guide.model';
import { PostModel } from '../models/Post/post.model';
import { TagModel } from '../models/Tag/tag.model';
import { UserModel } from '../models/User/user.model';
import {
  guideEmbed,
  parseGfy,
  postEmbed,
  updateFollowers,
} from '../utils/utils';

const COOKBOOK_MAP = {
  // ----------------------------------------
  // CAPTAIN FALCON
  // ----------------------------------------
  '729819302726729809': {
    cookbook: '60ae98dd749bb3001580a0b6',
    chefs: [
      '148672183961518080', // CHEF
    ],
    ignored_channels: [
      '1044315191053144065', // discussion
    ],
  },
  // ----------------------------------------
  // FOX
  // ----------------------------------------
  '968657356911173713': {
    cookbook: '60f48566a9fa0602242693f5',
    chefs: [
      '148672183961518080', // CHEF
      '153694306719367169', // PALADIN
      '263079437438943232', // ZUPPY
      '95449526055215104', // SORA
      '119339339955175424', // YONY
      '134194821756747776', // STEFFAN
      '127739019877548032', // Pipsqueak
      '78866031795245056', // Binary Clone
      '298615479055024130', // Chape
      '975569938385371146', // Rin
      '85886400313974784', // Clown
    ],
    ignored_channels: [
      '980228000635318363', // discussion
      '980241131424084031', // general
    ],
  },
  // ----------------------------------------
  // SHEIK
  // ----------------------------------------
  '1061175237124829214': {
    cookbook: '6103fbf880e7bd37811dc225',
    chefs: [
      '173700631813423105', // bonfire
      '302145342428807169', // broccoliraab
      '148672183961518080', // chef
      '238000628574584834', // essy
      '339275017684779008', // freehops
      '207961724052045824', // heartstrings
      '346763336110571521', // jmook
      '314782656011436032', // juicebox
      '486971154091868183', // kogs
      '281899082581278720', // kyle
      '216817215574507520', // seven
      '172560647790264321', // muchoman
      '223396766920212481', // max
      '60806429077934080', // pwof
      '86467385732653056', // quadae
      '122642493480239104', // spark
      '186828140323012608', // zafraud
      '107618217928712192', // akir
      '298598980890394624', // ben
      '279141643024728067', // drlobster
      '354076269870317568', // jsalt
      '236880608868040704', // pace
      '273247519637635073', // pope sean paul
      '164941426293997569', // stockholm
      '598319196417425464', // tiles_sp
    ],
    ignored_channels: [
      '1061176066221289533', // discussion
      '1061175237573611532', // general
      '1061216808755019826', // chef discussion
    ],
  },
};

export const embedPost = async (client, message) => {
  if (
    message.content.match(/(?=https:\/\/)(?=.*cookbook.gg)(?=.*\/posts)\S*/g) &&
    message.author !== client.user
  ) {
    const postId = message.content.match(/(?<=\/posts\/)(\S*)/g);
    try {
      const post = await PostModel.findById(postId).populate(
        'cre_account tags cookbook character',
      );
      if (!post) return;

      message.delete();
      message.channel.send({
        embeds: [postEmbed(post)],
      });
    } catch (e) {
      console.log(e);
    }
  }
};

export const embedGuide = async (client, message) => {
  if (
    message.content.match(
      /(?=https:\/\/)(?=.*cookbook.gg)(?=.*\/section)\S*/g,
    ) &&
    message.author !== client.user
  ) {
    const guideId = message.content.match(/(?<=\/recipes\/)(\S[^/]*)/g)?.[0];
    const sectionName = message.content.match(/(?<=\/section\/)(\S*)/g)?.[0];
    try {
      const guide = await GuideModel.findById(guideId).populate(
        'tags cookbook character',
      );
      if (!guide || !guide.sections || !sectionName) return;

      const section = guide.sections.find(
        (section) => `${section.title}` === decodeURIComponent(sectionName),
      );

      message.delete();
      message.channel.send({
        embeds: [guideEmbed(guide, section)],
      });
    } catch (e) {
      console.log(e);
    }
  }
};

export const postFromDiscord = async (client, message) => {
  if (
    COOKBOOK_MAP[message.guildId] &&
    COOKBOOK_MAP[message.guildId].chefs.includes(message.author.id) &&
    !COOKBOOK_MAP[message.guildId].ignored_channels.includes(message.channel.id)
  ) {
    if (
      message.content.includes('gfycat.com') ||
      message.content.includes('giphy.com')
    ) {
      const _channel = client.channels.cache.find(
        (channel) => channel.id === message.channel.id,
      );
      const _category = client.channels.cache.find(
        (channel) => channel.id === message.channel.parentId,
      );
      let channelTag = await TagModel.findOne({
        label: _channel.name,
        //@ts-ignore
        cookbook: COOKBOOK_MAP[message.guildId].cookbook,
      });
      if (!channelTag) {
        channelTag = await TagModel.create({
          cookbook: COOKBOOK_MAP[message.guildId].cookbook,
          label: _channel.name,
        });
      }

      let categoryTag = await TagModel.findOne({
        label: _category.name,
        //@ts-ignore
        cookbook: COOKBOOK_MAP[message.guildId].cookbook,
      });
      if (!categoryTag) {
        categoryTag = await TagModel.create({
          cookbook: COOKBOOK_MAP[message.guildId].cookbook,
          label: _category.name,
        });
      }
      const user = await UserModel.findOne({ discord_id: message.author.id });
      let post: any = await PostModel.create({
        title: _category.name,
        cre_account: user?._id,
        body: message.content.replace(
          /(https:\/\/)(gfycat)[^\s,]*/g,
          (match) => `gif:${match}`,
        ),
        tags: [categoryTag._id, channelTag._id],
        cookbook: COOKBOOK_MAP[message.guildId].cookbook,
      });

      post = await post
        .populate('cre_account tags cookbook character')
        .execPopulate();
      post.body = await parseGfy(post.body);
      await updateFollowers(client, post);
    }
  }
};
