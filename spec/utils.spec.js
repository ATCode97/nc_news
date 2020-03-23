const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("will return a empty array when passed through a empty array", () => {
    expect(formatDates([])).to.eql([]);
  });
  it("will format the date of an object array that contains one value", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const actual = formatDates(input);

    expect(actual[0].created_at instanceof Date).to.equal(true);
  });
  it("will format the date of an object array that contains more than one value", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171
      }
    ];
    const actual = formatDates(input);

    expect(actual[0].created_at instanceof Date).to.equal(true);
    expect(actual[1].created_at instanceof Date).to.equal(true);
  });
  it("MUTATION -won't mutate the original array", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    formatDates(input);

    expect(input).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ]);
  });
});

describe("makeRefObj", () => {
  it("will return a new array when passed a empty array", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("should take a array with one object and return a reference object", () => {
    const input = [{ article_id: 1, title: "A" }];
    const result = { A: 1 };

    expect(makeRefObj(input)).to.eql(result);
  });
  it("should take a array with more than one object and return a reference object", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" }
    ];
    const result = { A: 1, B: 2 };

    expect(makeRefObj(input)).to.eql(result);
  });
  it("hasn't mutated the original object array - mutations test", () => {
    const input = [{ article_id: 1, title: "A" }];

    makeRefObj(input);

    expect(input).to.eql([{ article_id: 1, title: "A" }]);
  });
});

describe("formatComments", () => {
  it("will return a new array when passed a empty array", () => {
    expect(formatComments([])).to.eql([]);
  });
  it("will reformat keys and assign it a new value & change the value of 'created_by into Javascript object with one object in an array", () => {
    const input = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];

    const refObj = { "Living in the shadow of a great man": 1 };
    const formattedComments = formatComments(input, refObj);

    expect(formattedComments).to.eql([
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      }
    ]);
  });
  it("will reformat keys and assign it a new value & change the value of 'created_by into Javascript object with more than one object an array ", () => {
    const input = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body: "The owls are not what they seem.",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "icellusedkars",
        votes: 20,
        created_at: 1006778163389
      }
    ];

    const refObj = {
      "Living in the shadow of a great man": 1,
      "They're not exactly dogs, are they?": 5
    };

    const formattedComments = formatComments(input, refObj);

    expect(formattedComments).to.eql([
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      },
      {
        body: "The owls are not what they seem.",
        article_id: 5,
        author: "icellusedkars",
        votes: 20,
        created_at: new Date(1006778163389)
      }
    ]);
  });
  it("hasn't mutated the original array - mutation test", () => {
    const input = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];

    const refObj = { "Living in the shadow of a great man": 1 };

    formatComments(input, refObj);

    expect(input).to.eql([
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ]);
  });
});
