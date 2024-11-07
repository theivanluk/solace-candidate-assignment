"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Advocates, Fields } from "./types/advocates";
import useSWR from "swr";
import useDebounce from "./hooks/useDebounce";
import { TableData } from "./components/tableData";
import { formatPhoneNumber } from "./utils/stringUtils";

const fields = [
  "First Name",
  "Last Name",
  "City",
  "Degree",
  "Specialties",
  "Years of Experience",
  "Phone Number",
];

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocates[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocates[]>([]);
  const fetcher = (url: string): Promise<void | Response> =>
    fetch(url).then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  const { data, error, isLoading } = useSWR("/api/advocates", fetcher);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchField, setSearchField] =
    useState<keyof typeof Fields>("Specialties");
  const debouncedSearchTerm = useDebounce(searchTerm);

  useEffect(() => {
    const term = debouncedSearchTerm.toLowerCase();
    const filteredAdvocates = advocates.filter((advocate) => {
      if (searchField === "Specialties") {
        return (
          advocate[Fields[searchField]].filter((specialty) =>
            specialty.toLowerCase().includes(term)
          ).length > 0
        );
      } else {
        return advocate[Fields[searchField]]
          .toString()
          .toLowerCase()
          .includes(term);
      }
    });
    setFilteredAdvocates(filteredAdvocates);
  }, [debouncedSearchTerm, searchField]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
  };

  const onClick = () => {
    setSearchField("Specialties");
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  const changeField = (e: ChangeEvent<HTMLSelectElement>) => {
    setSearchField(e.target.value as keyof typeof Fields);
  };

  return (
    <main className="flex flex-col justify-center">
      <section>
        <h1
          className={`
            bg-[rgb(29,67,57)]
            py-20
            text-center
            align-middle
            text-white
            font-bold
            text-4xl
          `}
        >
          Solace Advocates
        </h1>
        <div className="sticky top-0 left-0 px-6 py-6 bg-[rgb(53,72,85)] w-full min-h-[50px]">
          <div className="flex flex-row gap-2">
            <input
              placeholder="Searching for:"
              className="border border-solid border-white px-3 py-1 rounded"
              onChange={onChange}
              value={searchTerm}
            />
            <select
              value={searchField}
              onChange={changeField}
              className="border border-solid border-white px-3 py-1 rounded"
            >
              {fields.map((field) => (
                <option key={`field-${field}`}>{field}</option>
              ))}
            </select>
            <button
              onClick={onClick}
              className="bg-white border border-solid border-white px-3 py-1 rounded"
            >
              Reset Search
            </button>
          </div>
        </div>
      </section>
      <table>
        <thead className="bg-gray-200">
          <tr>
            {fields.map((field) => (
              <th key={`field-${field}`} className="py-2">
                {field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={`advocate-${advocate.id}`}>
                <TableData>{advocate.firstName}</TableData>
                <TableData>{advocate.lastName}</TableData>
                <TableData>{advocate.city}</TableData>
                <TableData>{advocate.degree}</TableData>
                <TableData>
                  {advocate.specialties.map((s) => (
                    <div key={`${advocate.id}-${s}`}>{s}</div>
                  ))}
                </TableData>
                <TableData>{advocate.yearsOfExperience}</TableData>
                <TableData>
                  {formatPhoneNumber(String(advocate.phoneNumber))}
                </TableData>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
