'use strict';

var chai = require('chai');
var expect = chai.expect;

var parsing = require('./parsing');

describe('parsing', function () {
  it('findLink() should work for a normal case', function () {
    expect(
        parsing.findLink('<a href="https://google.com">Google</a>').link
    ).to.equal('https://google.com');
  });

  it('findLink() should handle space around the equals sign for the href attribute', function () {
    var ans = 'https://google.com';

    expect(
        parsing.findLink('<a href ="https://google.com">Google</a>').link
    ).to.equal(ans);

    expect(
        parsing.findLink('<a href  ="https://google.com">Google</a>').link
    ).to.equal(ans);

    expect(
        parsing.findLink('<a href=  "https://google.com">Google</a>').link
    ).to.equal(ans);

    expect(
        parsing.findLink('<a href  =  "https://google.com">Google</a>').link
    ).to.equal(ans);

    expect(
        parsing.findLink('<a href =  "https://google.com">Google</a>').link
    ).to.equal(ans);

    expect(
        parsing.findLink('<a href  = "https://google.com">Google</a>').link
    ).to.equal(ans);

    expect(
        parsing.findLink('<a href   = "https://google.com">Google</a>').link
    ).to.equal(ans);

    expect(
        parsing.findLink('<a href  =   "https://google.com">Google</a>').link
    ).to.equal(ans);

    expect(
        parsing.findLink('<a href   =  "https://google.com">Google</a>').link
    ).to.equal(ans);
  });

  it('findLink() should handle double quotes around the link', function ()  {
    expect(
        parsing.findLink('<a href="https://google.com">Google</a>').link
    ).to.equal('https://google.com');
  });

  it('findLink() should handle single quotes around the link', function () {
    expect(
        parsing.findLink('<a href=\'https://google.com\'>Google</a>').link
    ).to.equal('https://google.com');
  });

  it('findLink() should handle no quotes around the link', function () {
    expect(
        parsing.findLink('<a href=https://google.com>Google</a>').link
    ).to.equal('https://google.com');
  });

  it('findLink() should handle no quotes and spaces around/in link', function () {
    var ans = 'https://google.com';

    expect(
        parsing.findLink('<a href= https://google.com >Google</a>').link
    ).to.equal(ans);

    expect(
        parsing.findLink('<a href = https://google.com >Google</a>').link
    ).to.equal(ans);

    expect(
        parsing.findLink('<a href =     https://google.com >Google</a>').link
    ).to.equal(ans);

    expect(
        parsing.findLink('<a href    =     https://google.com     >Google</a>').link
    ).to.equal(ans);

    expect(
        parsing.findLink('<a href    =     https://g ogle.com    >Google</a>').link
    ).to.equal('https://g');

    expect(
        parsing.findLink('<a href  =     https //google.com     >Google</a>').link
    ).to.equal('https');
  });

  it('findLink() should only remove one layer of quotes around the link', function () {
    // one level of nested quotes
    expect(
        parsing.findLink('<a href=\'\'https://google.com\'\'>Google</a>').link
    ).to.equal('\'https://google.com\'');

    expect(
        parsing.findLink('<a href=""https://google.com"">Google</a>').link
    ).to.equal('"https://google.com"');

    expect(
        parsing.findLink('<a href=\'"https://google.com"\'>Google</a>').link
    ).to.equal('"https://google.com"');

    expect(
        parsing.findLink('<a href="\'https://google.com\'">Google</a>').link
    ).to.equal('\'https://google.com\'');

    // one unmatched quote on the inside
    expect(
        parsing.findLink('<a href="\'https://google.com">Google</a>').link
    ).to.equal('\'https://google.com');

    expect(
        parsing.findLink('<a href="https://google.com\'">Google</a>').link
    ).to.equal('https://google.com\'');

    expect(
        parsing.findLink('<a href=\'"https://google.com\'>Google</a>').link
    ).to.equal('"https://google.com');

    expect(
        parsing.findLink('<a href=\'https://google.com"\'>Google</a>').link
    ).to.equal('https://google.com"');

    // more than one level of nested quotes
    expect(
        parsing.findLink('<a href=\'\'\'https://google.com\'\'\'>Google</a>').link
    ).to.equal('\'\'https://google.com\'\'');

    expect(
        parsing.findLink('<a href="""https://google.com""">Google</a>').link
    ).to.equal('""https://google.com""');

    expect(
        parsing.findLink('<a href=\'"\'https://google.com\'"\'>Google</a>').link
    ).to.equal('"\'https://google.com\'"');

    expect(
        parsing.findLink('<a href="\'"https://google.com"\'">Google</a>').link
    ).to.equal('\'"https://google.com"\'');
  });

  it('findLink() should handle multiple attributes', function () {
    expect(
        parsing.findLink('<a class="a-klass" id="a-id-1" href="https://stuff.com" >Stuff</a>').link
    ).to.equal('https://stuff.com');

    expect(
        parsing.findLink('<a class="href" id="a-id-1" href="https://stuff.com" >Stuff</a>').link
    ).to.equal('https://stuff.com');

    expect(
        parsing.findLink('<a class=href id="a-id-1" href=https://stuff.com >Stuff</a>').link
    ).to.equal('https://stuff.com');

    expect(
        parsing.findLink('<a class=href id="a-id-1" href = https://stuff.com >Stuff</a>').link
    ).to.equal('https://stuff.com');
  });

  it('findLink() should return the position up through which the link was searched for', function () {
    // cases where the link is found
    var str = '<a href="https://google.com"></a>';
    expect(
        parsing.findLink(str).pos
    ).to.equal(str.indexOf('>'));

    str = '<a class="bluhrz" href= https://google.com    ></a>';
    expect(
        parsing.findLink(str).pos
    ).to.equal(str.indexOf('>'));

    // case where the href attribute is not found but the tag is closed
    str = '<a class="bluhrz" = https://google.com ></a>';
    expect(
        parsing.findLink(str).pos
    ).to.equal(str.indexOf('>'));

    // cases where the opening anchor tag is not closed
    str = '<a class="bluhrz" href= https://google.com ';
    expect(
        parsing.findLink(str).pos
    ).to.equal(str.length);

    // case where opening anchor tag is not found
    str = 'href="https://google.com"';
    var ans = parsing.findLink(str);
    expect(ans.link).to.equal(null);
    expect(ans.pos).to.equal(str.length);
  });

  it('findLinks() should find the correct links', function () {
    var page =
      '<a href="https://google.com">google</a><a href="https://yahoo.com">yahoo</a>';
    var ans = parsing.findLinks(page);
    expect(ans).to.include('https://google.com');
    expect(ans).to.include('https://yahoo.com');
    expect(ans.length).to.equal(2);

    page = '<a href="https://google.com">google</a>';
    ans = parsing.findLinks(page);
    expect(ans).to.include('https://google.com');
    expect(ans.length).to.equal(1);

    page = '';
    ans = parsing.findLinks(page);
    expect(ans.length).to.equal(0);

    var numLinks = 1000;
    page = '<a href="https://google.com">google</a>'.repeat(numLinks);
    ans = parsing.findLinks(page);
    expect(ans.length).to.equal(numLinks);
    ans.forEach(function (link) {
      expect(link).to.equal('https://google.com')
    });
  });
});
