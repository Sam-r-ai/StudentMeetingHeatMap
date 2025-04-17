import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    // Security check - only allow SELECT queries
    if (!query.trim().toLowerCase().startsWith('select')) {
      return NextResponse.json(
        { message: 'Only SELECT queries are allowed for security reasons' },
        { status: 403 }
      );
    }

    // Execute the raw SQL query
    const results = await db.execute(sql.raw(query));
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('SQL Query Error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'An error occurred executing the query' },
      { status: 500 }
    );
  }
}