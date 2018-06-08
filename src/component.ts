export class Component {
  state: { [key: string]: any };
  actions: { [key: string]: Function };
  context: { [key: string]: any };
  props: { [key: string]: any };

  constructor(props) {
    this.props = props;
  }
}

/*
  const state = { hovered: false };
  const actions = { hover: value => state => ({ hovered: value }) };
  const view = (props) => (global, local) =>
    <div onHoverEnter={() => { local.actions.hover(true) }} onHoverLeave={() => { local.actions.hover(false)}} />;

  const withState(state, actions)(view);

  const withState = (state, actions) => {
    const component = new Component(state, actions);

    return (view) => {
      component.attach(view);

      return props => app => view(props)(app)
    }
    view => props => app => {
    return view(props)(app, { state, actions });
  }

*/
