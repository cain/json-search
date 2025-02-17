"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Flags from "country-flag-icons/react/3x2"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import map from "./map.json"

interface DataItem {
  Country: string
  Document_Type: string
  Price: number
  Source: string
  Link: string
}

const countryCodeMap: { [key: string]: string } = {
  Albania: "AL",
  Algeria: "DZ",
  Andorra: "AD",
  Angola: "AO",
  Argentina: "AR",
  Aruba: "AW",
  Australia: "AU",
  Austria: "AT",
  Azerbaijan: "AZ",
  Bahamas: "BS",
  Bahrain: "BH",
  Brazil: "BR",
  "British Virgin Islands": "VG",
  Bulgaria: "BG",
  Cambodia: "KH",
  "Canada - New Brunswick": "CA",
  "Canada - Newfoundland and Labrador": "CA",
  "Canada - Prince Edward Island": "CA",
  "Canada Federal": "CA",
  "Cayman Islands": "KY",
  Chile: "CL",
  China: "CN",
  Colombia: "CO",
  Philippines: "PH",
  Poland: "PL",
  Portugal: "PT",
  "Puerto Rico": "PR",
  Qatar: "QA",
  "United Kingdom": "GB",
  Uruguay: "UY",
  "US- U.S. Virgin Islands (Territories)": "VI",
  "US-Alabama": "US",
  "US-Wisconsin": "US",
  "US-Wyoming": "US",
  Uzbekistan: "UZ",
  Vanuatu: "VU",
  Zambia: "ZM"
}

// Add this constant for the map
// const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

export default function Page() {
  const [data, setData] = useState<DataItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState<DataItem[]>([])

  useEffect(() => {
    // Fetch the JSON data
    fetch("/Company-Documents-Register.json")
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData)
        setFilteredData(jsonData)
      })
      .catch((error) => console.error("Error fetching data:", error))
  }, [])

  useEffect(() => {
    // Filter data based on search term
    const filtered = data.filter((item) =>
      Object.values(item).some((value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredData(filtered)
  }, [searchTerm, data])

  const getCountryFlag = (countryName: string) => {
    const code = countryCodeMap[countryName] || countryName.slice(0, 2).toUpperCase()
    // @ts-ignore: Flags object keys are not fully typed
    const FlagComponent = Flags[code]
    return FlagComponent ? <FlagComponent className="w-6 h-4 mr-2 inline-block" /> : null
  }

  // Add this function to handle map clicks
  const handleCountryClick = (countryName: string) => {
    setSearchTerm(countryName)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-20 px-4 mb-5">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Worldwide Company Documents</h1>
          <p className="text-xl mb-8">Find registration details and documents from around the world 🌍</p>
        </div>
      </div>

        {/* Search and Results Section */}
        <Input
          type="text"
          placeholder="Search for country, document type, or source..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2 max-w-md mx-auto"
        />

        <div className="text-center mb-4">
          <small className="text-gray-500">or click anywhere on the map to search for documents in that country</small>
        </div>


      {/* Add Map Section */}
      <div className="container mx-auto">
        <div className="max-w-[600px] mx-auto mb-2">
      <ComposableMap projectionConfig={{
        rotate: [0, 0, 0],
        center: [0, 40],
        scale: 147
      }} projection="geoMercator">
        <ZoomableGroup center={[0, 0]} zoom={1}>
            <Geographies geography={map}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      const countryName = geo.properties.name
                      handleCountryClick(countryName)
                    }}
                    style={{
                      default: {
                        fill: "#D6D6DA",
                        outline: "none",
                      },
                      hover: {
                        fill: "#F53",
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#E42",
                        outline: "none",
                      },
                    }}
                  />
                ))
              }
            </Geographies>
          </ZoomableGroup>
          </ComposableMap>
        </div>


        {true && (
          <>
            {/* <h2 className="text-2xl font-bold mb-4">Search Results</h2> */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {getCountryFlag(item.Country)}
                      {item.Country}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                      {item.Document_Type}
                      <a
                        href={item.Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Link
                      </a>
                      </div>
                    </TableCell>
                    <TableCell>${item.Price}</TableCell>
                    <TableCell><small>{item.Source}</small></TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        {searchTerm && filteredData.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No results found. Try a different search term.</p>
        )}
      </div>
    </div>
  )
}

