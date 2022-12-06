const test = require('ava');
const quotes = require('../match-pull-quote.js');

test('headline with no quote', t => {
  const m = quotes("A sentence with no quote");
  t.falsy(m)
});

test("'A quote' at the start of the sentence is matched", t => {
  const m = quotes(t.title)
  t.is(m.length, 1);
  t.is(m[0], 'A quote');
});

test("a quote in 'middle of' the sentence", t => {
  const m = quotes(t.title);

  t.is(m.length, 1);
  t.is(m[0], 'middle of');
});

test("there's two apostrophes in the cat's pyjamas", t => {
  const m = quotes(t.title);
  t.falsy(m);
});


test("there are 'two quotes' in 'this here' headline", t => {
  const m = quotes(t.title);

  t.is(m.length, 2);
  t.is(m[0], 'two quotes');
  t.is(m[1], 'this here');
});

test("'It's possible' to have an apostophe in a quote", t => {
  const m = quotes(t.title);
  t.is(m.length, 1);
  t.is(m[0], "It's possible");
});

// todo
// test("'Put the parents in boot camp.' Sir Bob Harvey slams National's 'crazy' proposal")