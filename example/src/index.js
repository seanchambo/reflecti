import { r, createApp } from '../../dist/reflecti';

import TodoItem from './TodoItem';
import Footer from './Footer';

const state = {
  todos: [],
  filter: { type: 'ALL', fn: () => { return true; } }
};

const actions = {
  handleChange: (event) => {
    const todos = [...app.state.todos, { id: new Date().getTime().toString(), title: event.target.value, completed: false }]
    event.target.value = '';
    return { todos };
  },
  deleteTodo: (todo) => {
    const todos = app.state.todos.filter((t) => t.id !== todo.id);
    return { todos };
  },
  toggleTodo: (todo) => {
    todo.completed = !todo.completed;
    return { todos: app.state.todos };
  },
  setFilter: (filterType) => {
    let fn;
    switch (filterType) {
      case 'ALL':
        fn = () => { return true; }
      case 'ACTIVE':
        fn = record => !record.completed
      case 'COMPLETED':
        fn = record => record.completed
    }

    return { filter: { type: filterType, fn } };
  }
};

const View = (props) => {
  let main;
  let footer;
  const shownTodos = app.state.todos.filter(app.state.filter.fn);
  const todoItems = shownTodos.map(todo =>
    <TodoItem
      key={todo.id}
      todo={todo}
      ondelete={() => { app.actions.deleteTodo(todo); }}
      ontoggle={() => { app.actions.toggleTodo(todo); }} />
  )

  if (todoItems.length) {
    main = (
      <section className="main">
        <input
          className="toggle-all"
          type="checkbox"
          checked={true} />
        <ul className="todo-list">
          {todoItems}
        </ul>
      </section>
    )
  }

  if (app.state.todos.length) {
    footer = (
      <Footer
        filter={app.state.filter}
        setFilter={app.actions.setFilter}
        activeCount={app.state.todos.filter(record => !record.completed).length} />
    )
  }

  return (
    <section className="todoapp">
      <div>
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={app.state.newTodo}
            onchange={(event) => { app.actions.handleChange(event); }}
            autoFocus={true} />
        </header>
        {main}
        {footer}
      </div>
    </section>
  )
}

const app = createApp(state, actions);

app.mount(<View />, document.getElementById('root'));

export default app;