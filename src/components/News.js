function News(props) {
  const newsParsed = props.news;

  if (!newsParsed) return <h5> No recent news available</h5>;

  if (newsParsed.length === 0) return <h5> No recent news available </h5>;

  let charactersCount = newsParsed[0].title.length;

  let index = 0;

  let markup = [];

  while (charactersCount <= 400 && index < newsParsed.length) {
    markup = [
      markup,
      <p key={index}>
        {" "}
        {newsParsed[index].date.substr(0, 10)}{" "}
        <a href={newsParsed[index].link} rel="noreferrer" target="_blank">
          {" "}
          {newsParsed[index].title}{" "}
        </a>{" "}
      </p>,
    ];
    charactersCount += newsParsed[index].title.length;
    index++;
  }

  return markup;
}

export default News;
