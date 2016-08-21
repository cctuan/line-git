
import beta_config from './../configs/config.beta.json';
import prod_config from './../configs/config.prod.json';

const config = process.env.PRODUCTION ? prod_config : beta_config;
export default {
	api_url: config.api_url,
	api_post_url: config.api_post_url,
	api_search_url: config.api_search_url,
	"api_port": config.api_port,
	"web_port": config.web_port,
	"mongo_url": config.mongo_url,
  "channelUrl": config.channelUrl,
  "channelToken": config.channelToken,
  "channelId": config.channelId,
  "eventToChannelId": config.eventToChannelId,
  "messageType": config.messageType,
  "operationType": config.operationType,
  "eventType": config.eventType,
  "channelSecret": config.channelSecret,
  "redisport": config.redisport,
  "redisurl": config.redisurl,
  "linkMessageId": config.linkMessageId,
  "linkMessageType": config.linkMessageType,
  userIdScheme: config.userIdScheme,
  git_subpath: config.git_subpath
}