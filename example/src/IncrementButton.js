import { r, withState } from '../../dist/reflecti';

const state = { hovered: false }

const actions = { hover: (value) => ({ hovered: value }) }

const view = props => (app, component) => {
  const className = [{ hovered: component.state.hovered }];

  return (
    <button
      className={className}
      onmouseenter={() => { component.actions.hover(true) }}
      onmouseleave={() => { component.actions.hover(false) }}
      onclick={() => { app.actions.increment(props.value) }}>
      {props.value > 0 ? '+' : '-'}
    </button>
  )
}

export default withState(state, actions)(view);