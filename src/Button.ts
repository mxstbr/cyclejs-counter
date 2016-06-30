import xs, {Stream, MemoryStream} from 'xstream';
import {button, VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/xstream-typings';

export interface ButtonProps {
  text: string;
	amount: number;
}

export type Sources = {
  DOM: DOMSource,
  props$: Stream<ButtonProps>,
}
export type Sinks = {
  DOM: Stream<VNode>,
  delta$: Stream<number>,
}

function Button(sources: Sources): Sinks {
	let props$: Stream<ButtonProps> = sources.props$;
	const click$ = sources.DOM.select('.button').events('click')
	const delta$ = props$.map(
		(props) => click$.map((ev) => props.amount)
	).flatten();
	const vdom$ = props$.map(props => button('.button', [props.text]));

	return {
		DOM: vdom$,
		delta$: delta$
	}
}

export default Button;
