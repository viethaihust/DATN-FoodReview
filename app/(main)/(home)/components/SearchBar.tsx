import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/tim-kiem?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex justify-center items-center py-4">
      <Input
        placeholder="Tìm kiếm..."
        prefix={<SearchOutlined className="text-gray-500 mr-2" />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onPressEnter={handleSearch}
        className="w-full sm:w-96 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 font-semibold"
        style={{ padding: "10px 20px" }}
      />
    </div>
  );
};

export default SearchBar;
