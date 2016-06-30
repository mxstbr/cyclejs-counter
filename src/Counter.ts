import xs, {Stream, MemoryStream} from 'xstream';
import {h2, div, VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/xstream-typings';
import isolate from '@cycle/isolate';

import Button, {ButtonProps} from './Button';

export type Sources = {
  DOM: DOMSource,
};
export type Sinks = {
  DOM: Stream<VNode>,
}

function Counter(sources: Sources): Sinks {
	const IncrementButton = isolate(Button);
	const DecrementButton = isolate(Button);

	let incrementButtonProps$ = xs.of<ButtonProps>({
    text: 'Increment', amount: 1
  }).remember();
	let decrementButtonProps$ = xs.of<ButtonProps>({
    text: 'Decrement', amount: -1
  }).remember();

	let incrementButton = IncrementButton({DOM: sources.DOM, props$: incrementButtonProps$});
	let decrementButton = DecrementButton({DOM: sources.DOM, props$: decrementButtonProps$});

	let count$ = xs.merge(incrementButton.delta$, decrementButton.delta$)
		.fold((acc, x) => acc + x, 0);

	return {
		DOM: xs.combine(count$, incrementButton.DOM, decrementButton.DOM)
      .map(([count, incrementVTree, decrementVTree]) =>
        div([
          incrementVTree,
					decrementVTree,
					h2('Clicks: ' + count),
        ])
      )
	};
}

export default Counter;
