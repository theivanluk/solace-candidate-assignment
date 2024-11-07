"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Advocates, Fields } from "./types/advocates";
import useSWR from "swr";
import useDebounce from "./hooks/useDebounce";

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
    <main>
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
        <div className="px-6 py-6 bg-[rgb(53,72,85)]">
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
        <thead>
          <tr>
            {fields.map((field) => (
              <th key={`field-${field}`}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={`advocate-${advocate.id}`}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div key={`${advocate.id}-${s}`}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
