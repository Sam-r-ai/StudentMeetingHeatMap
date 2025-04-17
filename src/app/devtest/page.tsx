"use client";

import { db } from "@/db";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sql } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DevTest() {
  const [sqlQuery, setSqlQuery] = useState<string>(
    "SELECT * FROM \"Major\" LIMIT 10;"
  );
  const [queryExecuted, setQueryExecuted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Server action to execute raw SQL
  async function executeQuery(query: string) {
    try {
      // This is a client component, but we'll send the query to the server
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to execute query');
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred');
      }
      return [];
    }
  }

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["raw-sql", sqlQuery],
    queryFn: () => executeQuery(sqlQuery),
    enabled: queryExecuted,
  });

  const handleExecuteQuery = () => {
    setErrorMessage(null);
    setQueryExecuted(true);
    refetch();
  };

  return (
    <main className="container mx-auto p-4 max-w-6xl">
      <div className="mb-8">
        <Link href="/" className="flex items-center text-blue-500 hover:text-blue-700">
          <ArrowLeft className="mr-2" size={16} />
          Back to Heatmap
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-6">Database Development Testing</h1>
        <p className="text-gray-600 mb-4">
          Use this page to execute SQL queries against the database and visualize the results.
        </p>
      </div>

      <div className="grid gap-4 mb-8">
        <label className="font-medium">SQL Query:</label>
        <Textarea
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          rows={4}
          className="font-mono text-sm"
          placeholder="Enter SQL query here..."
        />
        <div>
          <Button
            onClick={handleExecuteQuery}
            disabled={isFetching || !sqlQuery.trim()}
            className="mr-2"
          >
            {isFetching ? "Executing..." : "Execute Query"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSqlQuery("SELECT * FROM \"Major\" LIMIT 10;");
              setQueryExecuted(false);
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          <p className="font-semibold">Error</p>
          <p className="font-mono text-sm whitespace-pre-wrap">{errorMessage}</p>
        </div>
      )}

      <div className="relative">
        <h2 className="text-xl font-semibold mb-4">Query Results</h2>
        
        {isFetching ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : data && data.length > 0 ? (
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(data[0]).map((column) => (
                    <th
                      key={column}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.entries(row).map(([key, value], colIndex) => (
                      <td key={`${rowIndex}-${colIndex}`} className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {value === null 
                          ? <span className="text-gray-400">null</span>
                          : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : queryExecuted && !isFetching ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4">
            No results returned from query.
          </div>
        ) : null}
        
        {queryExecuted && !isFetching && data && (
          <p className="mt-2 text-sm text-gray-500">
            {data.length} {data.length === 1 ? 'row' : 'rows'} returned
          </p>
        )}
      </div>
    </main>
  );
}