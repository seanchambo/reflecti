import { r, classNames } from '../../dist/reflecti';

const Footer = (props) => {
  return (
    <footer className="footer">
      <span className="todo-count">
        {props.activeCount} {`${props.activeCount === 1 ? 'item' : 'items'} left`}
      </span>
      <ul className="filters">
        <li
          onclick={() => { props.setFilter('ALL') }}>
          <a
            className={classNames({ selected: props.filter.type === 'ALL' })}>
            All
          </a>
        </li>
        <li
          onclick={() => { props.setFilter('ACTIVE') }}>
          <a
            className={classNames({ selected: props.filter.type === 'ACTIVE' })}>
            Active
          </a>
        </li>
        <li
          onclick={() => { props.setFilter('COMPLETED') }}>
          <a
            className={classNames({ selected: props.filter.type === 'COMPLETED' })}>
            Completed
          </a>
        </li>
      </ul>
    </footer>
  )
}

export default Footer;