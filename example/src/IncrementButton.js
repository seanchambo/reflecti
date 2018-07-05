import { r } from '../../dist/reflecti';

import { withHover } from './withHover';

const view = props => (app) => {
  const className = [{ hovered: props.hovered }];

  return (
    <button
      className={className}
      onmouseenter={() => { props.hover(true) }}
      onmouseleave={() => { props.hover(false) }}
      onclick={() => { app.actions.increment(props.value) }}>
      {props.value > 0 ? '+' : '-'}
    </button>
  )
}

export default withHover(view);