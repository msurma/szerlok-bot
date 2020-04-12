import doApiRequest from './functions/doApiRequest.mjs';
import getEnv from './functions/getEnv.mjs';
import postEntry from './functions/postEntry.mjs';

async function* fetchEntries(tag) {
  let page = 1;

  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const response = await doApiRequest(`/Tags/Entries/${tag}/page/${page}`);

    yield response.data.data;
    page += 1;
  }
}

async function getEntriesForTag(tag) {
  const entriesIterator = fetchEntries(tag);
  const entriesList = [];

  for await (const entries of entriesIterator) {
    for (const entry of entries) {
      entriesList.push(entry);
    }

    if (new Date(entries[entries.length - 1].date) < new Date(Date.now() - 60 * 60 * 12 * 1000)) {
      break;
    }
  }

  return {
    tag,
    entriesList: entriesList
      .filter(
        (entry) => new Date(entry.date) > new Date(Date.now() - 60 * 60 * 12 * 1000),
      )
      .filter(
        (entry) => entry.vote_count > 5,
      )
      .sort((entry1, entry2) => entry2.vote_count - entry1.vote_count)
      .slice(0, 10),
  };
}

const tagEntriesPromises = getEnv('TAG_LIST').split(',').map((tag) => getEntriesForTag(tag));

Promise.all(tagEntriesPromises)
  .then((tagEntries) => {
    let tagsRankMessage = '';
    for (const entries of tagEntries) {
      let tagRankMessage;

      if (entries.entriesList.length) {
        tagRankMessage = entries.entriesList.map(
          (entry, index) => `**(${index + 1})** @[${entry.author.login}](https://www.wykop.pl/ludzie/${entry.author.login}) **[+${entry.vote_count}]** [[###]](https://www.wykop.pl/wpis/${entry.id}/)`,
        ).join('\r\n');
      } else {
        tagRankMessage = 'Brak wpisów :(';
      }

      tagsRankMessage += `\r\n**${entries.tag.toUpperCase()}**\r\n${tagRankMessage}\r\n`;
    }

    return tagsRankMessage;
  })
  .then((tagsRankMessage) => `**[ #bestofresults ] Najbardziej plusowane wpisy z trzech najpopularniejszych oraz kilku wybranych tagów z ostatnich 12 godzin:**
    
    ${tagsRankMessage}

**Pytania, skargi, prośby, zażalenia? Piszta lub wołajta** @[surma](https://www.wykop.pl/ludzie/surma)**!**

**Jestem OpenSource!** Chcesz mnie popsuć albo dorzucić nowy ficzer? [Śmiało, zapraszam!](https://github.com/msurma/szerlok-bot)

! PS. Lubię suby`)
  .then((tagsRankMessage) => {
    postEntry(tagsRankMessage);
  })
  // eslint-disable-next-line no-console
  .catch((e) => console.error(e));
