exports.formatDates = list => {
  const formattedList = list.map((...obj) => {
    const newCreatedAt = new Date(obj.created_at);

    obj.created_at = newCreatedAt;
    return obj;
  });
  return formattedList;
};

exports.makeRefObj = list => {
  const refObj = {};

  list.forEach(obj => {
    const newKey = obj.title;
    const newValue = obj.article_id;
    refObj[newKey] = newValue;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  const formatComments = comments.map(obj => {
    const newObj = {};
    let time = obj.created_at;
    const { belongs_to } = obj;
    const articleId = articleRef[belongs_to];

    newObj.body = obj.body;
    newObj.article_id = articleId;
    newObj.author = obj.created_by;
    newObj.votes = obj.votes;
    newObj.created_at = new Date(time);

    return newObj;
  });

  return formatComments;
};
