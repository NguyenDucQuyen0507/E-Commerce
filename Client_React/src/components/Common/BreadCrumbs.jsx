import React, { memo } from "react";
import { Link } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { BiCaretRight } from "react-icons/bi";
const BreadCrumbs = ({ title, category }) => {
  const routes = [
    { path: "/", breadcrumb: "Home" },
    { path: "/:category/:pid/:title", breadcrumb: title },
    { path: "/:category", breadcrumb: category },
  ];
  const breadcrumb = useBreadcrumbs(routes);
  // console.log(breadcrumb);
  return (
    <div className="flex gap-1">
      {breadcrumb
        ?.filter((el) => el.match.route)
        .map(({ match, breadcrumb }, index, self) => (
          <div className="flex">
            <Link
              className="flex items-center"
              key={match.pathname}
              to={match.pathname}
            >
              <span className="cursor-pointer hover:text-main text-sm capitalize">
                {breadcrumb}
              </span>

              {self.length - 1 !== index && <BiCaretRight size={14} />}
              {/* ["1","2","3"].length = 3,
                index = 2
              */}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default memo(BreadCrumbs);
