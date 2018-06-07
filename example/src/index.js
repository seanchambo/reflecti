import { r, App } from '../../dist';

const state = { counter: 0 };

const actions = {
  increment: value => state => ({ counter: state.counter + value })
}

const app = new App(state, actions);

const Counter = props => ({ state, actions }) => {
  return (
    <div>
      <h1>{state.counter}</h1>
      <div>
        <button onClick={() => { actions.increment(-1) }}>-</button>
        <button onClick={() => { actions.increment(1) }}>+</button>
      </div>
    </div>
  )
}

app.mount(Counter, document.getElementById('root'));