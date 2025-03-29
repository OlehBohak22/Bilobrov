import { Link } from "react-router-dom";

export const Breadcrumbs: React.FC<{
  breadcrumbs: Array<{ name: string; link: string }>;
}> = ({ breadcrumbs }) => {
  return (
    <nav>
      <ul>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index}>
            <Link to={breadcrumb.link}>{breadcrumb.name}</Link>
            {index < breadcrumbs.length - 1 && " > "}
          </li>
        ))}
      </ul>
    </nav>
  );
};
