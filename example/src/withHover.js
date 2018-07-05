import { r, withState } from "../../dist/reflecti";

export const withHover = Component => {
  const state = { hovered: false };
  const actions = { hover: (value) => ({ hovered: value }) };

  const view = (props, children) => (_, component) => {
    return (
      <Component
        {...props}
        hovered={component.state.hovered}
        hover={component.actions.hover}>
        {children}
      </Component>
    )
  }

  return withState(state, actions)(view);
}