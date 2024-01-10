import { useSelector } from "react-redux";
import {
  Banner,
  Sidebar,
  BestSellers,
  DealDaily,
  FeaturedProduct,
  CustomSlide,
} from "../../components";
import { IoIosArrowForward } from "react-icons/io";
import withBaseComponent from "hocs/withBaseComponent";
import { createSearchParams } from "react-router-dom";
const Home = ({ navigate }) => {
  const { newProducts } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.app);
  return (
    <>
      <div className="w-main my-0 mx-auto">
        <div className="w-main flex mt-6">
          <div className="flex flex-col gap-5 w-[20%] flex-auto">
            <Sidebar />
            <DealDaily />
          </div>
          <div className="flex flex-col gap-5 pl-5 w-[80%] flex-auto">
            <Banner />
            <BestSellers />
          </div>
        </div>
        <div className="my-8">
          <FeaturedProduct />
        </div>
        <div className="my-8 w-full">
          <h2 className="text-[20px] font-medium border-b-2 border-main pb-2 ">
            NEW ARRIVALS
          </h2>
          <div className=" mt-8 mx-[-10px]">
            <CustomSlide products={newProducts} />
          </div>
        </div>
        <div className="my-8 w-full">
          <h2 className="text-[20px] font-medium border-b-2 border-main pb-2 ">
            HOT COLLECTIONS
          </h2>
          <div className="flex flex-wrap mx-[-10px]">
            {categories
              .filter((el) => el.brand.length > 0)
              .map((el, index) => (
                <div
                  key={index}
                  className=" mt-[20px] w-1/3 flex-initial px-[10px]"
                >
                  <div className="w-full min-h-[200px] border flex justify-start gap-8 p-5">
                    <img
                      src={el.image}
                      alt=""
                      className="w-[144px] h-[129px] object-cover"
                    />
                    <div>
                      <h2 className="text-[14px] uppercase font-semibold mb-3 opacity-[0.8]">
                        {el.title}
                      </h2>
                      <ul>
                        {el.brand.map((e, index) => (
                          <span
                            onClick={() => {
                              navigate({
                                pathname: `/${el.title.toLowerCase()}`,
                                search: createSearchParams({
                                  brand: e.toLowerCase(),
                                }).toString(),
                              });
                            }}
                            className="text-gray-400 flex items-center text-[14px] cursor-pointer hover:underline"
                            key={index}
                          >
                            <IoIosArrowForward />
                            {e}
                          </span>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="my-8 w-full">
          <h2 className="text-[20px] font-medium border-b-2 border-main pb-2 ">
            BLOG POSTS
          </h2>
        </div>
        {/* <div className="w-full h-[500px]"></div> */}
      </div>
    </>
  );
};

export default withBaseComponent(Home);
