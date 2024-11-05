import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <Input
        placeholder="Tìm kiếm..."
        prefix={<SearchOutlined className="text-gray-500 mr-2" />}
        className="w-full sm:w-96 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 font-semibold"
        style={{ padding: "10px 20px" }}
      />
    </div>
  );
};

export default SearchBar;
