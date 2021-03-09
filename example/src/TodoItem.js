import { r, classNames } from '../../dist';

const TodoItem = (props) => {
  const className = classNames({ completed: props.todo.completed });

  return (
    <li className={className}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={props.todo.completed}
          onchange={props.ontoggle} />
        <label>{props.todo.title}</label>
        <button className="destroy" onclick={props.ondelete} />
      </div>
    </li>
  )
}

export default TodoItem
