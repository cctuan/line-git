
const templates = {
	'welcome': 'Welcome to Gitbot',
	'pending-searching-friend-msg':
		'Please wait while we\'re looking for someone for you to meet.',
	'ok-friend-msg': 'Your friend request has been sent.',
	'end-connected': 'You\'re disconnected with someone',
	'not-connected': 'You\'re not connnected with anyone yet, perhpas you can try to click Next below input field or waiting for your credit reload.',
	'cannot-get-profile': 'We cannot get your profile information...',
	'sending-profile': 'Your profile has been sent...',
	'random-dating': [
		'Who was your first love?',
		'What\'s your favorite book when you were young?',
		'If you had to be an animal, what animal would it be?',
		'Are you a morning or night person?',
		'If you could have one superpower, what would it be and why?',
		'If you could marry a fictional character, who would it be and why?',
		'Would you rather live in a large house in the suburbs, or a tiny apartment in the city with an excellent view?',
		'Which is more logical to follow, your heart or your head?'
	],
	'random-tech': [
		'How much time do you spend on Facebook, Twitter, Youtube per day?',
		'How would you solve problems if you were from Mars?',
		'What\'s the most creative way you can break a clock?',
		'You have a bag of with "N" number of strings. At random, you pull out a string\'s end. You pull out another string end and you tie the two together. You repeat this until there are no loose ends left to pull out of the bag. What is the expected number of loops?',
		'How would you design an elevator?',
		'How do you compute the collision of two moving spheres? Give me both the mathematical equations for the solution as well as an algorithmic implementation.',
		'Name an evil company and explain why.'
	],
	'random-travel': [
		'If you can get a free airfare, where would you visit?',
		'When travelling, which is the most important: food, shopping or sightseeing?',
		'How many countries have you been to?',
		'If money and career were no object, where in the world would you choose to live?',
		'Do you prefer renting a car or commute?'
	],
	'random-language': [
		'Tell me a word I should remember in your mother language?',
		'How often do you speak your 2nd language?',
		'What\'s "I\'m full" in another languge?',
		'How many languages do you speak?'
	],
	'random-arts': [
		'Can you send me an artistic photo of what you ate recently?',
		'What\'s your favorites LINE sticker?',
		'How much time do you spend on Facebook, Twitter, Youtube per day?',
		'How would you solve problems if you were from Mars?',
		'What\'s the most creative way you can break a clock?',
		'You have a bag of with "N" number of strings. At random, you pull out a string\'s end. You pull out another string end and you tie the two together. You repeat this until there are no loose ends left to pull out of the bag. What is the expected number of loops?',
		'How would you design an elevator?',
		'How do you compute the collision of two moving spheres? Give me both the mathematical equations for the solution as well as an algorithmic implementation.',
		'Name an evil company and explain why.'
	],
	'start-conv': 'Meet new friend. \nShare more about yourself by answering this.\n #{topic}',
	'random-conver': [
		'Congratuation, you\'re connected, perhaps you can share your opinion of our politic.',
		'Congratuation, you\'re connected, perhaps you can share your opinion of our Dev day.'
	],
	'sending-picture': 'Your picture has been sent...',
	'cannot-get-picture': 'cannot get your picture',
	'cannot-locate-info-from-db': 'We cannot get your data from db, perhaps you haven\'t registered yet?',
	'need-to-switch-mode': 'If you want to meet someone please turn the match mode on.',
	'should-set-your-lineid': 'You haven\'t shared your LINE id, please go to #{url}'
};

export default function(id, query, notSystem) {
	let result = '';
	if (typeof templates[id] === 'string') {
		result = templates[id];
	} else {
		let template = templates[id];
		let len = template.length;
		result = template[Math.floor(Math.random() * len)];
	}
	if (typeof query === 'object') {
		for (let key in query) {
			result = result.replace('#{' + key + '}', query[key]);
		}
	}
	return !notSystem ? ('[LINE-meet]:' + result) : result;
}
