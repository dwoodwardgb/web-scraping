'use strict';

var assert = require('assert');

function findLink(str) {
  // find opening anchor tag
  var start = str.indexOf('<a');
  if (start === -1) {
    return {
      link: null,
      pos: str.length
    };
  } else {
    // find closing of opening anchor tag
    var end = str.indexOf('>', start);
    if (end === -1) {
      end = str.length;
    }

    str = str.substring(start, end);

    // find href attribute
    var href = str.search(/href\s*=/);
    if (href === -1) {
      return {
        link: null,
        pos: end
      };
    } else {
      // find the = sign
      var eq = str.indexOf('=', href);
      assert.notEqual(eq, -1);

      // find the link
      str = str.substring(eq + 1);
      str = str.trim();
      var linkEnd = str.search(/\s/);
      if (linkEnd === -1) {
        linkEnd = str.length;
      }

      str = str.substring(0, linkEnd);

      // remove any quotation marks
      if (str[0] === str[str.length - 1] &&
          (str[0] === "'" || str[0] === '"')) {
        return {
          link: str.substring(1, str.length - 1),
          pos: end
        };
      } else {
        return {
          link: str,
          pos: end
        };
      }
    }
  }
}

function findLinks(page) {
  var links = [];

  while (page.length > 0) {
    var res = findLink(page);

    if (res.link !== null) {
      links.push(res.link);
    }

    page = page.substring(res.pos + 1);
  }

  return links;
}

module.exports = {
  'findLink': findLink,
  'findLinks': findLinks
};
