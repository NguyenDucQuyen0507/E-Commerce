// import axios from "../library/axios";
import { memo } from "react";
import { NavLink } from "react-router-dom";
import { converSlug } from "../../utils/helpers";
import { useSelector } from "react-redux";
const Sidebar = () => {
  // const [category, setCategory] = useState([]);
  // const fetchCategories = async () => {
  //   const response = await apiGetCategories();
  //   if (response.success) {
  //     setCategory(response.getCategoryProduct);
  //   }
  // };
  // //** Dùng cách nào cũng dc
  // useEffect(() => {
  //   fetchCategories();
  //   // axios.get("/productCategory").then((response) => {
  //   //   setCategory(response.getCategoryProduct);
  //   // console.log(response.getCategoryProduct);
  //   // });
  // }, []);
  const { categories } = useSelector((state) => state.app);
  return (
    <div className="flex flex-col border">
      {categories &&
        categories.map((cate, index) => {
          return (
            <NavLink
              key={index}
              to={converSlug(cate.title)}
              className={({ isActive }) =>
                isActive
                  ? "hover:text-main px-5 pt-[15px] pb-[15px] text-sm bg-main"
                  : "px-5 pt-[15px] pb-[15px] text-sm hover:text-main"
              }
            >
              {cate.title}
            </NavLink>
          );
        })}
    </div>
  );
};

export default memo(Sidebar);
