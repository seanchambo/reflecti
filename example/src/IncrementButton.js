import { r, withState } from '../../dist/reflecti';

const state = { hovered: false }

const actions = { hover: (value) => ({ hovered: value }) }

const view = props => (app, component) => {
  const className = [{ hovered: component.state.hovered }];

  return (
    <button
      className={className}
      onMouseEnter={() => { component.actions.hover(true) }}
      onMouseLeave={() => { component.actions.hover(false) }}
      onClick={() => { app.actions.increment(props.value) }}>
      {props.value > 0 ? '+' : '-'}
    </button>
  )
}

export default withState(state, actions)(view);