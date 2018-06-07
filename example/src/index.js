import { r, App } from '../../dist';

const state = { counter: 0 };

const actions = {
  increment: value => state => ({ counter: state.counter + value })
}

const app = new App(state, actions);

const IncrementButton = props => {
  return <button onClick={() => { props.increment(props.value) }}>{props.value > 0 ? '+' : '-'}</button>
}

const Counter = props => ({ state, actions }) => {
  return (
    <div>
      <h1>{state.counter}</h1>
      <div>
        <IncrementButton value={-1} increment={actions.increment} />
        <IncrementButton value={1} increment={actions.increment} />
      </div>
    </div>
  )
}

app.mount(Counter, document.getElementById('root'));