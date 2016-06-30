import {run} from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';
import Counter from './Counter';

const main = Counter;

run(main, {
  DOM: makeDOMDriver('#main-container')
});
