import {Poll} from '../models/poll';

export function processPollDescription(poll: Poll) {
  let result = poll.description;
  while (result.includes('\n')) {
    result = result.replace('\n', '<br>');
  }
  const urlPattern = 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';
  const urlIdentifier = 'THIS_IS THE_URL IDENTIFIER';
  const urls = [];

  let matcherGroup = result.match(urlPattern);
  while (matcherGroup && matcherGroup.length > 0) {
    urls.push(matcherGroup[0]);
    result = result.replace(new RegExp(urlPattern), urlIdentifier);
    matcherGroup = result.match(urlPattern);
  }

  let counter = 0;
  while (result.includes(urlIdentifier)) {
    result = result.replace(urlIdentifier, '<a href="' + urls[counter] + '">' + urls[counter] + '</a>');
    ++counter;
  }
  poll.description = result;
}
