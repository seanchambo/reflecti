import { r, createApp, mount } from '../../dist/reflecti';
import IncrementButton from './IncrementButton';

const state = { counter: 0 };

const actions = {
  increment: value => state => ({ counter: state.counter + value })
}

createApp(state, actions);

const Counter = props => (app) => {
  return (
    <div>
      <h1>{app.state.counter}</h1>
      <div>
        <IncrementButton value={-1} />
        <IncrementButton value={1} />
      </div>
    </div>
  )
}

mount(<Counter />, document.getElementById('root'));