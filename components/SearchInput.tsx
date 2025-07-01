"use client";

import { useEffect, useState } from "react";
import qs from "query-string";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import Input from "./Input";

const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce<string>(value, 500);

  useEffect(() => {
    const query = {
      title: debouncedValue,
    };
    const url = qs.stringifyUrl({
      url: "/search",
      query: query,
    });
    router.push(url);
  }, [debouncedValue, router]);

  return (
    <Input
      placeholder="Search for songs or artists..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default SearchInput;
